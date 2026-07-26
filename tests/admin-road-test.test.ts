import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getAdminRoadTestReturnTo,
  getRoadTestChecklistSectionOptions,
  getRoadTestStageOptions,
  parseRoadTestChecklistForm,
} from "../src/lib/admin/road-test";

describe("admin road-test checklist helpers", () => {
  it("normalizes checklist form values for create and edit", () => {
    const formData = new FormData();
    formData.set("stage", "G");
    formData.set("section", "DURING_TEST");
    formData.set("title", "  Check mirrors before merging  ");
    formData.set("description", "  Signal, check mirrors, shoulder-check, then merge into a safe gap.  ");
    formData.set("categoryId", "cat_123");
    formData.set("sortOrder", "42");
    formData.set("isActive", "on");

    assert.deepEqual(parseRoadTestChecklistForm(formData), {
      stage: "G",
      section: "DURING_TEST",
      title: "Check mirrors before merging",
      description: "Signal, check mirrors, shoulder-check, then merge into a safe gap.",
      categoryId: "cat_123",
      sortOrder: 42,
      isActive: true,
    });
  });

  it("allows blank optional fields and inactive checklist items", () => {
    const formData = new FormData();
    formData.set("stage", "G2");
    formData.set("section", "SELF_ASSESSMENT");
    formData.set("title", "Pass three mock routes");
    formData.set("description", "");
    formData.set("categoryId", "");
    formData.set("sortOrder", "");

    const parsed = parseRoadTestChecklistForm(formData);

    assert.equal(parsed.description, null);
    assert.equal(parsed.categoryId, null);
    assert.equal(parsed.sortOrder, 0);
    assert.equal(parsed.isActive, false);
  });

  it("rejects invalid stage, section, and missing title", () => {
    const formData = new FormData();
    formData.set("stage", "G1");
    formData.set("section", "BEFORE_TEST");
    formData.set("title", "Ready check");
    assert.throws(() => parseRoadTestChecklistForm(formData), /Choose G2 or Full G/);

    formData.set("stage", "G2");
    formData.set("section", "WRONG");
    assert.throws(() => parseRoadTestChecklistForm(formData), /Choose a valid checklist section/);

    formData.set("section", "BEFORE_TEST");
    formData.set("title", " ");
    assert.throws(() => parseRoadTestChecklistForm(formData), /Enter a checklist title/);
  });

  it("exposes stable stage and section options for the form", () => {
    assert.deepEqual(getRoadTestStageOptions().map((option) => option.value), ["G2", "G"]);
    assert.deepEqual(getRoadTestChecklistSectionOptions().map((option) => option.value), [
      "BEFORE_TEST",
      "DURING_TEST",
      "COMMON_FAIL_REASONS",
      "SELF_ASSESSMENT",
    ]);
  });

  it("keeps admin road-test redirects local to the module", () => {
    assert.equal(getAdminRoadTestReturnTo("/admin/road-test?stage=G2"), "/admin/road-test?stage=G2");
    assert.equal(getAdminRoadTestReturnTo("/admin/questions"), "/admin/road-test");
    assert.equal(getAdminRoadTestReturnTo("https://example.com/admin/road-test"), "/admin/road-test");
  });
});
