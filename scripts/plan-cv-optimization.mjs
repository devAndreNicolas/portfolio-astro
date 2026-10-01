import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
try { process.loadEnvFile(join(root, ".env")); } catch { /* CI uses secrets */ }
if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is required for CV planning.");
const reports = JSON.parse(readFileSync(join(root, "career/applications/analysis/index.json"), "utf8")).reports;
const master = readFileSync(join(root, "career/profile/master-career.md"), "utf8");
const ai = genkit({ plugins: [googleAI()], model: googleAI.model("gemini-flash-latest") });
const schema = z.object({
  canonicalCv: z.string(),
  decision: z.enum(["optimize-canonical", "create-derivative", "skip"]),
  evidenceIds: z.array(z.string()),
  jobSources: z.array(z.string()),
  rationale: z.string(),
});

const candidates = reports.filter((report) => report.deterministicEvidenceCoverage.score >= 75);
const groups = Map.groupBy(candidates, (report) => report.recommendedCanonicalCv);
const plans = [];
for (const [canonicalCv, jobs] of groups) {
  const allowedEvidence = [...new Set(jobs.flatMap((job) => job.evidenceToPrioritize))];
  const prompt = `You are a CV evidence planner. Never invent claims.\nCanonical CV: ${canonicalCv}\nAllowed evidence IDs: ${allowedEvidence.join(", ")}\nJobs: ${JSON.stringify(jobs.map((job) => ({ source: job.source, score: job.deterministicEvidenceCoverage.score, supported: job.supportedRequirements, gaps: job.evidenceGaps })))}\nMaster evidence ledger: ${master}\nChoose only allowed evidence IDs. Select optimize-canonical when shared job patterns improve the canonical CV; create-derivative only for a narrow role-specific emphasis; skip if evidence gaps make tailoring unsafe.`;
  const response = await ai.generate({ prompt, output: { schema } });
  const plan = response.output;
  if (!plan || plan.canonicalCv !== canonicalCv || plan.evidenceIds.some((id) => !allowedEvidence.includes(id)) || plan.jobSources.some((source) => !jobs.some((job) => job.source === source))) throw new Error(`Invalid evidence plan for ${canonicalCv}.`);
  plans.push(plan);
}
mkdirSync(join(root, "career/automation"), { recursive: true });
writeFileSync(join(root, "career/automation/optimization-plans.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), plans }, null, 2)}\n`);
console.log(`Wrote ${plans.length} evidence-grounded CV optimization plans.`);
