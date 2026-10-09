import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const applicationsDirectory = join(root, "career/applications");
const reportDirectory = join(applicationsDirectory, "analysis");
const taxonomy = JSON.parse(readFileSync(join(root, "career/ats/taxonomy.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const write = process.argv.includes("--write");
const selectors = process.argv.slice(2).filter((argument) => argument !== "--write" && argument !== "--");

const tierWeights = { required: 3, core: 2, preferred: 1 };
const tierRank = { preferred: 1, core: 2, required: 3 };

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "analysis" ? [] : walk(path);
    return entry.isFile() && extname(entry.name).toLowerCase() === ".txt" && statSync(path).size > 0 ? [path] : [];
  });
}

function normalize(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function decodeJobDescription(value) {
  if (!value.includes("Ã")) return value;
  const repaired = Buffer.from(value, "latin1").toString("utf8");
  return (repaired.match(/Ã/g)?.length ?? 0) < (value.match(/Ã/g)?.length ?? 0) ? repaired : value;
}

function matches(text, phrase) {
  const escaped = normalize(phrase).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "u").test(text);
}

function sectionTier(line, currentTier) {
  const normalized = normalize(line);
  if (/(must have|required|required qualifications|requirements|requisitos|o que esperamos|qualificacoes)/.test(normalized)) return "required";
  if (/(nice to have|preferred|differential|desejavel|diferencial|sera um diferencial)/.test(normalized)) return "preferred";
  if (/(responsibilities|what you.ll do|dia a dia|responsabilidades|about the role)/.test(normalized)) return "core";
  return currentTier;
}

function inferLanguage(text) {
  const portugueseSignals = /(sobre a vaga|requisitos|desenvolvedor|experiencia|voce|voce vai)/;
  return portugueseSignals.test(normalize(text)) ? "pt-BR" : "en";
}

function inferRole(filename, matchedTerms) {
  const name = normalize(filename);
  if (/designer|ux|ui.?ux/.test(name)) return "ux-product-designer";
  if (/front.?end|angular|react/.test(name)) return "frontend-engineer";
  if (/product/.test(name)) return "product-engineer";
  if (/web/.test(name)) return "web-developer";
  if (/full.?stack/.test(name)) return "fullstack-engineer";
  if (/software|architect|engenheiro/.test(name)) return "software-engineer";
  const scores = new Map();
  for (const term of matchedTerms) for (const role of term.cvs) scores.set(role, (scores.get(role) ?? 0) + tierWeights[term.tier]);
  return [...scores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "software-engineer";
}

function canonicalCvId(role, language) {
  const desired = `${role}-${language === "pt-BR" ? "br" : "international"}`;
  if (manifest[desired]) return desired;
  const fallback = Object.keys(manifest).find((id) => id.startsWith(role));
  return fallback ?? "software-engineer-international";
}

function analyze(file) {
  const raw = decodeJobDescription(readFileSync(file, "utf8"));
  const lines = raw.split(/\r?\n/);
  let activeTier = "core";
  const found = new Map();

  for (const line of lines) {
    activeTier = sectionTier(line, activeTier);
    const normalized = normalize(line);
    for (const term of taxonomy.terms) {
      if (!term.phrases.some((phrase) => matches(normalized, phrase))) continue;
      const previous = found.get(term.id);
      if (!previous || tierRank[activeTier] > tierRank[previous.tier]) found.set(term.id, { ...term, tier: activeTier });
    }
  }

  const terms = [...found.values()].sort((a, b) => tierRank[b.tier] - tierRank[a.tier] || a.id.localeCompare(b.id));
  const totalWeight = terms.reduce((total, term) => total + tierWeights[term.tier], 0);
  const supportedWeight = terms.filter((term) => term.evidence.length).reduce((total, term) => total + tierWeights[term.tier], 0);
  const score = totalWeight ? Math.round((supportedWeight / totalWeight) * 100) : 0;
  const language = inferLanguage(raw);
  const role = inferRole(basename(file), terms);
  const source = relative(root, file).replaceAll("\\", "/");

  return {
    schemaVersion: 1,
    source,
    sourceSha256: createHash("sha256").update(raw).digest("hex"),
    language,
    recommendedCanonicalCv: canonicalCvId(role, language),
    deterministicEvidenceCoverage: {
      score,
      supportedWeight,
      totalWeight,
      recognizedRequirementCount: terms.length,
      definition: "Weighted coverage of recognized job terms that have at least one evidence ID in the Master Career Document. It is not an ATS pass probability or a hiring prediction."
    },
    supportedRequirements: terms.filter((term) => term.evidence.length).map((term) => ({ id: term.id, tier: term.tier, evidence: term.evidence })),
    evidenceGaps: terms.filter((term) => !term.evidence.length).map((term) => ({ id: term.id, tier: term.tier, phrases: term.phrases })),
    evidenceToPrioritize: [...new Set(terms.filter((term) => term.evidence.length).flatMap((term) => term.evidence))],
    manualReview: [
      "Confirm seniority, location, work authorization, compensation, and language requirements manually.",
      "Do not add an unsupported keyword merely because it improves term coverage.",
      "Use the recommended CV only as a starting point; create a job-specific derivative under career/applications/<company>-<role>/ before editing content."
    ]
  };
}

function slug(source) {
  return basename(source, extname(source)).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const files = walk(applicationsDirectory).filter((file) => !selectors.length || selectors.some((selector) => normalize(file).includes(normalize(selector))));
if (!files.length) {
  console.error("No non-empty .txt job descriptions matched.");
  process.exitCode = 1;
} else {
  const reports = files.map(analyze).sort((a, b) => b.deterministicEvidenceCoverage.score - a.deterministicEvidenceCoverage.score || a.source.localeCompare(b.source));
  for (const report of reports) console.log(`${String(report.deterministicEvidenceCoverage.score).padStart(3)}  ${report.recommendedCanonicalCv.padEnd(34)} ${report.source}`);
  if (write) {
    mkdirSync(reportDirectory, { recursive: true });
    writeFileSync(join(reportDirectory, "index.json"), `${JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), reports }, null, 2)}\n`);
    const markdown = [
      "# Application evidence coverage",
      "",
      "Deterministic coverage of recognized job requirements against evidence IDs in `career/profile/master-career.md`. This is not an ATS pass probability or hiring prediction.",
      "",
      "| Coverage | Recognized requirements | Recommended CV | Job description | Evidence gaps |",
      "| ---: | ---: | --- | --- | --- |",
      ...reports.map((report) => `| ${report.deterministicEvidenceCoverage.score}% | ${report.deterministicEvidenceCoverage.recognizedRequirementCount} | ${report.recommendedCanonicalCv} | ${report.source.replace("career/applications/", "")} | ${report.evidenceGaps.map((gap) => gap.id).join(", ") || "none recognized"} |`),
      ""
    ].join("\n");
    writeFileSync(join(reportDirectory, "README.md"), markdown);
    console.log(`Wrote ${reports.length} reports to ${relative(root, reportDirectory)}.`);
  }
}
