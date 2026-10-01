import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const applications = JSON.parse(readFileSync(join(root, "career/applications/analysis/index.json"), "utf8")).reports;
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const collectionPath = join(root, "career/applications/collected-index.json");
const collection = existsSync(collectionPath) ? JSON.parse(readFileSync(collectionPath, "utf8")) : {};
const output = join(root, "src/data/career-dashboard.json");

function sourceUrl(source) {
  const path = join(root, source);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8").match(/^Source URL:\s*(.+)$/m)?.[1] ?? null;
}

const jobs = applications.map((report) => ({
  id: report.sourceSha256.slice(0, 12),
  name: basename(report.source, ".txt"),
  sourceUrl: sourceUrl(report.source),
  language: report.language,
  recommendedCv: report.recommendedCanonicalCv,
  coverage: report.deterministicEvidenceCoverage.score,
  requirementCount: report.deterministicEvidenceCoverage.recognizedRequirementCount,
  gaps: report.evidenceGaps.map((gap) => gap.id),
  evidence: report.evidenceToPrioritize,
})).sort((a, b) => b.coverage - a.coverage || a.name.localeCompare(b.name));

const dashboard = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  collection: collection.lastRun ?? null,
  totals: { jobs: jobs.length, strongMatches: jobs.filter((job) => job.coverage >= 75).length, canonicalCvs: Object.values(manifest).filter((cv) => cv.public).length },
  cvs: Object.entries(manifest).filter(([, cv]) => cv.public).map(([id, cv]) => ({ id, language: cv.language, href: `/${cv.output.replace(/^public\//, "")}` })),
  jobs,
};

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(dashboard, null, 2)}\n`);
console.log(`Wrote ${jobs.length} dashboard jobs to src/data/career-dashboard.json.`);
