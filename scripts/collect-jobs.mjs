import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const config = JSON.parse(readFileSync(join(root, "career/platforms/search-config.json"), "utf8"));
const destination = join(root, "career/applications");
const statePath = join(destination, "collected-index.json");
const limitIndex = process.argv.indexOf("--limit");
const limit = limitIndex >= 0 ? Number(process.argv[limitIndex + 1]) : 10;
const country = process.argv.includes("--remote") ? "remote" : "brazil";
if (!Number.isInteger(limit) || limit < 1 || limit > 30) throw new Error("Use --limit from 1 to 30.");

const after = new Date();
after.setDate(after.getDate() - 3);
const afterDate = after.toISOString().slice(0, 10);
const countryTerms = country === "brazil" ? "(\"Brazil\" OR \"Brasil\" OR \"Remoto\")" : "\"Remote\"";
const acceptedDomains = new Set(config.platforms.filter((platform) => platform.markets.includes(country)).map((platform) => platform.site));
const queries = config.groups.filter((group) => group.id !== "founding" || country === "remote").map((group) =>
  `(${config.platforms.filter((platform) => platform.markets.includes(country)).map((platform) => `site:${platform.site}`).join(" OR ")}) ${group.query} ${countryTerms} after:${afterDate}`
);
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : { sources: {} };

function sleep(milliseconds) { return new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds)); }
function slug(value) { return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "job"; }
function isBoardUrl(value) {
  try { return [...acceptedDomains].some((domain) => new URL(value).hostname === domain || new URL(value).hostname.endsWith(`.${domain}`)); }
  catch { return false; }
}
function unwrapGoogleResult(value) {
  try {
    const parsed = new URL(value);
    if (parsed.hostname.endsWith("google.com") && parsed.pathname === "/url") return parsed.searchParams.get("q") ?? value;
  } catch { /* keep the original value; isBoardUrl will reject malformed URLs */ }
  return value;
}
function cleanText(value) { return value.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim(); }

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ locale: "pt-BR", userAgent: "Mozilla/5.0 (compatible; CareerResearchBot/1.0; personal job research)" });
const page = await context.newPage();
const candidates = new Set();

try {
  for (const query of queries) {
    if (candidates.size >= limit * 4) break;
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=pt-BR`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    const links = await page.locator("a").evaluateAll((anchors) => anchors.map((anchor) => anchor.href).filter(Boolean));
    for (const rawLink of links) {
      const link = unwrapGoogleResult(rawLink);
      if (isBoardUrl(link) && !state.sources[link]) candidates.add(link);
    }
    await sleep(1_000);
  }

  let saved = 0;
  let skipped = 0;
  for (const url of candidates) {
    if (saved >= limit) break;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForTimeout(700);
      const text = cleanText(await page.locator("body").innerText({ timeout: 10_000 }));
      const heading = cleanText(await page.locator("h1").first().innerText({ timeout: 3_000 }).catch(() => ""));
      const title = heading || cleanText(await page.title());
      if (text.length < 700 || /unusual traffic|captcha|access denied/i.test(text)) { skipped += 1; continue; }
      const hash = createHash("sha256").update(url).digest("hex").slice(0, 8);
      const filename = `${slug(title)}-${hash}.txt`;
      const relative = `career/applications/${filename}`;
      const contents = `Source URL: ${url}\nCollected at: ${new Date().toISOString()}\nMarket: ${country}\n\n${text}\n`;
      writeFileSync(join(destination, filename), contents, "utf8");
      state.sources[url] = { file: relative, title, collectedAt: new Date().toISOString() };
      saved += 1;
      console.log(`Saved ${relative}`);
    } catch (error) {
      skipped += 1;
      console.warn(`Skipped ${url}: ${error.message}`);
    }
    await sleep(1_200);
  }
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  console.log(`Collected ${saved}; skipped ${skipped}; Brazil/remote mode: ${country}.`);
} finally {
  await browser.close();
}
