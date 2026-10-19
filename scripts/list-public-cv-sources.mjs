import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, join } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "career/cvs/manifest.json"), "utf8")).cvs;
const sources = [...new Set(Object.values(manifest).filter((cv) => cv.public).map((cv) => cv.source))].sort();

if (!sources.length) throw new Error("No public CV sources are configured in the manifest.");
console.log(sources.join("\n"));
