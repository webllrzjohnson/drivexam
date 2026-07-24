import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getLessonStageOptions,
  getLessonStatusOptions,
  parseLessonForm,
  slugifyLessonTitle,
} from "../src/lib/admin/lessons";

describe("admin lesson helpers", () => {
  it("creates stable URL slugs from lesson titles", () => {
    assert.equal(slugifyLessonTitle("  G1 Signs & Signals: Part 1!  "), "g1-signs-signals-part-1");
    assert.equal(slugifyLessonTitle("---"), "");
  });

  it("normalizes lesson form data", () => {
    const form = new FormData();
    form.set("title", "  Understanding stop signs  ");
    form.set("slug", "");
    form.set("summary", "  When and where to stop. ");
    form.set("body", "  Stop fully before the line, crosswalk, or intersection. ");
    form.set("stage", "G1");
    form.set("categoryId", "cat_123");
    form.set("status", "IN_REVIEW");
    form.set("sortOrder", "7");

    const parsed = parseLessonForm(form);

    assert.deepEqual(parsed, {
      title: "Understanding stop signs",
      slug: "understanding-stop-signs",
      summary: "When and where to stop.",
      body: "Stop fully before the line, crosswalk, or intersection.",
      stage: "G1",
      categoryId: "cat_123",
      status: "IN_REVIEW",
      sortOrder: 7,
    });
  });

  it("accepts custom slugs and empty optional fields", () => {
    const form = new FormData();
    form.set("title", "Parallel parking basics");
    form.set("slug", "custom-parking-lesson");
    form.set("summary", "");
    form.set("body", "Use mirrors, signal, and check blind spots.");
    form.set("stage", "G2");
    form.set("categoryId", "");
    form.set("status", "DRAFT");
    form.set("sortOrder", "");

    const parsed = parseLessonForm(form);

    assert.equal(parsed.slug, "custom-parking-lesson");
    assert.equal(parsed.summary, null);
    assert.equal(parsed.categoryId, null);
    assert.equal(parsed.sortOrder, 0);
  });

  it("requires title, body, valid stage, valid status, and a usable slug", () => {
    const form = new FormData();
    form.set("title", "");
    form.set("slug", "---");
    form.set("body", "");
    form.set("stage", "BAD");
    form.set("status", "BAD");

    assert.throws(() => parseLessonForm(form), /Enter a lesson title|Enter lesson content|Choose a valid licence stage|Choose a valid status|Enter a lesson title or slug/);
  });

  it("exposes admin options in stable order", () => {
    assert.deepEqual(getLessonStageOptions().map((option) => option.value), ["G1", "G2", "G"]);
    assert.deepEqual(getLessonStatusOptions().map((option) => option.value), ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]);
  });
});
