import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { it } from "node:test";

it("bounds mistake history with a per-question SQL window ordered by attempt time", async () => {
  const source = await readFile(path.join(process.cwd(), "src/lib/learner/mistake-review.ts"), "utf8");

  assert.match(source, /ROW_NUMBER\(\) OVER/i);
  assert.match(source, /PARTITION BY answer\."questionId"/);
  assert.match(source, /attempt\."createdAt" DESC/);
  assert.match(source, /ranked\."answerRank" <= 2/);
  assert.match(source, /attempt\."userId" = \$\{userId\}/);
  assert.match(source, /question\.status = 'PUBLISHED'/);
});