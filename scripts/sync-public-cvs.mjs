import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;

for (const [id, cv] of Object.entries(manifest)) {
  if (!cv.public) continue;
  const generatedPdf = join(root, cv.source.slice(0, -extname(cv.source).length) + ".pdf");
  const output = join(root, cv.output);
  if (!existsSync(generatedPdf)) throw new Error(`Missing generated PDF for ${id}: ${generatedPdf}`);
  mkdirSync(dirname(output), { recursive: true });
  copyFileSync(generatedPdf, output);
  console.log(`Published ${id} -> ${cv.output}`);
}
