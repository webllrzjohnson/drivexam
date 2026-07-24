import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getContentStatusOptions,
  getQuestionStageOptions,
  getQuestionTypeOptions,
  parseQuestionForm,
} from "../src/lib/admin/questions";

describe("admin question helpers", () => {
  it("normalizes question fields, choices, and attached assets", () => {
    const form = new FormData();
    form.set("type", "MULTIPLE_CHOICE");
    form.set("prompt", "  What should you do at a red light?  ");
    form.set("explanation", "  Come to a complete stop before the stop line. ");
    form.set("stage", "G1");
    form.set("categoryId", "cat_123");
    form.set("status", "IN_REVIEW");
    form.set("selectCount", "1");
    form.set("sourceReference", "MTO Handbook p. 10");
    form.append("choiceText", "Stop safely");
    form.append("choiceText", "Speed up");
    form.append("choiceText", "Ignore it");
    form.append("choiceAssetId", "");
    form.append("choiceAssetId", "asset_choice");
    form.append("choiceAssetId", "");
    form.set("correctChoice", "0");
    form.append("questionAssetId", "asset_sign");
    form.append("questionAssetId", "asset_sign");

    const parsed = parseQuestionForm(form);

    assert.equal(parsed.question.type, "MULTIPLE_CHOICE");
    assert.equal(parsed.question.prompt, "What should you do at a red light?");
    assert.equal(parsed.question.explanation, "Come to a complete stop before the stop line.");
    assert.equal(parsed.question.stage, "G1");
    assert.equal(parsed.question.categoryId, "cat_123");
    assert.equal(parsed.question.status, "IN_REVIEW");
    assert.equal(parsed.question.selectCount, 1);
    assert.equal(parsed.question.sourceReference, "MTO Handbook p. 10");
    assert.deepEqual(parsed.choices, [
      { text: "Stop safely", assetId: null, isCorrect: true, sortOrder: 0 },
      { text: "Speed up", assetId: "asset_choice", isCorrect: false, sortOrder: 1 },
      { text: "Ignore it", assetId: null, isCorrect: false, sortOrder: 2 },
    ]);
    assert.deepEqual(parsed.assetIds, ["asset_sign"]);
  });

  it("requires prompt, explanation, valid stage/status/type, two choices, and one correct answer", () => {
    const form = new FormData();
    form.set("type", "BAD");
    form.set("prompt", "");
    form.set("explanation", "");
    form.set("stage", "BAD");
    form.set("status", "BAD");
    form.append("choiceText", "Only one");

    assert.throws(() => parseQuestionForm(form), /Choose a valid question type|Enter a question prompt|Enter an explanation|Choose a valid licence stage|Choose a valid status|Add at least two answer choices|Choose one correct answer/);
  });

  it("supports multi-select questions with multiple correct choices", () => {
    const form = new FormData();
    form.set("type", "MULTI_SELECT");
    form.set("prompt", "Which actions are safe?");
    form.set("explanation", "Both checking mirrors and signalling are safe habits.");
    form.set("stage", "G2");
    form.set("status", "DRAFT");
    form.set("selectCount", "2");
    form.append("choiceText", "Check mirrors");
    form.append("choiceText", "Signal early");
    form.append("choiceText", "Tailgate");
    form.append("correctChoice", "0");
    form.append("correctChoice", "1");

    const parsed = parseQuestionForm(form);

    assert.equal(parsed.question.type, "MULTI_SELECT");
    assert.equal(parsed.question.selectCount, 2);
    assert.deepEqual(parsed.choices.map((choice) => choice.isCorrect), [true, true, false]);
  });

  it("exposes admin options in stable order", () => {
    assert.deepEqual(getQuestionTypeOptions().map((option) => option.value), ["MULTIPLE_CHOICE", "TRUE_FALSE", "MULTI_SELECT"]);
    assert.deepEqual(getQuestionStageOptions().map((option) => option.value), ["G1", "G2", "G"]);
    assert.deepEqual(getContentStatusOptions().map((option) => option.value), ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]);
  });
});
