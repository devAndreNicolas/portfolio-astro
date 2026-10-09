import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const taxonomy = JSON.parse(readFileSync(join(root, "career/ats/taxonomy.json"), "utf8"));
const analysis = JSON.parse(readFileSync(join(root, "career/applications/analysis/index.json"), "utf8")).reports;
const outputDirectory = join(root, "career/operations");
const terms = new Map(taxonomy.terms.map((term) => [term.id, term]));
const weights = { required: 3, core: 2, preferred: 1 };

function normalize(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matches(text, phrase) {
  const escaped = normalize(phrase).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "u").test(text);
}

function expandTex(path, seen = new Set()) {
  const absolute = resolve(path);
  if (seen.has(absolute)) return "";
  seen.add(absolute);
  const source = readFileSync(absolute, "utf8");
  return source.replace(/\\input\{([^}]+)\}/g, (statement, input) => {
    const candidate = extname(input) ? input : `${input}.tex`;
    try { return `\n${expandTex(resolve(root, candidate), seen)}`; } catch { return statement; }
  });
}

function cvText(cv) {
  return normalize(expandTex(join(root, cv.source))
    .replace(/%.*$/gm, "")
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?/g, " ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " "));
}

const texts = new Map(Object.entries(manifest).map(([id, cv]) => [id, cvText(cv)]));
const results = analysis.map((application) => {
  const cvId = application.recommendedCanonicalCv;
  const text = texts.get(cvId) ?? "";
  const requirements = [...application.supportedRequirements, ...application.evidenceGaps]
    .sort((a, b) => ({ required: 3, core: 2, preferred: 1 }[b.tier] - ({ required: 3, core: 2, preferred: 1 }[a.tier])));
  const evaluated = requirements.map((requirement) => {
    const term = terms.get(requirement.id);
    const presentInCv = Boolean(term?.phrases.some((phrase) => matches(text, phrase)));
    const evidenceBacked = Boolean(term?.evidence?.length);
    return { id: requirement.id, tier: requirement.tier, evidenceBacked, presentInCv };
  });
  const totalWeight = evaluated.reduce((sum, item) => sum + weights[item.tier], 0);
  const claimableWeight = evaluated.filter((item) => item.evidenceBacked && item.presentInCv).reduce((sum, item) => sum + weights[item.tier], 0);
  const cvCoverage = totalWeight ? Math.round((claimableWeight / totalWeight) * 100) : 0;
  const requiredMissing = evaluated.filter((item) => item.tier === "required" && !item.presentInCv).map((item) => item.id);
  const unsupportedRequired = evaluated.filter((item) => item.tier === "required" && !item.evidenceBacked).map((item) => item.id);
  const missingFromCv = evaluated.filter((item) => !item.presentInCv).map((item) => item.id);
  const originalScore = application.deterministicEvidenceCoverage.score;
  const status = unsupportedRequired.length || requiredMissing.length ? "review-critical-gaps" : cvCoverage >= 70 ? "strong-fit" : "needs-tailoring";
  return {
    source: application.source,
    recommendedCanonicalCv: cvId,
    originalEvidenceCoverage: originalScore,
    cvClaimableCoverage: cvCoverage,
    delta: originalScore - cvCoverage,
    status,
    requiredMissing,
    unsupportedRequired,
    missingFromCv,
    evaluatedRequirements: evaluated.length
  };
});

const summary = [...new Set(results.map((result) => result.recommendedCanonicalCv))].map((cvId) => {
  const items = results.filter((result) => result.recommendedCanonicalCv === cvId);
  return {
    cv: cvId,
    vacancyCount: items.length,
    averageOriginalEvidenceCoverage: Math.round(items.reduce((sum, item) => sum + item.originalEvidenceCoverage, 0) / items.length),
    averageCvClaimableCoverage: Math.round(items.reduce((sum, item) => sum + item.cvClaimableCoverage, 0) / items.length),
    averageDelta: Math.round(items.reduce((sum, item) => sum + item.delta, 0) / items.length),
    criticalGapVacancies: items.filter((item) => item.status === "review-critical-gaps").length
  };
});

const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  definition: "Independent fit audit: compares recognized job requirements with the actual recommended CV text and evidence-backed terms. It is not ATS pass probability or a hiring prediction.",
  thresholds: { strongFit: "claimable coverage >= 70% and no missing/unsupported required term", criticalGap: "any required term missing from the CV or lacking Master Career evidence" },
  summary,
  applications: results
};

if (process.argv.includes("--write")) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, "cv-role-fit-audit.json"), `${JSON.stringify(output, null, 2)}\n`);
  const markdown = [
    "# CV role-fit audit", "",
    output.definition, "",
    "| CV | Vagas | Cobertura de evidência | Cobertura real no CV | Delta | Gaps críticos |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...summary.map((item) => `| ${item.cv} | ${item.vacancyCount} | ${item.averageOriginalEvidenceCoverage}% | ${item.averageCvClaimableCoverage}% | ${item.averageDelta} pp | ${item.criticalGapVacancies} |`),
    "", "## Vagas que exigem revisão", "",
    ...results.filter((item) => item.status !== "strong-fit").map((item) => `- **${item.source}** — ${item.status}; CV ${item.recommendedCanonicalCv}; cobertura ${item.cvClaimableCoverage}%; ausências: ${item.missingFromCv.join(", ") || "nenhuma"}.`), ""
  ].join("\n");
  writeFileSync(join(outputDirectory, "cv-role-fit-audit.md"), `${markdown}\n`);
}

for (const item of summary) console.log(`${item.cv}: ${item.averageCvClaimableCoverage}% actual CV coverage across ${item.vacancyCount} vacancy/vacancies (original ${item.averageOriginalEvidenceCoverage}%)`);
if (process.argv.includes("--strict") && results.some((item) => item.status === "review-critical-gaps")) process.exitCode = 2;
