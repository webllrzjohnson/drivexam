import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildQuizQuestionViews,
  scoreQuizAnswers,
  type QuizQuestionInput,
} from "../src/lib/learner/quiz";

const questions: QuizQuestionInput[] = [
  {
    id: "q1",
    prompt: "What should you do at a stop sign?",
    explanation: "Come to a complete stop and proceed only when safe.",
    stage: "G1",
    type: "MULTIPLE_CHOICE",
    category: { name: "Signs" },
    assets: [{ asset: { path: "/uploads/road-signs/stop.svg", title: "Stop sign" } }],
    choices: [
      { id: "c2", text: "Slow down only", isCorrect: false, sortOrder: 1, asset: null },
      { id: "c1", text: "Stop completely", isCorrect: true, sortOrder: 0, asset: null },
    ],
  },
  {
    id: "q2",
    prompt: "Select safe highway habits.",
    explanation: "Safe highway driving includes mirror checks and space management.",
    stage: "G",
    type: "MULTI_SELECT",
    category: null,
    assets: [],
    choices: [
      { id: "c3", text: "Check mirrors", isCorrect: true, sortOrder: 0, asset: null },
      { id: "c4", text: "Tailgate", isCorrect: false, sortOrder: 1, asset: null },
      { id: "c5", text: "Keep space", isCorrect: true, sortOrder: 2, asset: null },
    ],
  },
];

describe("learner quiz helpers", () => {
  it("builds safe learner-facing quiz views in choice order", () => {
    const views = buildQuizQuestionViews(questions);

    assert.equal(views.length, 2);
    assert.deepEqual(views[0], {
      id: "q1",
      prompt: "What should you do at a stop sign?",
      explanation: "Come to a complete stop and proceed only when safe.",
      stage: "G1",
      type: "MULTIPLE_CHOICE",
      categoryName: "Signs",
      assets: [{ path: "/uploads/road-signs/stop.svg", title: "Stop sign" }],
      choices: [
        { id: "c1", text: "Stop completely", isCorrect: true, asset: null },
        { id: "c2", text: "Slow down only", isCorrect: false, asset: null },
      ],
    });
  });

  it("scores exact selected choice sets and returns review rows", () => {
    const views = buildQuizQuestionViews(questions);
    const result = scoreQuizAnswers(views, {
      q1: ["c1"],
      q2: ["c3", "c4"],
    });

    assert.equal(result.correctCount, 1);
    assert.equal(result.totalCount, 2);
    assert.equal(result.percent, 50);
    assert.deepEqual(result.review.map((row) => ({ questionId: row.questionId, isCorrect: row.isCorrect, correctChoiceIds: row.correctChoiceIds })), [
      { questionId: "q1", isCorrect: true, correctChoiceIds: ["c1"] },
      { questionId: "q2", isCorrect: false, correctChoiceIds: ["c3", "c5"] },
    ]);
  });

  it("handles empty quizzes without dividing by zero", () => {
    const result = scoreQuizAnswers([], {});

    assert.equal(result.correctCount, 0);
    assert.equal(result.totalCount, 0);
    assert.equal(result.percent, 0);
    assert.deepEqual(result.review, []);
  });
});
