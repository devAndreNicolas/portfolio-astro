import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const directory = join(root, "career/tailoring-requests");
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const statuses = new Set(["draft", "ready", "needs-input", "needs-review", "completed"]);
const languages = new Set(["pt-BR", "en"]);
const deliveries = new Set(["private", "public"]);
const ids = new Set();
let invalid = 0;
let total = 0;

function problem(file, message) {
  invalid += 1;
  console.error(`${file}: ${message}`);
}

for (const filename of readdirSync(directory).filter((file) => file.endsWith(".json") && file !== "_template.json")) {
  total += 1;
  let request;
  try {
    request = JSON.parse(readFileSync(join(directory, filename), "utf8"));
  } catch (error) {
    problem(filename, `invalid JSON (${error.message})`);
    continue;
  }

  if (request.schemaVersion !== 1) problem(filename, "schemaVersion must be 1");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(request.id ?? "")) problem(filename, "id must be unique kebab-case");
  else if (ids.has(request.id)) problem(filename, `duplicate id ${request.id}`);
  else ids.add(request.id);
  if (!statuses.has(request.status)) problem(filename, "status must be draft, ready, needs-input, needs-review, or completed");

  const jobSource = request.job?.source;
  if (typeof jobSource !== "string" || !jobSource.startsWith("career/applications/") || !jobSource.endsWith(".txt")) {
    problem(filename, "job.source must point to a .txt under career/applications/");
  } else if (!existsSync(resolve(root, jobSource))) {
    problem(filename, `job.source does not exist: ${jobSource}`);
  }

  const target = request.target ?? {};
  if (!languages.has(target.language)) problem(filename, "target.language must be pt-BR or en");
  if (target.baseCv !== "auto" && !manifest[target.baseCv]) problem(filename, "target.baseCv must be auto or a CV ID from career/cvs/manifest.json");
  if (!deliveries.has(target.delivery)) problem(filename, "target.delivery must be private or public");

  const tailoring = request.tailoring ?? {};
  if (!Array.isArray(tailoring.priorities) || tailoring.priorities.some((item) => typeof item !== "string" || !item.trim())) problem(filename, "tailoring.priorities must be an array of non-empty strings");
  if (!Array.isArray(tailoring.avoid) || tailoring.avoid.some((item) => typeof item !== "string")) problem(filename, "tailoring.avoid must be an array of strings");
  if (typeof tailoring.notes !== "string") problem(filename, "tailoring.notes must be a string");

  if (request.status === "ready" && (!Array.isArray(tailoring.priorities) || tailoring.priorities.length === 0)) problem(filename, "a ready request needs at least one tailoring priority");
  if (request.status === "ready" && target.delivery === "public") problem(filename, "a ready request must start private; request public publication only during review");
}

if (invalid) process.exitCode = 1;
else console.log(`Tailoring request queue valid (${total} request${total === 1 ? "" : "s"}).`);
