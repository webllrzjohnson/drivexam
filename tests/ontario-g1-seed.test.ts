import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

  it("bundles local road-sign assets and attaches them to sign questions", () => {
    assert.ok(ontarioG1RoadSignAssets.length >= 40, "ships a practical Canadian road-sign image bank");
    assert.equal(new Set(ontarioG1RoadSignAssets.map((asset) => asset.slug)).size, ontarioG1RoadSignAssets.length);

    const assetSlugs = new Set(ontarioG1RoadSignAssets.map((asset) => asset.slug));
    for (const asset of ontarioG1RoadSignAssets) {
      assert.match(asset.path, /^\/uploads\/road-signs\/[a-z0-9-]+\.svg$/);
      assert.match(asset.mimeType, /^image\/svg\+xml$/);
      assert.ok(asset.title.length >= 4);
      assert.ok(asset.sourceCredit.includes("Original drivexam SVG recreation"), `${asset.slug} is not copied from a third-party image file`);
      assert.ok(asset.sourceCredit.includes("official Ontario handbook"), `${asset.slug} cites the official Ontario handbook reference`);
      assert.ok(!asset.sourceCredit.includes("Wikimedia Commons"), `${asset.slug} no longer relies on mislabelled Commons art`);

      const svg = readFileSync(join(process.cwd(), "public", asset.path), "utf8");
      assert.match(svg, /Original drivexam SVG recreation/i, `${asset.slug} declares original local SVG provenance`);
      assert.match(svg, /official Ontario handbook/i, `${asset.slug} declares the official handbook inspiration`);
    }

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
});
