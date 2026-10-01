import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const reports = JSON.parse(readFileSync(join(root, "career/applications/analysis/index.json"), "utf8")).reports;
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const roles = JSON.parse(readFileSync(join(root, "career/roles/recommendations.json"), "utf8")).recommendations;
const output = join(root, "career/operations/report.json");
const evaluationPath = join(root, "career/operations/agent-evaluation.json");
const evaluation = existsSync(evaluationPath) ? JSON.parse(readFileSync(evaluationPath, "utf8")) : null;

function family(id) { return id.replace(/-(br|international)$/, ""); }
function reportsFor(id, language) {
  const direct = reports.filter((report) => report.recommendedCanonicalCv === id);
  if (direct.length) return direct;
  const requiredTerm = id.startsWith("angular-developer") ? "angular"
    : id.startsWith("react-developer") ? "react"
      : id.startsWith("product-engineer") ? "product"
        : null;
  if (!requiredTerm) return direct;
  return reports.filter((report) => report.language === language && report.supportedRequirements.some((requirement) => requirement.id === requiredTerm));
}
function structuralState(source) {
  const text = readFileSync(join(root, source), "utf8");
  const risks = [];
  if (/\\usepackage\{paracol\}|\\begin\{paracol\}|\\begin\{multicols\}/.test(text)) risks.push("multi-column-layout");
  if (/\\begin\{(?:tabular\*?|tabularx|longtable)\}/.test(text)) risks.push("table-layout");
  if (/\\includegraphics/.test(text)) risks.push("image-content");
  return { status: risks.length ? "needs-ats-rebuild" : "ats-structure-ok", risks };
}

const cvs = Object.entries(manifest).map(([id, cv]) => {
  const matched = reportsFor(id, cv.language);
  const coverage = matched.length ? Math.round(matched.reduce((sum, report) => sum + report.deterministicEvidenceCoverage.score, 0) / matched.length) : 0;
  const source = readFileSync(join(root, cv.source), "utf8");
  return {
    id,
    family: family(id),
    language: cv.language,
    public: cv.public,
    source: cv.source,
    output: cv.output,
    sourceSha256: createHash("sha256").update(source).digest("hex"),
    matchingVacancies: matched.length,
    averageEvidenceCoverage: coverage,
    ...structuralState(cv.source),
    optimizationPriority: matched.length && coverage >= 75 ? "high" : matched.length ? "normal" : "low",
    agentEvaluation: evaluation?.cvEvaluations?.[id] ?? null,
  };
});

const plannedVariants = [
  { id: "angular-developer-br", title: "Desenvolvedor Angular", language: "pt-BR", sourceRole: "angular-developer", priority: "high", reason: "9 saved vacancies and 77 role score; Angular, TypeScript, Signals and RxJS have documented evidence." },
  { id: "angular-developer-international", title: "Angular Developer", language: "en", sourceRole: "angular-developer", priority: "high", reason: "A reusable English variant is needed for international Angular openings; claims remain grounded in the same evidence." },
  { id: "react-developer-br", title: "Desenvolvedor React", language: "pt-BR", sourceRole: "react-developer", priority: "high", reason: "9 saved vacancies and 77 role score; React, TypeScript, Next.js and testing have documented evidence." },
  { id: "react-developer-international", title: "React Developer", language: "en", sourceRole: "react-developer", priority: "high", reason: "A reusable English variant is needed for international React openings; claims remain grounded in the same evidence." },
  { id: "product-engineer-br", title: "Engenheiro de Produto", language: "pt-BR", sourceRole: "software-engineer-product", priority: "normal", reason: "Product-oriented engineering is strongly represented in the corpus and evidence ledger; the Brazilian canonical counterpart is missing." },
].map((variant) => ({ ...variant, status: manifest[variant.id] ? "available" : "planned" }));

const report = {
  $schema: "./report.schema.json",
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  definitions: {
    synergy: "Weighted evidence coverage of recognized vacancy requirements. It is not an ATS-pass or interview-probability score.",
    atsStructure: "Static source checks for known ATS risks; PDF text extraction and visual review remain separate checks.",
  },
  totals: {
    analyzedVacancies: reports.length,
    strongMatches: reports.filter((report) => report.deterministicEvidenceCoverage.score >= 75).length,
    canonicalCvs: cvs.length,
    atsStructureReady: cvs.filter((cv) => cv.status === "ats-structure-ok").length,
    plannedVariants: plannedVariants.filter((variant) => variant.status === "planned").length,
  },
  recommendedRoles: roles.map((role) => ({ id: role.id, titles: role.titles, score: role.score, matchingSavedVacancies: role.matchingSavedVacancies, cvFamily: role.cvFamily, evidenceGaps: role.evidenceGaps })),
  cvs,
  plannedVariants,
  agentRun: evaluation ? { runId: evaluation.runId, status: evaluation.status, generatedAt: evaluation.generatedAt, unresolvedQuestions: evaluation.unresolvedQuestions } : null,
};

mkdirSync(join(root, "career/operations"), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Wrote career operations report for ${cvs.length} canonical CVs and ${plannedVariants.filter((variant) => variant.status === "planned").length} planned variants.`);
