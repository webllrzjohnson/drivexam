import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildDailyStudyPlan,
  buildQuizAttemptRows,
  summarizeQuizProgress,
  type ProgressAttemptInput,
} from "../src/lib/learner/progress";
import type { QuizQuestionView } from "../src/lib/learner/quiz";

const quizQuestions: QuizQuestionView[] = [
  {
    id: "q1",
    prompt: "Stop sign rule?",
    explanation: "Stop completely.",
    stage: "G1",
    type: "MULTIPLE_CHOICE",
    categoryName: "Signs",
    assets: [],
    choices: [
      { id: "c1", text: "Stop completely", isCorrect: true, asset: null },
      { id: "c2", text: "Roll through", isCorrect: false, asset: null },
    ],
  },
  {
    id: "q2",
    prompt: "Safe habits?",
    explanation: "Check mirrors and keep space.",
    stage: "G1",
    type: "MULTI_SELECT",
    categoryName: "Highway",
    assets: [],
    choices: [
      { id: "c3", text: "Check mirrors", isCorrect: true, asset: null },
      { id: "c4", text: "Tailgate", isCorrect: false, asset: null },
      { id: "c5", text: "Keep space", isCorrect: true, asset: null },
    ],
  },
];

const attempts: ProgressAttemptInput[] = [
  { id: "a1", stage: "G1", correctCount: 4, totalCount: 5, percent: 80, createdAt: new Date("2026-07-20T10:00:00Z"), answers: [{ isCorrect: false, categoryName: "Signs" }] },
  { id: "a2", stage: "G1", correctCount: 2, totalCount: 5, percent: 40, createdAt: new Date("2026-07-21T10:00:00Z"), answers: [{ isCorrect: false, categoryName: "Rules" }, { isCorrect: false, categoryName: "Rules" }] },
  { id: "a3", stage: "G2", correctCount: 5, totalCount: 5, percent: 100, createdAt: new Date("2026-07-22T10:00:00Z"), answers: [] },
];

describe("learner progress helpers", () => {
  it("builds attempt answer rows from quiz scoring", () => {
    const rows = buildQuizAttemptRows(quizQuestions, { q1: ["c1"], q2: ["c3", "c4"] });

    assert.deepEqual(rows.map((row) => ({ questionId: row.questionId, categoryName: row.categoryName, isCorrect: row.isCorrect, selectedChoiceIds: row.selectedChoiceIds, correctChoiceIds: row.correctChoiceIds })), [
      { questionId: "q1", categoryName: "Signs", isCorrect: true, selectedChoiceIds: ["c1"], correctChoiceIds: ["c1"] },
      { questionId: "q2", categoryName: "Highway", isCorrect: false, selectedChoiceIds: ["c3", "c4"], correctChoiceIds: ["c3", "c5"] },
    ]);
  });

  it("summarizes attempts into dashboard cards and weak areas", () => {
    const summary = summarizeQuizProgress(attempts);

    assert.equal(summary.attemptCount, 3);
    assert.equal(summary.averagePercent, 73);
    assert.equal(summary.bestPercent, 100);
    assert.equal(summary.latestPercent, 100);
    assert.equal(summary.totalQuestionsAnswered, 15);
    assert.deepEqual(summary.weakAreas, [
      { categoryName: "Rules", missedCount: 2 },
      { categoryName: "Signs", missedCount: 1 },
    ]);
  });

  it("handles empty progress", () => {
    const summary = summarizeQuizProgress([]);

    assert.equal(summary.attemptCount, 0);
    assert.equal(summary.averagePercent, 0);
    assert.equal(summary.bestPercent, 0);
    assert.equal(summary.latestPercent, 0);
    assert.equal(summary.totalQuestionsAnswered, 0);
    assert.deepEqual(summary.weakAreas, []);
  });

  it("builds a daily study plan from weak areas and target test date", () => {
    const summary = summarizeQuizProgress(attempts);
    const plan = buildDailyStudyPlan({
      currentStage: "G1",
      targetTestDate: new Date("2026-07-30T12:00:00Z"),
      today: new Date("2026-07-24T12:00:00Z"),
      summary,
    });

    assert.equal(plan.stageLabel, "G1 knowledge test");
    assert.equal(plan.daysUntilTest, 6);
    assert.equal(plan.focusArea, "Rules");
    assert.deepEqual(plan.actions.map((action) => action.title), [
      "Review Rules",
      "Take a 20-question G1 practice quiz",
      "Read one G1 knowledge lesson",
    ]);
    assert.equal(plan.readinessTone, "steady");
  });

  it("gives a starter plan when no quizzes are saved yet", () => {
    const plan = buildDailyStudyPlan({
      currentStage: null,
      targetTestDate: null,
      today: new Date("2026-07-24T12:00:00Z"),
      summary: summarizeQuizProgress([]),
    });

    assert.equal(plan.stageLabel, "G1 knowledge test");
    assert.equal(plan.daysUntilTest, null);
    assert.equal(plan.focusArea, "Road signs and rules");
    assert.equal(plan.readinessTone, "starter");
    assert.deepEqual(plan.actions.map((action) => action.title), [
      "Start with road signs and rules",
      "Take a 10-question G1 practice quiz",
      "Save your result to unlock weak-area review",
    ]);
  });
});
