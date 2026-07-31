import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildOfflineAttempt } from "../src/lib/learner/offline-practice";
import { synchronizeOfflineAttempts, type OfflineAttemptSaveInput } from "../src/lib/learner/offline-sync";
import type { QuizQuestionView } from "../src/lib/learner/quiz";

const questions: QuizQuestionView[] = [
  {
    id: "current-question",
    publicId: "ontario-g1-001",
    prompt: "What must you do at a stop sign?",
    explanation: "Stop completely.",
    stage: "G1",
    type: "MULTIPLE_CHOICE",
    categoryName: "Signs",
    assets: [],
    choices: [
      { id: "current-correct", publicId: "ontario-g1-001-choice-1", text: "Stop completely", isCorrect: true, asset: null },
      { id: "current-wrong", publicId: "ontario-g1-001-choice-2", text: "Roll through", isCorrect: false, asset: null },
    ],
  },
];

function buildPayload() {
  const attempt = buildOfflineAttempt({
    clientAttemptId: "61ed2f79-d14a-4c65-a28e-256fabd483e1",
    createdAt: new Date("2026-07-28T12:00:00.000Z"),
    packVersion: "offline-v1-pack",
    questions,
    selectedChoiceIdsByQuestion: { "current-question": ["current-correct"] },
  });
  return { attempts: [attempt] };
}

describe("offline attempt synchronization", () => {
  it("re-scores current published questions on the server before saving", async () => {
    const saved: OfflineAttemptSaveInput[] = [];
    const result = await synchronizeOfflineAttempts(buildPayload(), {
      now: new Date("2026-07-29T12:00:00.000Z"),
      hasAttempt: async () => false,
      loadQuestions: async () => questions,
      saveAttempt: async (attempt) => { saved.push(attempt); },
    });

    assert.equal(result.results[0].status, "synced");
    assert.equal(saved.length, 1);
    assert.equal(saved[0].correctCount, 1);
    assert.equal(saved[0].totalCount, 1);
    assert.equal(saved[0].percent, 100);
    assert.equal(saved[0].createdAt.toISOString(), "2026-07-28T12:00:00.000Z");
    assert.deepEqual(saved[0].answers[0].correctChoiceIds, ["current-correct"]);
  });

  it("treats replayed client attempt IDs as already synchronized", async () => {
    let saveCount = 0;
    const result = await synchronizeOfflineAttempts(buildPayload(), {
      now: new Date("2026-07-29T12:00:00.000Z"),
      hasAttempt: async () => true,
      loadQuestions: async () => questions,
      saveAttempt: async () => { saveCount += 1; },
    });

    assert.equal(result.results[0].status, "duplicate");
    assert.equal(saveCount, 0);
  });

  it("rejects an implausibly old attempt instead of rewriting its completion time", async () => {
    const payload = buildPayload();
    payload.attempts[0].createdAt = "2025-01-01T00:00:00.000Z";
    let saveCount = 0;
    const result = await synchronizeOfflineAttempts(payload, {
      now: new Date("2026-07-29T12:00:00.000Z"),
      hasAttempt: async () => false,
      loadQuestions: async () => questions,
      saveAttempt: async () => { saveCount += 1; },
    });

    assert.equal(result.results[0].status, "stale");
    assert.equal(result.results[0].reason, "invalid-date");
    assert.equal(saveCount, 0);
  });

  it("rejects the whole attempt when any question has been retired", async () => {
    const payload = buildPayload();
    payload.attempts[0].answers[0].questionId = "retired-id";
    payload.attempts[0].answers[0].selectedChoiceIds = ["retired-choice-id"];
    payload.attempts[0].answers.push({
      questionId: "missing-question",
      questionPublicId: "retired-question-public-id",
      questionPrompt: "A retired question",
      selectedChoiceIds: [],
      selectedChoicePublicIds: [],
      selectedChoiceTexts: [],
    });
    const saved: OfflineAttemptSaveInput[] = [];

    const result = await synchronizeOfflineAttempts(payload, {
      now: new Date("2026-07-29T12:00:00.000Z"),
      hasAttempt: async () => false,
      loadQuestions: async () => questions,
      saveAttempt: async (attempt) => { saved.push(attempt); },
    });

    assert.equal(result.results[0].status, "stale");
    assert.equal(result.results[0].skippedQuestionCount, 1);
    assert.equal(saved.length, 0);
  });

  it("does not fall back to an internal ID or prompt when a public question ID is retired", async () => {
    const payload = buildPayload();
    payload.attempts[0].answers[0].questionPublicId = "retired-question-public-id";
    const saved: OfflineAttemptSaveInput[] = [];

    const result = await synchronizeOfflineAttempts(payload, {
      now: new Date("2026-07-29T12:00:00.000Z"),
      hasAttempt: async () => false,
      loadQuestions: async () => questions,
      saveAttempt: async (attempt) => { saved.push(attempt); },
    });

    assert.equal(result.results[0].status, "stale");
    assert.equal(result.results[0].reason, "retired-questions");
    assert.equal(saved.length, 0);
  });

  it("rejects the whole attempt when a selected choice can no longer be resolved", async () => {
    const payload = buildPayload();
    payload.attempts[0].answers[0].selectedChoiceIds = ["retired-choice-id"];
    payload.attempts[0].answers[0].selectedChoicePublicIds = ["retired-choice-public-id"];
    payload.attempts[0].answers[0].selectedChoiceTexts = ["A retired answer"];
    const saved: OfflineAttemptSaveInput[] = [];

    const result = await synchronizeOfflineAttempts(payload, {
      now: new Date("2026-07-29T12:00:00.000Z"),
      hasAttempt: async () => false,
      loadQuestions: async () => questions,
      saveAttempt: async (attempt) => { saved.push(attempt); },
    });

    assert.equal(result.results[0].status, "stale");
    assert.equal(result.results[0].reason, "retired-questions");
    assert.equal(saved.length, 0);
  });

  it("does not fall back to an internal ID or text when a public choice ID is retired", async () => {
    const payload = buildPayload();
    payload.attempts[0].answers[0].selectedChoicePublicIds = ["retired-choice-public-id"];
    const saved: OfflineAttemptSaveInput[] = [];

    const result = await synchronizeOfflineAttempts(payload, {
      now: new Date("2026-07-29T12:00:00.000Z"),
      hasAttempt: async () => false,
      loadQuestions: async () => questions,
      saveAttempt: async (attempt) => { saved.push(attempt); },
    });

    assert.equal(result.results[0].status, "stale");
    assert.equal(result.results[0].reason, "retired-questions");
    assert.equal(saved.length, 0);
  });
});
