import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("role recommender returns evidence-grounded role priorities", () => {
  const output = execFileSync(process.execPath, ["scripts/recommend-roles.mjs"], { encoding: "utf8" });
  assert.match(output, /Frontend Engineer/);
  assert.match(output, /Full Stack Engineer/);
});
