import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const plansPath = join(root, "career/automation/optimization-plans.json");
if (!existsSync(plansPath)) throw new Error("Missing optimization plans. Run pnpm career:plan-cvs first.");
const plans = JSON.parse(readFileSync(plansPath, "utf8")).plans;
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const terms = JSON.parse(readFileSync(join(root, "career/ats/taxonomy.json"), "utf8")).terms;
const labels = Object.fromEntries(terms.map((term) => [term.id, term.id.replaceAll("-", " ")]));

function documentFor(id, evidenceIds) {
  const english = !id.endsWith("-br");
  const role = id.replace(/-(br|international)$/, "").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const skills = evidenceIds.map((id) => labels[id]).filter(Boolean).join(", ");
  const copy = english ? {
    title: role, summary: "Product-minded engineer building clear, reliable web products from requirements and business rules through implementation, quality, and production support.", exp: "Experience", skills: "Skills", edu: "Education", bullets: ["Frontend Engineer with product focus at MSPA since April 2025, contributing to privacy, LGPD compliance, and digital-auditing product surfaces used by 10+ companies.", "Worked across Angular, TypeScript, React, Astro, Web Components, Lit, and Shadow DOM in production-facing systems.", "Contributed to Go services, REST/internal APIs, SQL/PostgreSQL, asynchronous processing, integrations, automation, tests, CI/CD, accessibility, SEO, and performance as product workflows required."], education: "Tecn\'ologo in Internet Systems, UNCISAL (Brazil) — Brazilian higher-education technology degree, completed 2026." } : {
    title: role, summary: "Engenheiro com foco em produto, construindo produtos web claros e confi\'aveis desde requisitos e regras de neg\'ocio at\'e implementa\c{c}\~ao, qualidade e suporte em produ\c{c}\~ao.", exp: "Experi\^encia", skills: "Compet\^encias", edu: "Forma\c{c}\~ao", bullets: ["Frontend Engineer com foco em produto na MSPA desde abril de 2025, contribuindo para superf\'icies de privacidade, LGPD e auditoria digital usadas por mais de 10 empresas.", "Atua\c{c}\~ao com Angular, TypeScript, React, Astro, Web Components, Lit e Shadow DOM em sistemas voltados \`a produ\c{c}\~ao.", "Contribui\c{c}\~oes em servi\c{c}os Go, APIs REST/internas, SQL/PostgreSQL, processamento ass\'incrono, integra\c{c}\~oes, automa\c{c}\~oes, testes, CI/CD, acessibilidade, SEO e performance conforme os fluxos de produto."], education: "Tecn\'ologo em Sistemas para Internet, UNCISAL — conclu\'ido em 2026." };
  return `\\documentclass[10pt,a4paper]{article}\n\\input{career/cvs/includes/ats-preamble.tex}\n\\begin{document}\n\\begin{center}{\\LARGE\\textbf{Andre Nicolas Silva}}\\\\[.2em]${copy.title}\\\\Maceio, Brazil | devandrenicolas@gmail.com | linkedin.com/in/devandrenicolas\\end{center}\n\\section*{Summary}${copy.summary}\n\\section*{${copy.exp}}\\textbf{MSPA} --- Frontend Engineer | Apr 2025--Present\\begin{itemize}${copy.bullets.map((bullet) => `\\item ${bullet}`).join("") }\\end{itemize}\n\\section*{${copy.skills}}${skills}\n\\section*{${copy.edu}}${copy.education}\n\\end{document}\n`;
}
for (const plan of plans.filter((plan) => plan.decision === "optimize-canonical")) {
  const cv = manifest[plan.canonicalCv];
  if (!cv) throw new Error(`Unknown canonical CV ${plan.canonicalCv}`);
  writeFileSync(join(root, cv.source), documentFor(plan.canonicalCv, plan.evidenceIds), "utf8");
  console.log(`Rendered ${plan.canonicalCv} from ${plan.evidenceIds.length} approved evidence IDs.`);
}
