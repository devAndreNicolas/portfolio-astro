import { chromium } from "playwright";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const output = join(directory, "cover-letter.pdf");

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #202633; font-family: Arial, Helvetica, sans-serif; }
    .sheet { width: 210mm; height: 297mm; padding: 22mm 23mm 20mm; position: relative; }
    .name { margin: 0 0 5px; color: #10243a; font-size: 23pt; letter-spacing: .2px; }
    .target { margin: 0 0 12px; color: #315b82; font-size: 10pt; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; }
    .contact { color: #536172; font-size: 9pt; line-height: 1.7; }
    .rule { margin: 16px 0 29px; border: 0; border-top: 1px solid #d7dfe7; }
    .date { margin: 0 0 22px; color: #536172; font-size: 10pt; }
    .body { font-size: 10.5pt; line-height: 1.58; }
    .body p { margin: 0 0 13px; }
    .closing { margin-top: 23px !important; }
    .signature { margin-top: 22px; color: #10243a; font-weight: 700; }
    .footer { position: absolute; right: 23mm; bottom: 12mm; left: 23mm; padding-top: 7px; border-top: 1px solid #e2e7ec; color: #718093; font-size: 8pt; }
  </style>
</head>
<body>
  <main class="sheet">
    <h1 class="name">André Nicolas Silva</h1>
    <div class="target">Candidatura · Desenvolvimento de meios de produção</div>
    <div class="contact">Maceió, AL · devandrenicolas@gmail.com<br>portfolio-andrenicolas.vercel.app · github.com/devAndreNicolas · linkedin.com/in/devandrenicolas</div>
    <hr class="rule">
    <p class="date">Maceió, 16 de outubro de 2026</p>
    <div class="body">
      <p>Prezada equipe de recrutamento da PKC Group / Motherson Technology Services,</p>
      <p>Tenho interesse na oportunidade de desenvolvimento de meios de produção para a divisão de chicotes. Sou tecnólogo em Sistemas para Internet pela UNCISAL e atuo como Frontend Engineer na MSPA, com contribuições full stack em produtos SaaS utilizados por mais de 10 empresas.</p>
      <p>Minha experiência profissional está concentrada em desenvolvimento de software. Nesse contexto, participo da análise de requisitos e regras de negócio, transformo especificações em soluções técnicas, investigo problemas em produção, valido mudanças e colaboro com diferentes áreas para acompanhar entregas com qualidade e dentro do escopo. Também trabalho com testes, documentação e integração entre sistemas.</p>
      <p>Sei que essa oportunidade está ligada à manufatura automotiva e representa uma mudança em relação à minha trajetória atual. Quero levar minha base de análise, resolução estruturada de problemas e colaboração técnica para esse contexto, aprendendo os processos e ferramentas específicos da engenharia de desenvolvimento de chicotes.</p>
      <p>Agradeço pela consideração da minha candidatura. Fico à disposição para conversar sobre como minha experiência em tecnologia pode contribuir com a equipe e sobre minha transição para o ambiente industrial.</p>
      <p class="closing">Atenciosamente,</p>
      <div class="signature">André Nicolas Silva</div>
    </div>
    <div class="footer">Carta de apresentação · PKC Group / Motherson Technology Services</div>
  </main>
</body>
</html>`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({ path: output, format: "A4", printBackground: true });
  console.log(`Created ${output}`);
} finally {
  await browser.close();
}
