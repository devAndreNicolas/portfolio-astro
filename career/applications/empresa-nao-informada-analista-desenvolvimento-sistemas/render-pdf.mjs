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
    .target { margin: 0 0 12px; color: #315b82; font-size: 10pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
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
    <div class="target">Candidatura · Analista de Desenvolvimento de Sistemas</div>
    <div class="contact">Maceió, AL · devandrenicolas@gmail.com<br>portfolio-andrenicolas.vercel.app · github.com/devAndreNicolas · linkedin.com/in/devandrenicolas</div>
    <hr class="rule">
    <p class="date">Maceió, 16 de outubro de 2026</p>
    <div class="body">
      <p>Prezada equipe de recrutamento da Motherson Technology Services,</p>
      <p>Tenho interesse na oportunidade de Analista de Desenvolvimento de Sistemas. Sou tecnólogo em Sistemas para Internet pela UNCISAL e atualmente trabalho como Frontend Engineer na MSPA, com contribuições full stack em produtos SaaS utilizados por mais de 10 empresas.</p>
      <p>Na MSPA, participo da análise de necessidades e regras de negócio, do refinamento de requisitos e da implementação e validação de soluções. Minha atuação inclui desenvolvimento de interfaces, integração com APIs e serviços, análise de dados com SQL e PostgreSQL, testes automatizados e investigação de problemas em produção. Também colaboro com produto e engenharia para definir escopo e acompanhar mudanças ao longo da entrega.</p>
      <p>Em projetos próprios, desenvolvi fluxos de produto que envolvem regras de negócio, persistência e integrações. No Marca Racha, implementei fluxos de partidas, convites, solicitações de entrada e notificações, com testes para permissões e transições de estado. No Terto Beats, implementei partes do ciclo de pedidos, checkout e processamento de webhooks.</p>
      <p>Quero levar essa experiência para a equipe da Motherson Technology Services, contribuindo na análise, desenvolvimento e evolução de sistemas com atenção às necessidades do negócio, à qualidade técnica e à colaboração entre áreas. Acredito que minha experiência prática em diferentes camadas de aplicações e minha formação em tecnologia podem contribuir para os desafios da vaga.</p>
      <p class="closing">Atenciosamente,</p>
      <div class="signature">André Nicolas Silva</div>
    </div>
    <div class="footer">Carta de apresentação · Motherson Technology Services</div>
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
