import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
try { process.loadEnvFile(join(root, ".env")); } catch { /* optional in CI */ }
const config = JSON.parse(readFileSync(join(root, "career/platforms/search-config.json"), "utf8"));
const destination = join(root, "career/applications");
const statePath = join(destination, "collected-index.json");
const limitIndex = process.argv.indexOf("--limit");
const providerArgument = process.argv.find((argument) => argument.startsWith("--provider="));
const limit = limitIndex >= 0 ? Number(process.argv[limitIndex + 1]) : 10;
const provider = providerArgument?.split("=")[1] ?? "both";
const country = process.argv.includes("--remote") ? "remote" : "brazil";
if (!Number.isInteger(limit) || limit < 1 || limit > 30) throw new Error("Use --limit from 1 to 30.");
if (!new Set(["serpapi", "serper", "both"]).has(provider)) throw new Error("Use --provider=serpapi, serper, or both.");

const after = new Date(); after.setDate(after.getDate() - 3);
const afterDate = after.toISOString().slice(0, 10);
const countryTerms = country === "brazil" ? "(\"Brazil\" OR \"Brasil\" OR \"Remoto\")" : "\"Remote\"";
const acceptedDomains = new Set(config.platforms.filter((platform) => platform.markets.includes(country)).map((platform) => platform.site));
const queries = config.groups.filter((group) => group.id !== "founding" || country === "remote").map((group) =>
  `(${config.platforms.filter((platform) => platform.markets.includes(country)).map((platform) => `site:${platform.site}`).join(" OR ")}) ${group.query} ${countryTerms} after:${afterDate}`
);
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : { sources: {} };

function sleep(milliseconds) { return new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds)); }
function slug(value) { return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "job"; }
function isBoardUrl(value) { try { return [...acceptedDomains].some((domain) => new URL(value).hostname === domain || new URL(value).hostname.endsWith(`.${domain}`)); } catch { return false; } }
function cleanText(value) { return value.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim(); }
function isJobDescription(text) {
  const normalized = text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  return /\b(requirements|requisitos|qualifications|qualificacoes|responsibilities|responsabilidades)\b/.test(normalized)
    && /\b(apply|candidate-se|candidatar|vaga|job)\b/.test(normalized);
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
  if (!candidates.size) throw new Error("No new official ATS links discovered. Check key, quota, or freshness.");
  return candidates;
}

const candidates = await discover();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ locale: "pt-BR" });
const page = await context.newPage();
let saved = 0; let skipped = 0;
try {
  for (const [url, discoveryProviders] of candidates) {
    if (saved >= limit) break;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForTimeout(700);
      const text = cleanText(await page.locator("body").innerText({ timeout: 10_000 }));
      const heading = cleanText(await page.locator("h1").first().innerText({ timeout: 3_000 }).catch(() => ""));
      const title = heading || cleanText(await page.title());
      if (text.length < 700 || !isJobDescription(text) || /unusual traffic|captcha|access denied/i.test(text)) { skipped += 1; continue; }
      const hash = createHash("sha256").update(url).digest("hex").slice(0, 8);
      const filename = `${slug(title)}-${hash}.txt`; const relative = `career/applications/${filename}`; const collectedAt = new Date().toISOString();
      writeFileSync(join(destination, filename), `Source URL: ${url}\nCollected at: ${collectedAt}\nMarket: ${country}\nDiscovery: ${discoveryProviders.join(", ")}\n\n${text}\n`, "utf8");
      state.sources[url] = { file: relative, title, collectedAt, discoveryProviders }; saved += 1; console.log(`Saved ${relative}`);
    } catch (error) { skipped += 1; console.warn(`Skipped ${url}: ${error.message}`); }
    await sleep(1_200);
  }
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  console.log(`Discovered ${candidates.size}; collected ${saved}; skipped ${skipped}; market: ${country}; provider: ${provider}.`);
} finally { await browser.close(); }
