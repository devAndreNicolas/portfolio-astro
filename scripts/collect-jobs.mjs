import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
try { process.loadEnvFile(join(root, ".env")); } catch { /* optional in CI */ }
const config = JSON.parse(readFileSync(join(root, "career/platforms/search-config.json"), "utf8"));
const taxonomy = JSON.parse(readFileSync(join(root, "career/ats/taxonomy.json"), "utf8"));
const destination = join(root, "career/applications");
const statePath = join(destination, "collected-index.json");
const limitIndex = process.argv.indexOf("--limit");
const providerArgument = process.argv.find((argument) => argument.startsWith("--provider="));
const limit = limitIndex >= 0 ? Number(process.argv[limitIndex + 1]) : 10;
const maxAgeIndex = process.argv.indexOf("--max-age-days");
const maxAgeDays = maxAgeIndex >= 0 ? Number(process.argv[maxAgeIndex + 1]) : 7;
const provider = providerArgument?.split("=")[1] ?? "both";
const country = process.argv.includes("--remote") ? "remote" : "brazil";
if (!Number.isInteger(limit) || limit < 1 || limit > 30) throw new Error("Use --limit from 1 to 30.");
if (!Number.isInteger(maxAgeDays) || maxAgeDays < 1 || maxAgeDays > 31) throw new Error("Use --max-age-days from 1 to 31.");
if (!new Set(["serpapi", "serper", "both"]).has(provider)) throw new Error("Use --provider=serpapi, serper, or both.");

const after = new Date(); after.setDate(after.getDate() - 3);
const afterDate = after.toISOString().slice(0, 10);
const countryTerms = country === "brazil" ? "(\"Brazil\" OR \"Brasil\" OR \"Remoto Brasil\")" : "\"Remote\"";
const acceptedDomains = new Set(config.platforms.filter((platform) => platform.markets.includes(country)).map((platform) => platform.site));
const queries = config.groups.filter((group) => group.id !== "founding" || country === "remote").map((group) =>
  `(${config.platforms.filter((platform) => platform.markets.includes(country)).map((platform) => `site:${platform.site}`).join(" OR ")}) ${group.query} ${countryTerms} after:${afterDate}`
);
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : { sources: {} };

