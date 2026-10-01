import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const evaluationPath = join(root, "career/operations/agent-evaluation.json");
const reportPath = join(root, "career/operations/report.json");
const dashboardPath = join(root, "src/data/career-dashboard.json");
const failures = [];

if (!existsSync(evaluationPath)) failures.push("missing career/operations/agent-evaluation.json");
if (!existsSync(reportPath)) failures.push("missing career/operations/report.json");
if (!existsSync(dashboardPath)) failures.push("missing src/data/career-dashboard.json");

if (!failures.length) {
  const evaluation = JSON.parse(readFileSync(evaluationPath, "utf8"));
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const dashboard = JSON.parse(readFileSync(dashboardPath, "utf8"));
  const manifestIds = Object.keys(manifest).sort();
  const evaluatedIds = Object.keys(evaluation.cvEvaluations ?? {}).sort();
  const reportIds = (report.cvs ?? []).map((cv) => cv.id).sort();

  if (evaluation.status !== "complete") failures.push(`agent evaluation status is ${evaluation.status ?? "missing"}, expected complete`);
  if (JSON.stringify(manifestIds) !== JSON.stringify(evaluatedIds)) failures.push("agent evaluation does not contain exactly every manifest CV ID");
  if (JSON.stringify(manifestIds) !== JSON.stringify(reportIds)) failures.push("operations report does not contain exactly every manifest CV ID");

  for (const [id, cv] of Object.entries(evaluation.cvEvaluations ?? {})) {
    if (cv.decision === "blocked") continue;
    const dimensions = ["score", "factualGrounding", "atsStructure", "roleAlignment", "languageQuality", "recruiterClarity", "sourceIntegrity"];
    for (const dimension of dimensions) if (cv.readiness?.[dimension] !== 100) failures.push(`${id}: readiness.${dimension} must be 100`);
  }

  const historyPath = join(root, `career/operations/runs/${evaluation.runId}.json`);
  if (!existsSync(historyPath)) failures.push(`missing immutable run history ${historyPath}`);
  if (!dashboard.operations || dashboard.operations.generatedAt !== report.generatedAt) failures.push("dashboard does not contain the current operations report");
}

if (failures.length) {
  for (const failure of failures) console.error(`Career operation invalid: ${failure}`);
  process.exitCode = 1;
} else {
  const qualityCheck = spawnSync(process.execPath, [join(root, "scripts/validate-cv-content.mjs")], { stdio: "inherit" });
  if (qualityCheck.status !== 0) process.exitCode = qualityCheck.status || 1;
  else console.log(`Career operation complete and valid (${Object.keys(manifest).length} CVs).`);
}
