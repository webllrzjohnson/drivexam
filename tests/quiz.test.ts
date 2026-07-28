import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildPracticeQuestionSet,
  buildPracticeStageGuide,
  buildRoadSignFlashcardGroups,
  buildRoadSignPracticeGuide,
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

  it("builds stage-specific practice guidance for learner onboarding", () => {
    const guide = buildPracticeStageGuide({ stage: "G1", categoryCount: 5, questionCount: 20 });

    assert.equal(guide.title, "G1 knowledge test practice");
    assert.equal(guide.questionTargetLabel, "20-question set loaded");
    assert.equal(guide.readinessTarget, "Aim for 80%+ twice before booking");
    assert.deepEqual(guide.milestones.map((milestone) => milestone.title), [
      "Learn the rule",
      "Answer with feedback",
      "Save and fix weak areas",
    ]);
  });

  it("explains the empty practice state for the selected stage", () => {
    const guide = buildPracticeStageGuide({ stage: "G2", categoryCount: 0, questionCount: 0 });

    assert.equal(guide.title, "G2 road test prep");
    assert.equal(guide.questionTargetLabel, "No published G2 questions yet");
    assert.match(guide.emptyState, /Admin → Questions/);
  });

  it("splits larger practice pools into learner-selectable question sets", () => {
    const pool = Array.from({ length: 40 }, (_, index) => ({ id: `q${index + 1}` }));

    const firstSet = buildPracticeQuestionSet(pool, { requestedSet: 1, pageSize: 20 });
    const secondSet = buildPracticeQuestionSet(pool, { requestedSet: 2, pageSize: 20 });
    const clampedSet = buildPracticeQuestionSet(pool, { requestedSet: 99, pageSize: 20 });

    assert.equal(firstSet.totalCount, 40);
    assert.equal(firstSet.totalSets, 2);
    assert.equal(firstSet.activeSet, 1);
    assert.deepEqual(firstSet.questions.map((question) => question.id), Array.from({ length: 20 }, (_, index) => `q${index + 1}`));
    assert.deepEqual(secondSet.questions.map((question) => question.id), Array.from({ length: 20 }, (_, index) => `q${index + 21}`));
    assert.equal(clampedSet.activeSet, 2);
  });

  it("builds dedicated road-sign practice guidance", () => {
    const guide = buildRoadSignPracticeGuide({ assetCount: 40, questionCount: 35 });

    assert.equal(guide.title, "Ontario road signs only");
    assert.equal(guide.assetLabel, "40 Ontario sign images");
    assert.equal(guide.questionLabel, "35 image questions");
    assert.match(guide.description, /flashcards/i);
    assert.deepEqual(guide.actions.map((action) => action.label), ["Start signs quiz", "Review G1 practice"]);
  });

  it("groups road-sign flashcards into learner-friendly filters", () => {
    const groups = buildRoadSignFlashcardGroups([
      { title: "Stop sign", path: "/uploads/road-signs/ontario-stop.svg", description: "Ontario stop sign" },
      { title: "Slippery road sign", path: "/uploads/road-signs/ontario-slippery-road.svg", description: "Ontario slippery road sign" },
      { title: "Road work ahead sign", path: "/uploads/road-signs/ontario-road-work-ahead.svg", description: "Ontario road work sign" },
      { title: "No parking sign", path: "/uploads/road-signs/ontario-no-parking.svg", description: "Ontario no parking sign" },
      { title: "Bicycle lane sign", path: "/uploads/road-signs/ontario-bicycle-lane.svg", description: "Ontario bicycle lane sign" },
    ]);

    assert.deepEqual(groups.map((group) => group.label), ["All signs", "Regulatory", "Warning", "Construction", "Parking", "Bicycle / pedestrian"]);
    assert.equal(groups[0].cards.length, 5);
    assert.equal(groups.find((group) => group.key === "regulatory")?.cards[0].title, "Stop sign");
    assert.equal(groups.find((group) => group.key === "warning")?.cards[0].title, "Slippery road sign");
    assert.equal(groups.find((group) => group.key === "construction")?.cards[0].title, "Road work ahead sign");
    assert.equal(groups.find((group) => group.key === "parking")?.cards[0].title, "No parking sign");
    assert.equal(groups.find((group) => group.key === "bicycle-pedestrian")?.cards[0].title, "Bicycle lane sign");
  });
});
