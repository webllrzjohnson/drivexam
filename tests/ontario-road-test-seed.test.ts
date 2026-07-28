import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ontarioG1SeedQuestions,
} from "../src/lib/seed/ontario-g1-content";
import {
  getOntarioRoadTestSeedSummary,
  ontarioRoadTestChecklistItems,
  ontarioRoadTestSeedCategories,
  ontarioRoadTestSeedQuestions,
} from "../src/lib/seed/ontario-road-test-content";

describe("Ontario G2/G road-test seed content", () => {
  it("ships a starter road-test batch for G2 and full G learners", () => {
    const summary = getOntarioRoadTestSeedSummary();

    assert.equal(summary.categoryCount, 6);
    assert.equal(summary.questionCount, 52);
    assert.equal(summary.checklistCount, 16);
    assert.equal(summary.sourceCount, 5);
    assert.equal(summary.questionCountsByStage.G2, 40);
    assert.equal(summary.questionCountsByStage.G, 12);
    assert.equal(summary.checklistCountsByStage.G2, 8);
    assert.equal(summary.checklistCountsByStage.G, 8);
  });

  it("ships a broad G2 road-test practice bank across readiness, observation, and control", () => {
    const g2Questions = ontarioRoadTestSeedQuestions.filter((question) => question.stage === "G2");
    const g2QuestionsByCategory = g2Questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.categorySlug] = (acc[question.categorySlug] ?? 0) + 1;
      return acc;
    }, {});

    assert.equal(g2Questions.length, 40);
    assert.ok(g2QuestionsByCategory["g2-observation-and-right-of-way"] >= 14);
    assert.ok(g2QuestionsByCategory["g2-turns-parking-and-control"] >= 14);
    assert.ok(g2QuestionsByCategory["g2-road-test-readiness"] >= 8);
  });

  it("uses stable unique category slugs, question prompts, and checklist titles", () => {
    assert.equal(new Set(ontarioRoadTestSeedCategories.map((category) => category.slug)).size, ontarioRoadTestSeedCategories.length);
    assert.equal(new Set(ontarioRoadTestSeedQuestions.map((question) => question.prompt)).size, ontarioRoadTestSeedQuestions.length);
    assert.equal(new Set(ontarioRoadTestChecklistItems.map((item) => `${item.stage}:${item.section}:${item.title}`)).size, ontarioRoadTestChecklistItems.length);
  });

  it("does not reuse G1 prompts because prompt-based reseeding deletes older rows", () => {
    const g1Prompts = new Set(ontarioG1SeedQuestions.map((question) => question.prompt));
    const reusedPrompt = ontarioRoadTestSeedQuestions.find((question) => g1Prompts.has(question.prompt));

    assert.equal(reusedPrompt, undefined);
  });

  it("links every item to a seeded category and official Ontario source", () => {
    const slugs = new Set(ontarioRoadTestSeedCategories.map((category) => category.slug));
    const officialSource = /^https:\/\/www\.ontario\.ca\//;

    for (const question of ontarioRoadTestSeedQuestions) {
      assert.ok(slugs.has(question.categorySlug), `${question.prompt} has a seeded category`);
      assert.match(question.sourceReference, officialSource);
    }

    for (const item of ontarioRoadTestChecklistItems) {
      assert.ok(slugs.has(item.categorySlug), `${item.title} has a seeded category`);
      assert.match(item.sourceReference, officialSource);
    }
  });

  it("keeps road-test questions and checklist items learner-usable", () => {
    for (const question of ontarioRoadTestSeedQuestions) {
      assert.ok(question.prompt.length >= 20, `${question.prompt} has a meaningful prompt`);
      assert.ok(question.explanation.length >= 50, `${question.prompt} has a useful explanation`);
      assert.equal(question.choices.length, 4, `${question.prompt} has four answer choices`);
      assert.equal(question.choices.filter((choice) => choice.isCorrect).length, 1, `${question.prompt} has one correct answer`);
    }

    for (const item of ontarioRoadTestChecklistItems) {
      assert.ok(item.title.length >= 12, `${item.title} has a meaningful title`);
      assert.ok(item.description.length >= 40, `${item.title} has a useful description`);
      assert.ok(["BEFORE_TEST", "DURING_TEST", "COMMON_FAIL_REASONS", "SELF_ASSESSMENT"].includes(item.section));
    }
  });
});
