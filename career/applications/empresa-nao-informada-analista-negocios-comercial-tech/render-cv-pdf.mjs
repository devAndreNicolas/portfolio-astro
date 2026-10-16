import { chromium } from "playwright";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../../..", import.meta.url)));
const output = join(root, "public/cv/andre-nicolas-analista-negocios-comercial-tech-br.pdf");

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 14mm 15mm 14mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #17212b; font-family: Arial, Helvetica, sans-serif; font-size: 9.2pt; line-height: 1.28; }
    header { text-align: center; margin-bottom: 10px; }
    h1 { margin: 0 0 2px; font-size: 17pt; letter-spacing: .1px; }
    .headline { margin: 0 0 5px; font-size: 10pt; font-weight: 700; }
    .contact { font-size: 8.2pt; line-height: 1.45; }
    a { color: inherit; text-decoration: none; }
    section { margin-top: 9px; }
    h2 { margin: 0 0 4px; padding-bottom: 2px; border-bottom: 1px solid #596a79; font-size: 10pt; text-transform: uppercase; }
    p { margin: 0 0 4px; }
    .skills p { margin: 0 0 3px; }
    .role { display: flex; justify-content: space-between; gap: 12px; margin: 0 0 2px; }
    .role strong { font-size: 9.4pt; }
    .subtitle { margin-bottom: 4px; font-style: italic; }
    ul { margin: 3px 0 0; padding-left: 17px; }
    li { margin: 0 0 4px; }
    .project { margin-bottom: 7px; }
    .project-title { font-weight: 700; }
    .stack { font-style: italic; }
    .education { margin-bottom: 3px; }
  </style>
</head>
<body>
  <header>
    <h1>ANDRÉ NICOLAS SILVA</h1>
    <p class="headline">Analista de Negócios | Comercial Tech | Dados e Processos</p>
    <div class="contact">Maceió, AL · <a href="mailto:devandrenicolas@gmail.com">devandrenicolas@gmail.com</a><br>
      <a href="https://portfolio-andrenicolas.vercel.app">Portfólio</a> ·
      <a href="https://github.com/devAndreNicolas">GitHub</a> ·
      <a href="https://www.linkedin.com/in/devandrenicolas">LinkedIn</a>
    </div>
  </header>

  <section>
    <h2>Resumo profissional</h2>
    <p>Profissional de tecnologia com formação em Sistemas para Internet e experiência na análise de necessidades de produto, regras de negócio e dados em uma plataforma SaaS usada por <strong>10+ empresas</strong>. Participa da tradução de necessidades de usuários e áreas de produto em fluxos, requisitos e soluções técnicas, acompanhando implementação, validação e evolução em produção.</p>
    <p>Atua com <strong>SQL/PostgreSQL</strong>, análise de dados de aplicações, eventos e funis de produto no PostHog, além de competências em <strong>Excel, Microsoft Office e Power BI para análise e relatórios</strong>. Combina contexto de negócio com conhecimento técnico para apoiar decisões de produto e colaborar com engenharia. Cargo exercido na MSPA: <strong>Frontend Engineer</strong>, com contribuições full stack.</p>
  </section>

  <section class="skills">
    <h2>Competências principais</h2>
    <p><strong>Análise de negócios e processos:</strong> levantamento e refinamento de requisitos, regras de negócio, análise de fluxos, identificação de necessidades e definição de escopo com produto e engenharia.</p>
    <p><strong>Dados e indicadores de produto:</strong> SQL, PostgreSQL, consultas e investigação de dados; eventos, funis e feedback de usuários no PostHog.</p>
    <p><strong>Excel, Office e Power BI:</strong> Microsoft Office, Excel para organização e análise de dados e Power BI para análise e elaboração de relatórios.</p>
    <p><strong>Relatórios e automação:</strong> análise de informações, documentação técnica, automações entre sistemas e workflow de engenharia assistido por IA.</p>
    <p><strong>Colaboração e entrega:</strong> comunicação com produto e engenharia, validação de soluções, testes, acompanhamento de mudanças e trabalho colaborativo.</p>
    <p><strong>Base técnica:</strong> APIs REST e internas, integrações, Angular, TypeScript, Go, Node.js, Java/Spring em contribuições na MSPA; ferramentas de IA e checks determinísticos.</p>
  </section>

  <section>
    <h2>Experiência profissional</h2>
    <div class="role"><strong>MSPA — Frontend Engineer (contribuições full stack)</strong><span>Abr 2025 – Presente</span></div>
    <p class="subtitle">Plataforma SaaS para Privacidade, Compliance (LGPD) e Auditoria Digital</p>
    <ul>
      <li><strong>Levantamento de necessidades e requisitos:</strong> participou da evolução do Compass e do Trust Center, produtos SaaS usados por <strong>10+ empresas</strong>, conectando necessidades de usuários e produto a regras de negócio, escopo, fluxos e soluções implementadas em produção.</li>
      <li><strong>Análise de produto e processos:</strong> traduziu requisitos de negócio em soluções técnicas e contribuiu para avaliar fluxos, prioridades, regras, alternativas de implementação e trade-offs com produto e engenharia.</li>
      <li><strong>Análise de dados e comportamento:</strong> participou de entrevistas e validações de UX, instrumentação de eventos e análise de funis no <strong>PostHog</strong>, usando feedback e comportamento observado para apoiar decisões sobre os fluxos do Compass.</li>
      <li><strong>SQL e investigação de dados:</strong> trabalhou com <strong>SQL e PostgreSQL</strong>, consultas, persistência, migrações e investigação de problemas de dados relacionados às regras e aos fluxos da aplicação.</li>
      <li><strong>Soluções e automação:</strong> contribuiu com integrações e automações de sistemas, testes e validação de mudanças; utilizou ferramentas de IA no workflow de engenharia com contexto estruturado e checks de qualidade.</li>
      <li><strong>Colaboração entre áreas:</strong> trabalhou com produto e engenharia durante o refinamento, implementação e validação de soluções, mantendo alinhamento sobre escopo e comportamento esperado.</li>
      <li><strong>Coordenação de workflow:</strong> reorganizou o fluxo de desenvolvimento em fase crítica de um projeto com equipe de <strong>6 pessoas</strong>, coordenando diretamente 4 integrantes para melhorar clareza de escopo e organização das entregas.</li>
    </ul>
  </section>

  <section>
    <h2>Projetos relevantes</h2>
    <div class="project"><div class="role"><span class="project-title">RendeCerto — Simulador de cenários financeiros</span><span class="stack">Next.js, TypeScript, Vitest</span></div>
      <p>Implementou regras determinísticas de cálculo e comparação de cenários financeiros, com testes automatizados para validar resultados em diferentes entradas.</p>
    </div>
    <div class="project"><div class="role"><span class="project-title">Compass — Produto SaaS e análise de fluxos</span><span class="stack">Angular, TypeScript, Lit, Web Components, Cloudflare</span></div>
      <p>Participou da análise de fluxos de produto, entrevistas e validações de UX, análise de eventos e funis no PostHog e interpretação de feedback para apoiar decisões sobre a experiência do Compass.</p>
    </div>
  </section>

  <section>
    <h2>Formação e idiomas</h2>
    <p class="education"><strong>Tecnólogo em Sistemas para Internet</strong> — UNCISAL · Concluído em 2026</p>
    <p><strong>Português:</strong> nativo · <strong>Inglês:</strong> intermediário/avançado, em aprimoramento contínuo</p>
  </section>
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
