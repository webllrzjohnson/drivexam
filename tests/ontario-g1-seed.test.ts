import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import {
  getOntarioG1SeedSummary,
  ontarioG1RoadSignAssets,
  ontarioG1SeedCategories,
  ontarioG1SeedQuestions,
} from "../src/lib/seed/ontario-g1-content";

describe("Ontario G1 seed content", () => {
  it("ships an expanded source-backed G1 batch across core handbook topics", () => {
    const summary = getOntarioG1SeedSummary();

    assert.equal(summary.categoryCount, 8);
    assert.equal(summary.questionCount, 68);
    assert.equal(summary.sourceCount, 8);
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

  it("bundles JSON-sourced local road-sign assets and attaches them to sign questions", () => {
    assert.equal(ontarioG1RoadSignAssets.length, 78, "ships the 78-sign bank from Louie's ontario-road-signs JSON folder");
    assert.equal(new Set(ontarioG1RoadSignAssets.map((asset) => asset.slug)).size, ontarioG1RoadSignAssets.length);

    const assetSlugs = new Set(ontarioG1RoadSignAssets.map((asset) => asset.slug));
    for (const asset of ontarioG1RoadSignAssets) {
      assert.match(asset.path, /^\/uploads\/road-signs\/ontario-road-signs\/icons\/[0-9]{2}-[a-z0-9-]+\.png$/);
      assert.match(asset.mimeType, /^image\/png$/);
      assert.ok(asset.title.length >= 4);
      assert.ok(asset.description.length >= 20, `${asset.slug} has learner explanation text from JSON`);
      assert.ok(asset.sourceCredit.includes("Louie's ontario-road-signs JSON and image folder"), `${asset.slug} cites the JSON/image folder source`);
      assert.ok(!asset.sourceCredit.includes("User-uploaded Ontario road signs PDF"), `${asset.slug} no longer cites the PDF extraction source`);
      assert.ok(!asset.sourceCredit.includes("Sign-only crop extracted from uploaded PDF"), `${asset.slug} no longer uses PDF crop extraction`);
      assert.ok(!asset.sourceCredit.includes("Original drivexam SVG recreation"), `${asset.slug} no longer uses generated SVG art`);
      assert.ok(!asset.sourceCredit.includes("Wikimedia Commons"), `${asset.slug} no longer relies on Commons art`);

      assert.ok(existsSync(join(process.cwd(), "public", asset.path)), `${asset.slug} has a local JSON-sourced PNG image`);
    }

    assert.ok(assetSlugs.has("ontario-school-zone-sign"), "includes signs from the PDF warning-sign pages");
    assert.ok(assetSlugs.has("ontario-do-not-block-intersection"), "includes signs from the PDF regulatory pages");
    assert.ok(assetSlugs.has("ontario-road-work-operation-ahead"), "includes signs from the PDF temporary-condition page");
    assert.ok(assetSlugs.has("ontario-route-to-airport"), "includes signs from the PDF information/direction page");

    const signQuestionsWithAssets = ontarioG1SeedQuestions.filter((question) => question.assetSlugs?.length);
    assert.ok(signQuestionsWithAssets.length >= 35, "attaches road-sign images to a meaningful set of G1 sign questions");
    assert.ok(
      signQuestionsWithAssets.filter((question) => /this sign|shown|image/i.test(question.prompt)).length >= 28,
      "includes dedicated image-recognition questions, not only decorative sign attachments",
    );

    for (const question of signQuestionsWithAssets) {
      assert.ok(question.sourceReference.startsWith("https://www.ontario.ca/document/official-mto-drivers-handbook/"));
      for (const slug of question.assetSlugs ?? []) {
        assert.ok(assetSlugs.has(slug), `${question.prompt} references seeded asset ${slug}`);
      }
    }
  });

  it("keeps image-recognition question wording aligned with the attached JSON-backed sign", () => {
    const questionsByAssetSlug = new Map<string, typeof ontarioG1SeedQuestions[number][]>();
    for (const question of ontarioG1SeedQuestions) {
      for (const slug of question.assetSlugs ?? []) {
        questionsByAssetSlug.set(slug, [...(questionsByAssetSlug.get(slug) ?? []), question]);
      }
    }

    const stopAheadQuestions = questionsByAssetSlug.get("ontario-stop-sign-ahead") ?? [];
    assert.ok(stopAheadQuestions.every((question) => !/traffic-signal-ahead|traffic lights are ahead/i.test(`${question.prompt} ${question.explanation}`)));
    assert.ok(stopAheadQuestions.some((question) => /stop sign is coming|stop completely/i.test(`${question.prompt} ${question.explanation}`)));

    const schoolCrossingQuestions = questionsByAssetSlug.get("ontario-a-school-crossing-ahead") ?? [];
    assert.ok(schoolCrossingQuestions.every((question) => /school crossing|children/i.test(`${question.prompt} ${question.explanation}`)));

    const windingRoadQuestions = questionsByAssetSlug.get("ontario-road-ahead-turns-right-then-left") ?? [];
    assert.ok(windingRoadQuestions.every((question) => /right-then-left|right and then left|winding|successive curves/i.test(`${question.prompt} ${question.explanation}`)));
    assert.ok(windingRoadQuestions.every((question) => !/left-curve sign|right-curve sign/i.test(`${question.prompt} ${question.explanation}`)));

    const timedParkingQuestions = questionsByAssetSlug.get("ontario-you-may-park-in-the-designated-area-during-the-posted-times") ?? [];
    assert.ok(timedParkingQuestions.every((question) => /may park|posted times|time limit/i.test(`${question.prompt} ${question.explanation}`)));
    assert.ok(timedParkingQuestions.every((question) => !/no-parking|prohibit/i.test(`${question.prompt} ${question.explanation}`)));

    const noRightOnRedQuestions = questionsByAssetSlug.get("ontario-no-right-turn-on-red") ?? [];
    assert.ok(noRightOnRedQuestions.every((question) => /right turn on red/i.test(`${question.prompt} ${question.explanation}`)));
  });
});
