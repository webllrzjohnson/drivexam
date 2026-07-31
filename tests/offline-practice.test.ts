import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildOfflineAttempt,
  buildOfflinePack,
  createOfflinePackResponse,
  parseOfflinePack,
  parseOfflineSyncPayload,
  readBoundedRequestText,
  resolveOfflineAttempt,
  OfflineRequestTooLargeError,
  validateOfflineAttemptDate,
} from "../src/lib/learner/offline-practice";
import type { QuizQuestionView } from "../src/lib/learner/quiz";

const questions: QuizQuestionView[] = [
  {
    id: "question-current-1",
    publicId: "ontario-g1-001",
    prompt: "What must you do at a stop sign?",
    explanation: "Stop completely and proceed only when safe.",
    stage: "G1",
    type: "MULTIPLE_CHOICE",
    categoryName: "Signs",
    assets: [],
    choices: [
      { id: "choice-current-correct", publicId: "ontario-g1-001-choice-1", text: "Stop completely", isCorrect: true, asset: null },
      { id: "choice-current-wrong", publicId: "ontario-g1-001-choice-2", text: "Slow and continue", isCorrect: false, asset: null },
    ],
  },
];

describe("offline practice helpers", () => {
  it("builds a versioned public pack from learner-safe quiz views", () => {
    const pack = buildOfflinePack({ questions, generatedAt: new Date("2026-07-29T12:00:00.000Z") });

    assert.match(pack.version, /^offline-v1-/);
    assert.equal(pack.generatedAt, "2026-07-29T12:00:00.000Z");
    assert.deepEqual(pack.questions, questions);
  });

  it("serves the public pack as fresh JSON without storing personalized data", async () => {
    const response = await createOfflinePackResponse(async () => questions, new Date("2026-07-29T12:00:00.000Z"));
    const pack = await response.json();

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(pack.questions.length, 1);
    assert.equal(pack.questions[0].prompt, questions[0].prompt);
  });

  it("rejects malformed downloaded packs before browser storage", () => {
    const pack = buildOfflinePack({ questions, generatedAt: new Date("2026-07-29T12:00:00.000Z") });
    assert.equal(parseOfflinePack(pack).questions.length, 1);
    assert.throws(() => parseOfflinePack({ ...pack, questions: [{ id: "unsafe" }] }), /offline question pack/i);
  });

  it("records stable prompt and choice-text fallbacks with each local attempt", () => {
    const attempt = buildOfflineAttempt({
      clientAttemptId: "61ed2f79-d14a-4c65-a28e-256fabd483e1",
      createdAt: new Date("2026-07-29T12:30:00.000Z"),
      packVersion: "offline-v1-example",
      questions,
      selectedChoiceIdsByQuestion: { "question-current-1": ["choice-current-correct"] },
    });

    assert.equal(attempt.schemaVersion, 1);
    assert.equal(attempt.stage, "G1");
    assert.equal(attempt.status, "pending");
    assert.equal(attempt.percent, 100);
    assert.deepEqual(attempt.answers, [
      {
        questionId: "question-current-1",
        questionPublicId: "ontario-g1-001",
        questionPrompt: "What must you do at a stop sign?",
        selectedChoiceIds: ["choice-current-correct"],
        selectedChoicePublicIds: ["ontario-g1-001-choice-1"],
        selectedChoiceTexts: ["Stop completely"],
      },
    ]);
  });

  it("validates and bounds an untrusted sync batch", () => {
    const validAttempt = buildOfflineAttempt({
      clientAttemptId: "61ed2f79-d14a-4c65-a28e-256fabd483e1",
      createdAt: new Date("2026-07-29T12:30:00.000Z"),
      packVersion: "offline-v1-example",
      questions,
      selectedChoiceIdsByQuestion: { "question-current-1": ["choice-current-correct"] },
    });

    const parsed = parseOfflineSyncPayload({ attempts: [validAttempt] });
    assert.equal(parsed.attempts.length, 1);
    assert.equal(parsed.attempts[0].schemaVersion, 1);
    assert.equal(parsed.attempts[0].clientAttemptId, validAttempt.clientAttemptId);
    assert.equal("percent" in parsed.attempts[0], false, "server sync must ignore client-computed scores");

    assert.throws(
      () => parseOfflineSyncPayload({ attempts: Array.from({ length: 11 }, () => validAttempt) }),
      /offline attempt/i,
    );
    assert.throws(
      () => parseOfflineSyncPayload({ attempts: [{ ...validAttempt, schemaVersion: 2 }] }),
      /invalid literal|expected (?:input to be )?1/i,
    );
  });

  it("resolves reseeded question and choice IDs through stable text fallbacks", () => {
    const payload = parseOfflineSyncPayload({
      attempts: [
        {
          schemaVersion: 1,
          clientAttemptId: "61ed2f79-d14a-4c65-a28e-256fabd483e1",
          createdAt: "2026-07-29T12:30:00.000Z",
          packVersion: "offline-v1-old",
          stage: "G1",
          answers: [
            {
              questionId: "question-old-1",
              questionPublicId: "ontario-g1-001",
              questionPrompt: "What must you do at a stop sign?",
              selectedChoiceIds: ["choice-old-correct"],
              selectedChoicePublicIds: ["ontario-g1-001-choice-1"],
              selectedChoiceTexts: ["Stop completely"],
            },
          ],
        },
      ],
    });

    const resolved = resolveOfflineAttempt(questions, payload.attempts[0]);
    assert.deepEqual(resolved.selectedChoiceIdsByQuestion, {
      "question-current-1": ["choice-current-correct"],
    });
    assert.equal(resolved.skippedQuestionCount, 0);
  });

  it("rejects implausibly old or future-dated offline timestamps", () => {
    const now = new Date("2026-07-29T12:00:00.000Z");

    assert.equal(validateOfflineAttemptDate("2026-07-28T12:00:00.000Z", now)?.toISOString(), "2026-07-28T12:00:00.000Z");
    assert.equal(validateOfflineAttemptDate("2025-01-01T00:00:00.000Z", now), null);
    assert.equal(validateOfflineAttemptDate("2026-08-15T00:00:00.000Z", now), null);
  });

  it("enforces synchronization request limits while streaming UTF-8 bytes", async () => {
    const request = new Request("http://localhost/api/offline-attempts", {
      method: "POST",
      body: "😀😀",
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    await assert.rejects(() => readBoundedRequestText(request, 7), OfflineRequestTooLargeError);
  });
});
