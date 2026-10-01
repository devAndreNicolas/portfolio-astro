import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, copyFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = join(root, "career/cvs/manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")).cvs;
const [command = "list", ...rawSelectors] = process.argv.slice(2);
const selectors = rawSelectors.filter((selector) => selector !== "--");

function fail(message) {
  console.error(`CV error: ${message}`);
  process.exitCode = 1;
}

function commandExists(commandName) {
  try {
    execFileSync(commandName, ["--version"], { stdio: "ignore" });
    return true;
  } catch { return false; }
}

function getEngine() {
  const requested = process.env.CV_ENGINE;
  if (requested === "latexmk" || requested === "tectonic") return requested;
  if (commandExists("latexmk")) return "latexmk";
  if (commandExists("tectonic")) return "tectonic";
  throw new Error("Neither latexmk nor tectonic is installed. Install a LaTeX engine; see docs/cv-toolchain.md.");
}

function resolveTarget(selector) {
  if (manifest[selector]) return { id: selector, ...manifest[selector] };
  const source = relative(root, resolve(root, selector)).replaceAll("\\", "/");
  const match = Object.entries(manifest).find(([, cv]) => cv.source === source);
  if (match) return { id: match[0], ...match[1] };
  if (source.endsWith(".tex") && existsSync(join(root, source))) {
    return { id: basename(source, ".tex"), source, output: `public/cv/${basename(source, ".tex")}.pdf`, public: false };
  }
  throw new Error(`Unknown CV '${selector}'. Use 'pnpm cv:list', a manifest ID, or a path to a .tex file.`);
}

function run(executable, args) {
  execFileSync(executable, args, { cwd: root, stdio: "inherit" });
}

function build(target) {
  const sourcePath = join(root, target.source);
  if (!existsSync(sourcePath)) throw new Error(`Source not found: ${target.source}`);
  const workDir = join(root, "career/.build", target.id);
  const outputPath = join(root, target.output);
  mkdirSync(workDir, { recursive: true });
  mkdirSync(dirname(outputPath), { recursive: true });
  const engine = getEngine();

  if (engine === "latexmk") {
    run("latexmk", ["-xelatex", "-interaction=nonstopmode", "-halt-on-error", "-file-line-error", `-outdir=${workDir}`, target.source]);
  } else {
    run("tectonic", ["-X", "compile", "--outdir", workDir, target.source]);
  }

  const generatedPdf = join(workDir, `${basename(target.source, extname(target.source))}.pdf`);
  if (!existsSync(generatedPdf)) throw new Error(`Compiler completed without creating ${generatedPdf}`);
  copyFileSync(generatedPdf, outputPath);
  console.log(`Built ${target.id} -> ${target.output}`);
}

if (command === "list") {
  for (const [id, cv] of Object.entries(manifest)) console.log(`${id}\t${cv.language}\t${cv.source}`);
} else if (command === "build") {
  try {
    const targets = selectors.length ? selectors.map(resolveTarget) : Object.entries(manifest).map(([id, cv]) => ({ id, ...cv }));
    targets.forEach(build);
  } catch (error) { fail(error.message); }
} else if (command === "clean") {
  const buildDirectory = join(root, "career/.build");
  if (existsSync(buildDirectory)) rmSync(buildDirectory, { recursive: true, force: true });
  console.log("Removed career/.build intermediate files.");
} else {
  fail("Expected one of: list, build, clean.");
}
