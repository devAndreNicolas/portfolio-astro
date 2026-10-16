import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const config = JSON.parse(readFileSync(join(root, "career/platforms/search-config.json"), "utf8"));
const daysIndex = process.argv.indexOf("--days");
const days = daysIndex >= 0 ? Number(process.argv[daysIndex + 1]) : 3;
if (!Number.isInteger(days) || days < 1 || days > 30) throw new Error("Use --days with an integer from 1 to 30.");

const after = new Date();
after.setDate(after.getDate() - days);
const afterDate = after.toISOString().slice(0, 10);
const markets = { remote: "\"Remote\"", brazil: "(\"Brazil\" OR \"Brasil\" OR \"Remoto\")" };
const primaryPlatforms = new Set(["ashby", "greenhouse", "lever", "inhire", "gupy"]);
const rows = [];
const groupsFor = (platform) => platform.searchGroups ?? config.groups;
const searchGroupsFor = (platform) => platform.discoveryQuery
  ? [{ id: "career-pages", label: "Career pages", query: platform.discoveryQuery }]
  : groupsFor(platform);
const querySiteFor = (platform) => platform.searchSite ?? platform.site;
const marketTermsFor = (platform, market) => platform.marketTerms?.[market] ?? markets[market];

for (const platform of config.platforms) {
  for (const market of platform.markets) {
    for (const group of searchGroupsFor(platform)) {
      if (group.id === "founding" && !["ashby", "greenhouse", "lever"].includes(platform.id)) continue;
      const query = [`site:${querySiteFor(platform)}`, group.query, marketTermsFor(platform, market), platform.id === "inhire" ? "" : `after:${afterDate}`].filter(Boolean).join(" ");
      rows.push({ platform, market, group, query, url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
    }
  }
}

const selected = rows.filter((row) => primaryPlatforms.has(row.platform.id));
const directSearches = config.directSearches.map((item) => {
  const googleQuery = `"${item.term}" ("Maceió" OR "Alagoas" OR "Brasil remoto" OR "home office") vagas`;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`;
  const linkedinUrl = new URL("https://www.linkedin.com/jobs/search/");
  linkedinUrl.searchParams.set("keywords", item.term);
  linkedinUrl.searchParams.set("location", "Maceió, Alagoas, Brasil");
  const indeedUrl = new URL("https://br.indeed.com/jobs");
  indeedUrl.searchParams.set("q", item.term);
  indeedUrl.searchParams.set("l", "Maceió, AL");
  const gupyUrl = `https://portal.gupy.io/job-search/term%3D${encodeURIComponent(item.term)}`;
  return [
    `### ${item.label}`,
    "",
    `- [Google — Maceió, Alagoas ou remoto](${googleUrl})`,
    `- [LinkedIn — Maceió/AL](${linkedinUrl.toString()})`,
    `- [Indeed — Maceió/AL](${indeedUrl.toString()})`,
    `- [Gupy — Brasil; filtre local e modalidade](${gupyUrl})`,
    ""
  ];
}).flat();
const vacancyExamples = config.vacancyExamples.map((item) => `- [${item.label}](${item.url}) — ${item.note}`).join("\n");
const markdown = [
  "# Radar de busca de vagas",
  "",
  `Gerado em ${new Date().toISOString().slice(0, 10)}. As buscas em ATS usam **after:${afterDate}** (${days} dias). A data de indexação do Google serve só como pista; confirme a publicação e a candidatura no anúncio original.`,
  "",
  "## Sumário",
  "",
  "- [Atalhos por cargo — LinkedIn, Indeed, Gupy e Google](#buscar-direto-por-cargo)",
  `- [Anúncios de referência consultados em ${config.checkedAt}](#anuncios-de-referencia-consultados-em-${config.checkedAt})`,
  "- [Buscas nos sites oficiais dos ATS](#buscar-nos-sites-oficiais-dos-ats)",
  "- [Como usar as buscas e se candidatar](#como-usar-as-buscas)",
  "",
  "## Buscar direto por cargo",
  "",
  "Estes atalhos cobrem os cargos pedidos. Google combina Maceió, Alagoas e remoto; LinkedIn e Indeed abrem com localização Maceió/AL; na Gupy, pesquise o título e filtre localização/modalidade. Para vagas remotas, aplique o filtro remoto em cada portal.",
  "",
  ...directSearches,
  `## Anúncios de referência consultados em ${config.checkedAt}`,
  "",
  "Links diretos de exemplos encontrados durante a pesquisa. Alguns são espelhos ou podem encerrar candidatura; use o portal da empresa para confirmar status, localidade e requisitos antes de se candidatar.",
  "",
  vacancyExamples,
  "",
  "## Buscar nos sites oficiais dos ATS",
  "",
  "### Priorize estas plataformas",
  "",
  ...selected.map((row) => `- [${row.group.label} — ${row.platform.label} — ${row.market === "remote" ? "International remote" : "Brazil"}](${row.url})`),
  "",
  "### Outras plataformas",
  "",
  ...rows.filter((row) => !primaryPlatforms.has(row.platform.id)).map((row) => `- [${row.group.label} — ${row.platform.label} — ${row.market === "remote" ? "International remote" : "Brazil"}](${row.url})`),
  "",
  "## Como usar as buscas",
  "",
  "1. Abra o link do cargo e filtre Maceió/AL, remoto ou híbrido; ordene pelas publicações mais recentes.",
  "2. Use as buscas de ATS para encontrar anúncios nas páginas de carreira das empresas. `after:` limita quando o Google indexou a página, não comprova a data de publicação.",
  "3. Abra o anúncio original, confirme que recebe candidaturas e confira requisitos, local e modalidade.",
  "4. Salve link e descrição em `career/applications/<company>-<role>.txt` para analisar a vaga e escolher o CV adequado.",
  "5. Atualize esta lista com `pnpm jobs:searches`.",
  ""
].join("\n");

mkdirSync(join(root, "career/platforms"), { recursive: true });
writeFileSync(join(root, "career/platforms/README.md"), markdown);
console.log(`Wrote ${rows.length} Google search URLs with after:${afterDate}.`);
