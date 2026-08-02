import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildBalancedPracticeQuestionSet,
  buildG1MockExam,
  buildQuizNavigationState,
  buildPracticeQuestionSet,
  buildPracticeStageGuide,
  buildRoadSignFlashcardGroups,
  buildRoadSignPracticeGuide,
  buildQuizQuestionViews,
  getOfficialOntarioSourceUrl,
  getNextG1MockExamAttempt,
  normalizeG1MockExamAttempt,
  scoreQuizAnswers,
  scoreG1MockExam,
  type QuizQuestionInput,
  type QuizQuestionView,
} from "../src/lib/learner/quiz";

const questions: QuizQuestionInput[] = [
  {
    id: "q1",
    prompt: "What should you do at a stop sign?",
    explanation: "Come to a complete stop and proceed only when safe.",
    sourceReference: "https://www.ontario.ca/document/official-mto-drivers-handbook/signs",
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

function buildMockExamQuestion(id: string, categorySlug: string | null): QuizQuestionView {
  return {
    id,
    prompt: `Mock exam question ${id}`,
    explanation: "Review the relevant Ontario handbook rule.",
    stage: "G1",
    type: "MULTIPLE_CHOICE",
    categoryName: categorySlug === "g1-signs-and-lights" ? "Signs and traffic lights" : "Rules of the road",
    categorySlug,
    assets: [],
    choices: [
      { id: `${id}-correct`, text: "Correct", isCorrect: true, asset: null },
      { id: `${id}-wrong`, text: "Incorrect", isCorrect: false, asset: null },
    ],
  };
}

describe("learner quiz helpers", () => {
  it("builds safe learner-facing quiz views in choice order", () => {
    const views = buildQuizQuestionViews(questions);

    assert.equal(views.length, 2);
    assert.deepEqual(views[0], {
      id: "q1",
      prompt: "What should you do at a stop sign?",
      explanation: "Come to a complete stop and proceed only when safe.",
      sourceReference: "https://www.ontario.ca/document/official-mto-drivers-handbook/signs",
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

  it("allows only official HTTPS Ontario learner sources", () => {
    assert.equal(
      getOfficialOntarioSourceUrl("https://www.ontario.ca/document/official-mto-drivers-handbook/signs"),
      "https://www.ontario.ca/document/official-mto-drivers-handbook/signs",
    );
    assert.equal(getOfficialOntarioSourceUrl("http://www.ontario.ca/document/official-mto-drivers-handbook"), null);
    assert.equal(getOfficialOntarioSourceUrl("https://ontario.ca.evil.example/phishing"), null);
    assert.equal(getOfficialOntarioSourceUrl("javascript:alert(1)"), null);
  });

  it("deterministically mixes answer positions instead of exposing the stored correct-first order", () => {
    const correctFirstQuestions: QuizQuestionInput[] = Array.from({ length: 12 }, (_, index) => ({
      id: `position-q${index + 1}`,
      prompt: `Position test question ${index + 1}?`,
      explanation: "The stored order should not reveal which answer is correct.",
      stage: "G2",
      type: "MULTIPLE_CHOICE",
      category: { name: "Observation" },
      assets: [],
      choices: [
        { id: `position-q${index + 1}-correct`, text: "Correct", isCorrect: true, sortOrder: 0, asset: null },
        { id: `position-q${index + 1}-wrong-1`, text: "Wrong 1", isCorrect: false, sortOrder: 1, asset: null },
        { id: `position-q${index + 1}-wrong-2`, text: "Wrong 2", isCorrect: false, sortOrder: 2, asset: null },
        { id: `position-q${index + 1}-wrong-3`, text: "Wrong 3", isCorrect: false, sortOrder: 3, asset: null },
      ],
    }));

    const firstBuild = buildQuizQuestionViews(correctFirstQuestions);
    const secondBuild = buildQuizQuestionViews(correctFirstQuestions);
    const correctPositions = firstBuild.map((question) => question.choices.findIndex((choice) => choice.isCorrect));

    assert.deepEqual(secondBuild, firstBuild);
    assert.ok(new Set(correctPositions).size > 1, "correct choices appear in more than one answer position");
    assert.ok(correctPositions.some((position) => position > 0), "correct choices are not always first");
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

  it("builds clamped one-question quiz navigation state", () => {
    assert.deepEqual(buildQuizNavigationState(20, 0), {
      activeIndex: 0,
      questionNumber: 1,
      isFirst: true,
      isLast: false,
      previousIndex: 0,
      nextIndex: 1,
    });
    assert.deepEqual(buildQuizNavigationState(20, 10), {
      activeIndex: 10,
      questionNumber: 11,
      isFirst: false,
      isLast: false,
      previousIndex: 9,
      nextIndex: 11,
    });
    assert.deepEqual(buildQuizNavigationState(20, 99), {
      activeIndex: 19,
      questionNumber: 20,
      isFirst: false,
      isLast: true,
      previousIndex: 18,
      nextIndex: 19,
    });
  });

  it("builds stage-specific practice guidance for learner onboarding", () => {
    const guide = buildPracticeStageGuide({ stage: "G1", categoryCount: 5, questionCount: 20 });
    const fullGGuide = buildPracticeStageGuide({ stage: "G", categoryCount: 3, questionCount: 20 });

    assert.equal(guide.title, "G1 knowledge test practice");
    assert.equal(guide.questionTargetLabel, "20-question set loaded");
    assert.equal(guide.readinessTarget, "Aim for 80%+ twice before booking");
    assert.deepEqual(guide.milestones.map((milestone) => milestone.title), [
      "Learn the rule",
      "Answer with feedback",
      "Save and fix weak areas",
    ]);
    assert.match(fullGGuide.description, /road-test preparation scenarios/i);
    assert.match(fullGGuide.description, /not an official written test/i);
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

  it("builds deterministic category-balanced practice sets", () => {
    const pool = [
      ...Array.from({ length: 6 }, (_, index) => ({ id: `sign-${index + 1}`, categoryName: "Signs" })),
      ...Array.from({ length: 6 }, (_, index) => ({ id: `rule-${index + 1}`, categoryName: "Rules" })),
      ...Array.from({ length: 6 }, (_, index) => ({ id: `safety-${index + 1}`, categoryName: "Safety" })),
    ];

    const firstSet = buildBalancedPracticeQuestionSet(pool, { requestedSet: 1, pageSize: 9, seed: "G1" });
    const repeatedSet = buildBalancedPracticeQuestionSet(pool, { requestedSet: 1, pageSize: 9, seed: "G1" });
    const secondSet = buildBalancedPracticeQuestionSet(pool, { requestedSet: 2, pageSize: 9, seed: "G1" });

    assert.deepEqual(repeatedSet, firstSet);
    assert.deepEqual(firstSet.questions.slice(0, 3).map((question) => question.categoryName), ["Signs", "Rules", "Safety"]);
    assert.equal(new Set(firstSet.questions.map((question) => question.categoryName)).size, 3);
    assert.equal(firstSet.questions.some((question) => secondSet.questions.some((candidate) => candidate.id === question.id)), false);
  });

  it("builds a 40-question G1 mock exam with separate signs and rules sections", () => {
    const pool = [
      ...Array.from({ length: 24 }, (_, index) => buildMockExamQuestion(`sign-${index + 1}`, "g1-signs-and-lights")),
      ...Array.from({ length: 30 }, (_, index) => buildMockExamQuestion(`rule-${index + 1}`, "g1-safe-driving")),
    ];

    const exam = buildG1MockExam(pool, { seed: "attempt-1" });
    const repeated = buildG1MockExam(pool, { seed: "attempt-1" });

    assert.equal(exam.ready, true);
    assert.equal(exam.questions.length, 40);
    assert.equal(exam.sections.signs.length, 20);
    assert.equal(exam.sections.rules.length, 20);
    assert.deepEqual(repeated, exam);
    assert.ok(exam.sections.signs.every((question) => question.categorySlug === "g1-signs-and-lights"));
    assert.ok(exam.sections.rules.every((question) => question.categorySlug !== "g1-signs-and-lights"));
  });

  it("fails closed when G1 questions do not have a recognized mock-exam category", () => {
    const pool = [
      ...Array.from({ length: 20 }, (_, index) => buildMockExamQuestion(`sign-${index + 1}`, "g1-signs-and-lights")),
      ...Array.from({ length: 20 }, (_, index) => buildMockExamQuestion(`uncategorized-${index + 1}`, null)),
    ];
    const selection = Object.fromEntries(pool.map((question) => [question.id, [`${question.id}-correct`]]));

    const exam = buildG1MockExam(pool, { seed: "fail-closed" });
    const score = scoreG1MockExam(pool, selection);

    assert.equal(exam.ready, false);
    assert.equal(exam.sections.rules.length, 0);
    assert.equal(exam.missing.rules, 20);
    assert.equal(score.sections.rules.totalCount, 0);
    assert.equal(score.passed, false);
  });

  it("normalizes and wraps bounded mock-exam attempt numbers", () => {
    assert.equal(normalizeG1MockExamAttempt(undefined), 1);
    assert.equal(normalizeG1MockExamAttempt("999"), 999);
    assert.equal(normalizeG1MockExamAttempt("1000"), 999);
    assert.equal(getNextG1MockExamAttempt(998), 999);
    assert.equal(getNextG1MockExamAttempt(999), 1);
  });

  it("requires at least 16 correct answers in both G1 mock-exam sections", () => {
    const pool = [
      ...Array.from({ length: 20 }, (_, index) => buildMockExamQuestion(`sign-${index + 1}`, "g1-signs-and-lights")),
      ...Array.from({ length: 20 }, (_, index) => buildMockExamQuestion(`rule-${index + 1}`, "g1-safe-driving")),
    ];
    const exam = buildG1MockExam(pool, { seed: "attempt-1" });
    const selection = Object.fromEntries(exam.questions.map((question) => [question.id, [`${question.id}-correct`]]));
    for (const question of exam.sections.rules.slice(15)) selection[question.id] = [`${question.id}-wrong`];

    const result = scoreG1MockExam(exam.questions, selection);

    assert.equal(result.sections.signs.correctCount, 20);
    assert.equal(result.sections.signs.passed, true);
    assert.equal(result.sections.rules.correctCount, 15);
    assert.equal(result.sections.rules.passed, false);
    assert.equal(result.passed, false);

    selection[exam.sections.rules[15].id] = [`${exam.sections.rules[15].id}-correct`];
    assert.equal(scoreG1MockExam(exam.questions, selection).passed, true);
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
