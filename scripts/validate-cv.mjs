import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const cvs = JSON.parse(readFileSync(resolve(root, "career/cvs/manifest.json"), "utf8")).cvs;
const requirePdfs = process.argv.includes("--require-pdfs");
const ids = new Set();
let invalid = 0;

for (const [id, cv] of Object.entries(cvs)) {
  const problems = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) problems.push("ID must be unique kebab-case");
  ids.add(id);
  if (!cv.source?.startsWith("career/cvs/") || !cv.source.endsWith(".tex")) problems.push("source must be a career/cvs .tex file");
  if (!cv.output?.startsWith("public/cv/") || !cv.output.endsWith(".pdf")) problems.push("output must be a public/cv .pdf file");
  if (!existsSync(resolve(root, cv.source))) problems.push(`missing source ${cv.source}`);
  if (requirePdfs && !existsSync(resolve(root, cv.output))) problems.push(`missing built PDF ${cv.output}`);
  if (problems.length) { invalid += 1; console.error(`${id}: ${problems.join("; ")}`); }
}

if (invalid) process.exitCode = 1;
else console.log(`CV manifest valid (${Object.keys(cvs).length} CVs${requirePdfs ? ", PDFs present" : ""}).`);
