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
const ai = genkit({ plugins: [googleAI()] });
const modelIds = [...new Set([process.env.GEMINI_MODEL ?? "gemini-3.6-flash", "gemini-3.5-flash-lite"])];
const schema = z.object({
  canonicalCv: z.string(),
  decision: z.enum(["optimize-canonical", "create-derivative", "skip"]),
  evidenceIds: z.array(z.string()),
  jobSources: z.array(z.string()),
  rationale: z.string(),
});
const sleep = (milliseconds) => new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));
async function generateWithRetry(prompt) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const modelId = modelIds[attempt % modelIds.length];
    try { return await ai.generate({ model: googleAI.model(modelId), prompt, output: { schema } }); }
    catch (error) {
      lastError = error;
      const retryable = error?.status === "UNAVAILABLE" || error?.code === 429 || error?.code === 503;
      if (!retryable || attempt === 4) throw error;
      const wait = 2_000 * (2 ** attempt) + Math.floor(Math.random() * 1_000);
      console.warn(`Gemini model ${modelId} unavailable; retrying CV plan in ${wait}ms (attempt ${attempt + 2}/5).`);
      await sleep(wait);
    }
  }
  throw lastError;
}

const candidates = reports.filter((report) => report.deterministicEvidenceCoverage.score >= 75);
const groups = Map.groupBy(candidates, (report) => report.recommendedCanonicalCv);
const plans = [];
for (const [canonicalCv, jobs] of groups) {
  const allowedEvidence = [...new Set(jobs.flatMap((job) => job.evidenceToPrioritize))];
  const prompt = `You are a CV evidence planner. Never invent claims.\nCanonical CV: ${canonicalCv}\nAllowed evidence IDs: ${allowedEvidence.join(", ")}\nJobs: ${JSON.stringify(jobs.map((job) => ({ source: job.source, score: job.deterministicEvidenceCoverage.score, supported: job.supportedRequirements, gaps: job.evidenceGaps })))}\nMaster evidence ledger: ${master}\nChoose only allowed evidence IDs. Select optimize-canonical when shared job patterns improve the canonical CV; create-derivative only for a narrow role-specific emphasis; skip if evidence gaps make tailoring unsafe.`;
  let plan;
  try {
    const response = await generateWithRetry(prompt);
    plan = response.output;
  } catch (error) {
    if (error?.status !== "UNAVAILABLE" && error?.code !== 503) throw error;
    console.warn(`Gemini remained unavailable; using deterministic evidence plan for ${canonicalCv}.`);
    plan = {
      canonicalCv,
      decision: "optimize-canonical",
      evidenceIds: allowedEvidence.slice(0, 8),
      jobSources: jobs.slice(0, 3).map((job) => job.source),
      rationale: "Deterministic fallback: prioritizes evidence shared by the highest-coverage matching vacancies."
    };
  }
  if (!plan || plan.canonicalCv !== canonicalCv || plan.evidenceIds.some((id) => !allowedEvidence.includes(id)) || plan.jobSources.some((source) => !jobs.some((job) => job.source === source))) throw new Error(`Invalid evidence plan for ${canonicalCv}.`);
  plans.push(plan);
}
mkdirSync(join(root, "career/automation"), { recursive: true });
writeFileSync(join(root, "career/automation/optimization-plans.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), plans }, null, 2)}\n`);
console.log(`Wrote ${plans.length} evidence-grounded CV optimization plans.`);
