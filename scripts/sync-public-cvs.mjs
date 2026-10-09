import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;

const pendingCleanup = new Set();

for (const [id, cv] of Object.entries(manifest)) {
  if (!cv.public) continue;
  const filename = `${basename(cv.source, extname(cv.source))}.pdf`;
  // latexmk writes an input such as career/cvs/foo.tex to the current
  // workspace by default. Other compilers can write beside the source.
  const besideSource = join(root, cv.source.slice(0, -extname(cv.source).length) + ".pdf");
  const workspaceRoot = join(root, filename);
  const generatedPdf = existsSync(besideSource) ? besideSource : workspaceRoot;
  const output = join(root, cv.output);
  if (!existsSync(generatedPdf)) throw new Error(`Missing generated PDF for ${id}: ${generatedPdf}`);
  mkdirSync(dirname(output), { recursive: true });
  copyFileSync(generatedPdf, output);
  // Multiple manifest IDs may intentionally share one source (for example,
  // frontend-engineer and frontend-developer). Do not delete a workspace
  // artifact until every alias has had a chance to publish it.
  if (generatedPdf === workspaceRoot) pendingCleanup.add(workspaceRoot);
  console.log(`Published ${id} -> ${cv.output}`);
}

for (const generatedPdf of pendingCleanup) rmSync(generatedPdf, { force: true });
