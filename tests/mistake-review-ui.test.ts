import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

async function read(relativePath: string) {
  return readFile(path.join(root, relativePath), "utf8");
}

describe("mistake review UI", () => {
  it("ships a personalized published-question retry route", async () => {
    const page = await read("src/app/(public)/mistake-review/page.tsx");

    assert.match(page, /getCurrentUser/);
    assert.match(page, /emailVerified/);
    assert.match(page, /Sign in to review mistakes/i);
    assert.match(page, /getMistakeReviewHistory/);
    assert.doesNotMatch(page, /quizAttemptAnswer\.findMany/);
    assert.match(page, /buildMistakeReviewQueue/);
    assert.match(page, /filterMistakeReviewItems/);
    assert.match(page, /<PracticeQuiz/);
    assert.match(page, /questions=\{quizQuestions\}/);
    assert.match(page, /returnTo=\{returnTo\}/);
    assert.match(page, /Two correct retries in a row remove a question/i);
  });

  it("offers stage and weak-category targeting without exposing retired questions", async () => {
    const page = await read("src/app/(public)/mistake-review/page.tsx");

    assert.match(page, /stageOptions/);
    assert.match(page, /item\.stage === stage/);
    assert.match(page, /id: \{ in: selectedItems\.map/);
    assert.match(page, /status: "PUBLISHED"/);
    assert.match(page, /choices: \{ some: \{ isCorrect: true \} \}/);
    assert.match(page, /No active mistakes/i);
  });

  it("connects the active retry queue to dashboard study actions", async () => {
    const dashboardPage = await read("src/app/dashboard/page.tsx");
    const dashboardShell = await read("src/components/dashboard/dashboard-shell.tsx");

    assert.match(dashboardPage, /buildMistakeReviewQueue/);
    assert.match(dashboardPage, /getMistakeReviewHistory/);
    assert.doesNotMatch(dashboardPage, /quizAttemptAnswer\.findMany/);
    assert.match(dashboardPage, /mistakeReview=\{mistakeReview\}/);
    assert.match(dashboardShell, /mistakeReview\.activeCount/);
    assert.match(dashboardShell, /href="\/mistake-review"/);
    assert.match(dashboardShell, /stage=\$\{area\.stage\}/);
    assert.match(dashboardShell, /Review mistakes/i);
  });
});
