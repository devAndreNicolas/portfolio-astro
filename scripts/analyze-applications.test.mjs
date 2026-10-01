import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("APAS report exposes unsupported seniority and security-specific requirements", () => {
  const output = execFileSync(process.execPath, ["scripts/analyze-applications.mjs", "APAS.AI"], { encoding: "utf8" });
  assert.match(output, /\b\d{1,2}\s+fullstack-engineer-br\b/);
  assert.doesNotMatch(output, /^100\s/m);
});

test("empty descriptions are excluded from the analysis corpus", () => {
  const output = execFileSync(process.execPath, ["scripts/analyze-applications.mjs"], { encoding: "utf8" });
  assert.doesNotMatch(output, /Agência-Segundo-Desenvolvedor/);
});