function sleep(milliseconds) { return new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds)); }
function slug(value) { return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "job"; }
function isBoardUrl(value) {
  try {
    const url = new URL(value);
    const isAcceptedDomain = [...acceptedDomains].some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
    if (!isAcceptedDomain) return false;
    // Google also indexes ATS search pages, browser-support pages, and
    // application endpoints. They are not a vacancy and should never reach
    // the browser extraction stage.
    if (url.hostname.endsWith("gupy.io") && url.pathname.startsWith("/job-search")) return false;
    if (url.hostname.endsWith("smartrecruiters.com") && url.pathname.startsWith("/oneclick-ui")) return false;
    if (url.hostname.endsWith("myworkdayjobs.com") && url.pathname.includes("/apply")) return false;
    return true;
  } catch { return false; }
}
function cleanText(value) { return value.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim(); }
function normalized(value) { return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase(); }
function alreadySaved(title) {
  const candidate = normalized(title);
  return readdirSync(destination, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
    .some((entry) => normalized(readFileSync(join(destination, entry.name), "utf8")).includes(candidate));
}
function isJobDescription(text) {
  const normalized = text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const hasRoleSection = /\b(requirements|requisitos|qualifications|qualificacoes|responsibilities|responsabilidades|what you.ll do|about the role|who you are|your impact|o que esperamos)\b/.test(normalized);
  const hasApplicationContext = /\b(apply|candidate-se|candidatar|vaga|job|employment type|tipo de contrato)\b/.test(normalized);
  return hasRoleSection && hasApplicationContext;
}
function isErrorPage(title, text) {
  return /internet explorer.*not supported|page not found|job not found|access denied/i.test(`${title}\n${text.slice(0, 1_000)}`);
}
function isMarketRelevant(text) {
  if (country === "remote") return /\b(remote|remoto)\b/i.test(text);
  // ATS vendors expose location in different layouts (a labelled field, an
  // inline metadata row, or eligibility copy). The previous version only
  // accepted one line-based layout and discarded valid Brazilian vacancies.
  if (/\b(brazil|brasil)\b/i.test(text)) return true;
  if (/\b(sao paulo|rio de janeiro|belo horizonte|recife|maceio|curitiba|florianopolis|porto alegre|fortaleza|salvador|brasilia)\b/i.test(normalized(text))) return true;
  // Portuguese-only remote listings are likely Brazilian when they do not
  // expose an explicit country. English "Remote" alone is worldwide and is
  // intentionally not enough for the Brazil collector.
  if (/\bremoto\b/i.test(text) && /\b(vaga|requisitos|candidatar|local de trabalho)\b/i.test(text)) return true;
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.some((line, index) => /^(locations?|local de trabalho|location)$/i.test(line)
    && lines.slice(index + 1, index + 6).some((value) => /\b(brazil|brasil|remote|remoto)\b/i.test(value)));
}
function explicitAgeDays(text) {
  const value = normalized(text);
  const relative = value.match(/(?:posted|publicada|publicado|postada).{0,24}?(\d+)\s*(?:days?|dias)/);
  if (relative) return Number(relative[1]);
  const date = value.match(/(?:posted|publicada|publicado|postada).{0,24}?(\d{2})\/(\d{2})\/(\d{4})/);
  if (!date) return null;
  const published = new Date(`${date[3]}-${date[2]}-${date[1]}T00:00:00`);
  return Math.floor((Date.now() - published.getTime()) / 86_400_000);
}
function fitSignals(text) {
  const value = normalized(text);
  const supported = taxonomy.terms
    .filter((term) => term.evidence.length && term.phrases.some((phrase) => value.includes(normalized(phrase))))
    .map((term) => term.id);
  const core = new Set(["typescript", "javascript", "angular", "react", "nextjs", "node", "go", "astro", "html-css", "web-components"]);
  return { supported, core: supported.filter((id) => core.has(id)), rust: /\brust\b/.test(value) };
}

async function discoverWithSerpApi(query) {
  if (!process.env.SERPAPI_API_KEY) throw new Error("SERPAPI_API_KEY is missing from .env.");
  const params = new URLSearchParams({ engine: "google", q: query, api_key: process.env.SERPAPI_API_KEY, gl: country === "brazil" ? "br" : "us", hl: country === "brazil" ? "pt" : "en", num: "10" });
  const response = await fetch(`https://serpapi.com/search.json?${params}`);
  if (!response.ok) throw new Error(`SerpAPI returned HTTP ${response.status}.`);
  return ((await response.json()).organic_results ?? []).map((result) => result.link).filter(isBoardUrl);
}

async function discoverWithSerper(query) {
  if (!process.env.SERPER_API_KEY) throw new Error("SERPER_API_KEY is missing from .env.");
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": process.env.SERPER_API_KEY },
    body: JSON.stringify({ q: query, gl: country === "brazil" ? "br" : "us", hl: country === "brazil" ? "pt" : "en", num: 10 })
  });
  if (!response.ok) throw new Error(`Serper returned HTTP ${response.status}.`);
  return ((await response.json()).organic ?? []).map((result) => result.link).filter(isBoardUrl);
}

async function discover() {
  const candidates = new Map();
  for (const query of queries) {
    for (const name of provider === "both" ? ["serpapi", "serper"] : [provider]) {
      try {
        const links = name === "serpapi" ? await discoverWithSerpApi(query) : await discoverWithSerper(query);
        for (const url of links) if (!state.sources[url]) candidates.set(url, [...new Set([...(candidates.get(url) ?? []), name])]);
      } catch (error) { console.warn(`${name} discovery skipped: ${error.message}`); }
    }
    if (candidates.size >= limit * 4) break;
  }
  return candidates;
}

