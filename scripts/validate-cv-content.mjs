import { readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const failures = [];

function expandTex(path, seen = new Set()) {
  const absolute = resolve(path);
  if (seen.has(absolute)) return "";
  seen.add(absolute);
  const source = readFileSync(absolute, "utf8");
  return source.replace(/\\input\{([^}]+)\}/g, (statement, input) => {
    const candidate = extname(input) ? input : `${input}.tex`;
    const resolved = resolve(root, candidate);
    try {
      return `\n% expanded: ${input}\n${expandTex(resolved, seen)}`;
    } catch {
      return statement;
    }
  });
}

function readableLength(value) {
  return value
    .replace(/\\(?:textbf|textit|href|small|noindent|hfill|vspace)\*?(?:\[[^\]]*\])?\{?/g, "")
    .replace(/[{}\\]/g, "")
    .replace(/%.*$/gm, "")
    .trim().length;
}

const actionPattern = /\b(?:evolu[oa]|evolv|desenvolv[io]|contribu[ií]|implement[eo]|integro|integrei|investig[oa]|melhor[oa]|reorganiz[eo]|constru[ií]|modelei|estruturei|refatorei|build|develop|contribut|implement|integrat|investigat|improv|reorganiz|model|structur|refactor|turn)\p{L}*\b/iu;
const evidencePattern = /\b(10\+|mais de 10|requirements?|requisitos?|business rules?|regras de neg[oó]cio|tests?|testes|production|produ[cç][aã]o|CI\/CD|authorization|autoriza[cç][aã]o|webhooks?|audit|auditoria|support|suporte)\b/iu;

for (const [id, cv] of Object.entries(manifest)) {
  const source = readFileSync(resolve(root, cv.source), "utf8");
  const tex = expandTex(resolve(root, cv.source));
  const bullets = tex
    .split(/\\item\b/)
    .slice(1)
    .map((chunk) => chunk.split(/\\(?:item\b|end\{itemize\})/)[0].replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const substantiveBullets = bullets.filter((bullet) => readableLength(bullet) >= 70);
  const sections = (tex.match(/^\\section\*/gm) ?? []).length;
  const projectSection = /\\section\*\{[^}]*?(?:Projetos|Projects)[^}]*\}/iu.test(tex);
  const projectBody = tex.split(/\\section\*\{[^}]*?(?:Projetos|Projects)[^}]*\}/iu)[1]?.split(/\\section\*/)[0] ?? "";
  const roleProjects = source.match(/\\newcommand\{\\CvProjects\}\{([\s\S]*?)\}\n\\input/)?.[1] ?? "";
  const detailedProjects = Math.max((projectBody.match(/\\textbf\{/g) ?? []).length, (roleProjects.match(/\\textbf\{/g) ?? []).length);
  const actionBullets = bullets.filter((bullet) => actionPattern.test(bullet));
  const evidenceBullets = bullets.filter((bullet) => evidencePattern.test(bullet));
  const usesRoleTemplate = /canonical-role-(?:br|en)\.tex/.test(source);

  if (sections < 6) failures.push(`${id}: expected at least six conventional CV sections, found ${sections}`);
  if (bullets.length < 5) failures.push(`${id}: expected at least five experience bullets, found ${bullets.length}`);
  if (substantiveBullets.length < 4) failures.push(`${id}: expected at least four substantive bullets (70+ readable characters), found ${substantiveBullets.length}`);
  if (!projectSection || detailedProjects < 2) failures.push(`${id}: expected a selected-projects section with at least two detailed projects`);
  if (actionBullets.length < 3 || evidenceBullets.length < 2) failures.push(`${id}: expected at least three action-led bullets and two evidence/context bullets, found ${actionBullets.length} action and ${evidenceBullets.length} evidence/context`);
  if (usesRoleTemplate && !/\\newcommand\{\\CvExperience\}/.test(source)) failures.push(`${id}: shared layout requires role-specific \\CvExperience content`);
  if (usesRoleTemplate && !/\\newcommand\{\\CvProjects\}/.test(source)) failures.push(`${id}: shared layout requires role-specific \\CvProjects content`);
}

if (failures.length) {
  for (const failure of failures) console.error(`CV content quality invalid: ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`CV content quality valid (${Object.keys(manifest).length} CVs; structure, depth, and context/action/evidence checks passed).`);
}
