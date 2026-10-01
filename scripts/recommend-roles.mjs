import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const taxonomy = JSON.parse(readFileSync(join(root, "career/ats/taxonomy.json"), "utf8"));
const catalog = JSON.parse(readFileSync(join(root, "career/roles/catalog.json"), "utf8"));
const reportPath = join(root, "career/applications/analysis/index.json");
const outputDirectory = join(root, "career/roles");
const write = process.argv.includes("--write");

if (!existsSync(reportPath)) throw new Error("Application analysis is missing. Run pnpm applications:analyze first.");

const applications = JSON.parse(readFileSync(reportPath, "utf8")).reports;
const terms = new Map(taxonomy.terms.map((term) => [term.id, term]));

function score(role) {
  const supported = role.strengths.filter((id) => terms.get(id)?.evidence?.length);
  const profileScore = Math.round((supported.length / role.strengths.length) * 70);
  const related = applications.filter((application) => application.recommendedCanonicalCv.startsWith(role.cvFamily));
  const demandScore = Math.round((related.length / Math.max(1, applications.length)) * 30);
  const gaps = role.strengths.filter((id) => !terms.get(id)?.evidence?.length);
  return {
    ...role,
    score: profileScore + demandScore,
    profileScore,
    localDemandScore: demandScore,
    matchingSavedVacancies: related.length,
    supportedStrengths: supported,
    evidenceGaps: gaps
  };
}

const recommendations = catalog.roles.map(score).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
for (const role of recommendations) console.log(`${String(role.score).padStart(3)}  ${role.titles[0]} (${role.matchingSavedVacancies} saved vacancies)`);

if (write) {
  mkdirSync(outputDirectory, { recursive: true });
  const data = {
    schemaVersion: 1,
    basedOn: relative(root, reportPath).replaceAll("\\", "/"),
    definition: "Score = 70% documented-strength coverage + 30% representation among locally saved vacancies. It is a search-prioritization aid, not market demand, ATS probability, or hiring prediction.",
    recommendations
  };
  writeFileSync(join(outputDirectory, "recommendations.json"), `${JSON.stringify(data, null, 2)}\n`);
  const markdown = [
    "# Search-role recommendations",
    "",
    "This ranking uses documented strengths and the vacancies currently saved in this repository. It is a search-prioritization aid, not a market-demand or hiring prediction.",
    "",
    "| Priority | Role | Profile evidence | Local vacancy signal | Search titles |",
    "| ---: | --- | ---: | ---: | --- |",
    ...recommendations.map((role) => `| ${role.score} | ${role.titles[0]} | ${role.profileScore}/70 | ${role.localDemandScore}/30 (${role.matchingSavedVacancies}) | ${role.titles.join("; ")} |`),
    "",
    "## Search queries",
    "",
    ...recommendations.map((role) => `### ${role.titles[0]}\n\n${role.searchTerms.map((term) => `- \`${term}\``).join("\n")}\n\nEvidence gaps to keep out of CV claims: ${role.evidenceGaps.join(", ") || "none in this role profile"}.`),
    ""
  ].join("\n");
  writeFileSync(join(outputDirectory, "README.md"), markdown);
  console.log(`Wrote ${relative(root, outputDirectory)} recommendations.`);
}
