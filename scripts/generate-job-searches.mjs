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
const querySiteFor = (platform) => platform.searchSite ?? platform.site;
const marketTermsFor = (platform, market) => platform.marketTerms?.[market] ?? markets[market];

for (const platform of config.platforms) {
  for (const market of platform.markets) {
    for (const group of groupsFor(platform)) {
      if (group.id === "founding" && !["ashby", "greenhouse", "lever"].includes(platform.id)) continue;
      const query = [`site:${querySiteFor(platform)}`, group.query, marketTermsFor(platform, market), `after:${afterDate}`].filter(Boolean).join(" ");
      rows.push({ platform, market, group, query, url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
    }
  }
}

const selected = rows.filter((row) => primaryPlatforms.has(row.platform.id));
const markdown = [
  "# Job-board search radar",
  "",
  `Generated ${new Date().toISOString().slice(0, 10)}. The rolling freshness filter is **after:${afterDate}** (${days} days). Google indexing date is only a discovery signal; open the ATS page and confirm that the role is active before applying.`,
  "",
  "## Run first",
  "",
  ...selected.map((row) => `- [${row.group.label} — ${row.platform.label} — ${row.market === "remote" ? "International remote" : "Brazil"}](${row.url})`),
  "",
  "## Secondary boards",
  "",
  ...rows.filter((row) => !primaryPlatforms.has(row.platform.id)).map((row) => `- [${row.group.label} — ${row.platform.label} — ${row.market === "remote" ? "International remote" : "Brazil"}](${row.url})`),
  "",
  "## Workflow",
  "",
  "1. Run the first section daily with `pnpm jobs:searches`.",
  "2. Confirm the board is active and save the full description as `career/applications/<company>-<role>.txt`.",
  "3. Run `pnpm applications:analyze`; create a tailored CV only for strong, truthful matches.",
  ""
].join("\n");

mkdirSync(join(root, "career/platforms"), { recursive: true });
writeFileSync(join(root, "career/platforms/README.md"), markdown);
console.log(`Wrote ${rows.length} Google search URLs with after:${afterDate}.`);