const candidates = await discover();
if (!candidates.size) {
  state.lastRun = { at: new Date().toISOString(), country, provider, afterDate, maxAgeDays, discovered: 0, collected: 0, rejected: {}, attempts: [] };
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  console.log(`Discovered 0 new official ATS links; market: ${country}; provider: ${provider}.`);
  process.exit(0);
}
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ locale: "pt-BR" });
const page = await context.newPage();
let saved = 0; let skipped = 0;
const rejected = { duplicate: 0, location: 0, stale: 0, mismatch: 0, structure: 0, blocked: 0 };
const attempts = [];
try {
  for (const [url, discoveryProviders] of candidates) {
    if (saved >= limit) break;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForTimeout(700);
      const text = cleanText(await page.locator("body").innerText({ timeout: 10_000 }));
      const heading = cleanText(await page.locator("h1").first().innerText({ timeout: 3_000 }).catch(() => ""));
      const title = heading || cleanText(await page.title());
      if (/unusual traffic|captcha|access denied/i.test(text)) { rejected.blocked += 1; attempts.push({ url, title, reason: "blocked" }); skipped += 1; continue; }
      if (isErrorPage(title, text)) { rejected.structure += 1; attempts.push({ url, title, reason: "error-page", textLength: text.length }); skipped += 1; continue; }
      if (text.length < 700 || !isJobDescription(text)) { rejected.structure += 1; attempts.push({ url, title, reason: "structure", textLength: text.length }); skipped += 1; continue; }
      if (!isMarketRelevant(text)) { rejected.location += 1; attempts.push({ url, title, reason: "location" }); skipped += 1; continue; }
      const ageDays = explicitAgeDays(text);
      if (ageDays !== null && ageDays > maxAgeDays) { rejected.stale += 1; attempts.push({ url, title, reason: "stale", ageDays }); skipped += 1; continue; }
      const fit = fitSignals(text);
      if (fit.rust || fit.core.length < 2) { rejected.mismatch += 1; attempts.push({ url, title, reason: fit.rust ? "rust" : "insufficient-core-signals", fitSignals: fit.supported }); skipped += 1; continue; }
      if (alreadySaved(title)) {
        state.sources[url] = { ignored: "duplicate title", title, collectedAt: new Date().toISOString(), discoveryProviders };
        rejected.duplicate += 1;
        attempts.push({ url, title, reason: "duplicate" });
        skipped += 1;
        continue;
      }
      const hash = createHash("sha256").update(url).digest("hex").slice(0, 8);
      const filename = `${slug(title)}-${hash}.txt`; const relative = `career/applications/${filename}`; const collectedAt = new Date().toISOString();
      writeFileSync(join(destination, filename), `Source URL: ${url}\nCollected at: ${collectedAt}\nMarket: ${country}\nDiscovery: ${discoveryProviders.join(", ")}\nExplicit age: ${ageDays ?? "unknown"}\nFit signals: ${fit.supported.join(", ")}\n\n${text}\n`, "utf8");
      state.sources[url] = { file: relative, title, collectedAt, discoveryProviders, ageDays, fitSignals: fit.supported }; saved += 1; console.log(`Saved ${relative}`);
    } catch (error) { skipped += 1; attempts.push({ url, reason: "request-error", message: error.message }); console.warn(`Skipped ${url}: ${error.message}`); }
    await sleep(1_200);
  }
  state.lastRun = { at: new Date().toISOString(), country, provider, afterDate, maxAgeDays, discovered: candidates.size, collected: saved, rejected, attempts };
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  console.log(`Discovered ${candidates.size}; collected ${saved}; skipped ${skipped}; rejected ${JSON.stringify(rejected)}; market: ${country}; provider: ${provider}.`);
} finally { await browser.close(); }
