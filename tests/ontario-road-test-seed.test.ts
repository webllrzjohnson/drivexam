import assert from "node:assert/strict";
import { statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  ontarioG1SeedQuestions,
} from "../src/lib/seed/ontario-g1-content";
import {
  getOntarioRoadTestSeedSummary,
  ontarioRoadTestChecklistItems,
  ontarioRoadTestIllustrationAssets,
  ontarioRoadTestSeedCategories,
  ontarioRoadTestSeedQuestions,
  retiredOntarioRoadTestChecklistTitles,
  retiredOntarioRoadTestSeedPrompts,
} from "../src/lib/seed/ontario-road-test-content";

describe("Ontario G2/G road-test seed content", () => {
  it("ships a starter road-test batch for G2 and full G learners", () => {
    const summary = getOntarioRoadTestSeedSummary();

    assert.equal(summary.categoryCount, 6);
    assert.equal(summary.questionCount, 80);
    assert.equal(summary.checklistCount, 16);
    assert.equal(summary.sourceCount, 5);
    assert.equal(summary.questionCountsByStage.G2, 40);
    assert.equal(summary.questionCountsByStage.G, 40);
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

  it("ships a broad full-G road-test practice bank across highways, lane flow, and readiness", () => {
    const gQuestions = ontarioRoadTestSeedQuestions.filter((question) => question.stage === "G");
    const gQuestionsByCategory = gQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.categorySlug] = (acc[question.categorySlug] ?? 0) + 1;
      return acc;
    }, {});

    assert.equal(gQuestions.length, 40);
    assert.ok(gQuestionsByCategory["g-highway-merging-and-exiting"] >= 14);
    assert.ok(gQuestionsByCategory["g-advanced-lane-and-traffic-flow"] >= 14);
    assert.ok(gQuestionsByCategory["g-road-test-readiness"] >= 8);
  });

  it("matches Ontario's current shortened G-test format and highway declaration", () => {
    const gQuestions = ontarioRoadTestSeedQuestions.filter((question) => question.stage === "G");
    const content = gQuestions.map((question) => `${question.prompt} ${question.explanation} ${question.choices.map((choice) => choice.text).join(" ")}`).join("\n");
    const gChecklist = ontarioRoadTestChecklistItems.filter((item) => item.stage === "G");

    assert.match(content, /Until further notice|currently excludes/i);
    assert.match(content, /parallel parking/i);
    assert.match(content, /roadside stops/i);
    assert.match(content, /three-point turns|3-point turns/i);
    assert.match(content, /residential neighbourhoods|residential-neighbourhood driving/i);
    assert.match(content, /three months/i);
    assert.match(content, /80 km\/h/i);
    assert.equal(gQuestions.some((question) => question.prompt === "Why does the full-G test include business and residential sections?"), false);
    assert.equal(gQuestions.some((question) => question.prompt === "What does a roadside stop show on the Level Two road test?"), false);
    assert.equal(gQuestions.some((question) => question.prompt === "Why should full-G practice include residential driving after highway practice?"), false);
    assert.ok(gChecklist.some((item) => /current G test format/i.test(`${item.title} ${item.description}`)));
    assert.ok(gChecklist.some((item) => /highway driving experience|three months/i.test(item.description)));
  });

  it("tracks superseded Full G prompts so reseeding removes stale database rows", () => {
    const currentPrompts = new Set(ontarioRoadTestSeedQuestions.map((question) => question.prompt));

    assert.equal(retiredOntarioRoadTestSeedPrompts.length, 5);
    assert.equal(new Set(retiredOntarioRoadTestSeedPrompts).size, retiredOntarioRoadTestSeedPrompts.length);
    assert.equal(retiredOntarioRoadTestSeedPrompts.some((prompt) => currentPrompts.has(prompt)), false);
    assert.deepEqual(retiredOntarioRoadTestChecklistTitles, ["Rehearse merge and exit sequences"]);
    assert.equal(ontarioRoadTestChecklistItems.some((item) => retiredOntarioRoadTestChecklistTitles.includes(item.title)), false);
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

  it("avoids obviously gameable examiner-joke distractors", () => {
    const weakDistractorPattern = /examiner|honks|blind spots are optional|open the door immediately|only empty parking lots|ignore them because you are already parking/i;

    for (const question of ontarioRoadTestSeedQuestions) {
      for (const choice of question.choices.filter((candidate) => !candidate.isCorrect)) {
        assert.doesNotMatch(choice.text, weakDistractorPattern, `${question.stage}: ${question.prompt}`);
      }
    }
  });

  it("ships three production road-test illustrations and attaches them to the matching questions", () => {
    const expectedAttachments = new Map([
      ["When turning left, what should you do before crossing oncoming traffic?", "g2-left-turn-pedestrian-yield"],
      ["What observation habit should be clear during a G2 lane change?", "g2-g-lane-change-blind-spot"],
      ["During a full-G lane change, what should the examiner clearly see?", "g2-g-lane-change-blind-spot"],
      ["What is the G road test looking for when you enter a freeway?", "full-g-highway-merge-safe-gap"],
    ]);

    assert.equal(ontarioRoadTestIllustrationAssets.length, 3);
    assert.deepEqual(new Set(ontarioRoadTestIllustrationAssets.map((asset) => asset.slug)), new Set(expectedAttachments.values()));

    for (const asset of ontarioRoadTestIllustrationAssets) {
      assert.equal(asset.mimeType, "image/png");
      assert.match(asset.path, /^\/uploads\/content-images\/road-test\/[a-z0-9-]+\.png$/);
      assert.match(asset.sourceCredit, /Ontario.*OpenClipart/i);

      const publicFile = path.join(process.cwd(), "public", asset.path.replace(/^\//, ""));
      const fileStat = statSync(publicFile);
      assert.equal(fileStat.size, asset.sizeBytes, `${asset.slug} byte size matches the public PNG`);
      assert.ok(fileStat.size > 100_000, `${asset.slug} is a production-sized illustration`);
    }

    for (const [prompt, assetSlug] of expectedAttachments) {
      const question = ontarioRoadTestSeedQuestions.find((candidate) => candidate.prompt === prompt);
      assert.ok(question, `${prompt} exists`);
      assert.deepEqual(question.assetSlugs, [assetSlug]);
    }
  });
});
