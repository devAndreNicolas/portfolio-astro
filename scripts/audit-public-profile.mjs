import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const args = process.argv.slice(2);

function option(name, fallback = undefined) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

const githubUser = option("--github-user", "devAndreNicolas");
const githubRepository = option("--github-repo", githubUser);
const linkedinInput = option("--linkedin");
const write = args.includes("--write");
const output = resolve(root, option("--output", "career/profile/profile-audits/latest.json"));

function normalize(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function present(text, phrases) {
  const normalized = normalize(text);
  return phrases.some((phrase) => normalized.includes(normalize(phrase)));
}

function walkText(path) {
  const info = statSync(path);
  if (info.isFile()) return [path];
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = join(path, entry.name);
    return entry.isDirectory() ? walkText(child) : [child];
  });
}

function cleanLinkedInFile(path) {
  const extension = extname(path).toLowerCase();
  if (![".csv", ".html", ".htm", ".json", ".md", ".txt"].includes(extension)) return "";
  const raw = readFileSync(path, "utf8");
  return extension === ".html" || extension === ".htm"
    ? raw.replace(/<script[\s\S]*?<\/script>/giu, " ").replace(/<style[\s\S]*?<\/style>/giu, " ").replace(/<[^>]+>/gu, " ").replace(/\s+/gu, " ")
    : raw;
}

function readLinkedIn(path) {
  if (!path) return { status: "not-provided", text: "", sources: [] };
  const absolute = resolve(root, path);
  if (!existsSync(absolute)) throw new Error(`LinkedIn input not found: ${path}`);
  const sources = walkText(absolute)
    .map((file) => ({ file: relative(root, file).replaceAll("\\", "/"), text: cleanLinkedInFile(file) }))
    .filter((entry) => entry.text.trim().length > 0);
  return { status: "provided", text: sources.map((entry) => entry.text).join("\n"), sources: sources.map(({ file }) => file) };
}

function readGitHubProfileReadme() {
  try {
    const encoded = execFileSync("gh", ["api", `repos/${githubUser}/${githubRepository}/readme`, "--jq", ".content"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).replace(/\s+/gu, "");
    return { status: "fetched", text: Buffer.from(encoded, "base64").toString("utf8"), source: `https://github.com/${githubUser}/${githubRepository}` };
  } catch (error) {
    const detail = error.stderr?.toString("utf8").trim() || error.message;
    return { status: "unavailable", text: "", source: `https://github.com/${githubUser}/${githubRepository}`, detail };
  }
}

const expectations = [
  { id: "target-role", label: "Target role positioning", phrases: ["Frontend Engineer", "Software Engineer", "Full Stack Engineer", "Product Engineer", "Angular Developer", "React Developer"] },
  { id: "mspa", label: "Current MSPA SaaS experience", phrases: ["MSPA", "privacy", "LGPD", "compliance"] },
  { id: "frontend-stack", label: "Frontend stack", phrases: ["TypeScript", "Angular", "React", "Next.js", "Astro"] },
  { id: "platform-stack", label: "Platform and data work", phrases: ["Go", "PostgreSQL", "Supabase", "Cloudflare", "Web Components", "Lit"] },
  { id: "quality", label: "Quality and delivery", phrases: ["Vitest", "testing", "CI/CD", "accessibility", "SEO", "performance"] },
  { id: "projects", label: "Named evidence-backed projects", phrases: ["FechaRacha", "Terto Beats", "Saúde em Campo", "Diário de Campo", "RendeCerto", "RendaFácil"] },
  { id: "open-source", label: "Open-source evidence", phrases: ["Stoat", "Revolt", "open source"] },
  { id: "contact-links", label: "Portfolio or professional links", phrases: ["portfolio-andrenicolas", "linkedin.com", "github.com/devAndreNicolas"] }
];

const factualRiskRules = [
  { id: "degree-equivalence", label: "Unsupported degree equivalence", phrases: ["BSc", "Bachelor of Science", "Bachelor's degree"], guidance: "Use the verified credential: Tecnólogo em Sistemas para Internet — UNCISAL (Brazil); do not claim a bachelor's equivalence." },
  { id: "nest", label: "NestJS is not evidenced in career memory", phrases: ["nest", "nestjs"], guidance: "Remove NestJS unless you can add inspected project evidence to the Master Career Document." },
  { id: "firebase", label: "Firebase is not evidenced in career memory", phrases: ["firebase"], guidance: "Remove Firebase unless you can add inspected project evidence to the Master Career Document." }
];

function assess(name, text, status) {
  const coverage = expectations.map((expectation) => ({
    id: expectation.id,
    label: expectation.label,
    found: present(text, expectation.phrases)
  }));
  const found = coverage.filter((item) => item.found);
  const missing = coverage.filter((item) => !item.found);
  const score = text.trim() ? Math.round((found.length / coverage.length) * 100) : 0;
  const factualRisks = factualRiskRules
    .filter((rule) => present(text, rule.phrases))
    .map(({ id, label, guidance }) => ({ id, label, guidance }));
  return {
    name,
    status,
    textLength: text.length,
    evidenceCoverage: { score, found: found.map((item) => item.id), missing: missing.map((item) => item.id) },
    factualRisks,
    recruiterReview: [
      ...(missing.some((item) => item.id === "target-role") ? ["Make the target role explicit in the headline/about section."] : []),
      ...(missing.some((item) => item.id === "mspa") ? ["Add the current MSPA SaaS role with product context and scope."] : []),
      ...(missing.some((item) => item.id === "projects") ? ["Surface 2–4 named projects with problem, action, and technical evidence."] : []),
      ...(missing.some((item) => item.id === "contact-links") ? ["Link the portfolio and GitHub from the profile."] : []),
      "Treat this as evidence coverage, not an ATS pass probability or a hiring prediction."
    ]
  };
}

const github = readGitHubProfileReadme();
const linkedin = readLinkedIn(linkedinInput);
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  scope: "Public-profile evidence coverage against the repository Master Career Document. The audit never invents claims.",
  inputs: {
    github: { user: githubUser, repository: githubRepository, status: github.status, source: github.source, detail: github.detail },
    linkedin: { status: linkedin.status, sources: linkedin.sources }
  },
  profiles: [assess("GitHub profile README", github.text, github.status), assess("LinkedIn export", linkedin.text, linkedin.status)],
  nextSteps: [
    ...(github.status !== "fetched" ? ["Run `gh auth login -h github.com`, then rerun this command to fetch the GitHub profile README."] : []),
    ...(linkedin.status === "not-provided" ? ["Export your LinkedIn data or save your own profile text/HTML, then rerun with `--linkedin <path>`. Do not automate scraping a logged-in LinkedIn session."] : []),
    "Review any suggested copy against career/profile/master-career.md before publishing it."
  ]
};

if (write) {
  mkdirSync(resolve(output, ".."), { recursive: true });
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${relative(root, output).replaceAll("\\", "/")}`);
}

console.log(JSON.stringify(report, null, 2));
