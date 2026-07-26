import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getOntarioG1SeedSummary, ontarioG1SeedCategories, ontarioG1SeedQuestions } from "../src/lib/seed/ontario-g1-content";

describe("Ontario G1 seed content", () => {
  it("ships a practical first batch of active categories and questions", () => {
    const summary = getOntarioG1SeedSummary();

    assert.equal(summary.categoryCount, 5);
    assert.equal(summary.questionCount, 20);
    assert.equal(summary.sourceCount, 4);
  });

  it("uses stable unique category slugs and prompts", () => {
    assert.equal(new Set(ontarioG1SeedCategories.map((category) => category.slug)).size, ontarioG1SeedCategories.length);
    assert.equal(new Set(ontarioG1SeedQuestions.map((question) => question.prompt)).size, ontarioG1SeedQuestions.length);
  });

  it("links every question to a seeded category and official Ontario source", () => {
    const slugs = new Set(ontarioG1SeedCategories.map((category) => category.slug));

    for (const question of ontarioG1SeedQuestions) {
      assert.ok(slugs.has(question.categorySlug), `${question.prompt} has a seeded category`);
      assert.match(question.sourceReference, /^https:\/\/www\.ontario\.ca\/document\/official-mto-drivers-handbook\//);
    }
  });

  it("keeps each multiple-choice question usable for learner practice", () => {
    for (const question of ontarioG1SeedQuestions) {
      assert.ok(question.prompt.length >= 20, `${question.prompt} has a meaningful prompt`);
      assert.ok(question.explanation.length >= 40, `${question.prompt} has a meaningful explanation`);
      assert.equal(question.choices.length, 4, `${question.prompt} has four answer choices`);
      assert.equal(question.choices.filter((choice) => choice.isCorrect).length, 1, `${question.prompt} has exactly one correct answer`);
      assert.equal(new Set(question.choices.map((choice) => choice.text)).size, question.choices.length, `${question.prompt} has unique choices`);
    }
  });
});
