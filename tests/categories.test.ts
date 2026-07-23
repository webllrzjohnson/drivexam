import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getCategoryStageOptions,
  parseCategoryForm,
  slugifyCategoryName,
} from "../src/lib/admin/categories";

describe("admin category helpers", () => {
  it("creates stable URL slugs from category names", () => {
    assert.equal(slugifyCategoryName("  Road Signs & Signals!  "), "road-signs-signals");
    assert.equal(slugifyCategoryName("G1: Right-of-Way"), "g1-right-of-way");
  });

  it("normalizes category form data", () => {
    const formData = new FormData();
    formData.set("name", " Road Signs ");
    formData.set("slug", " ");
    formData.set("description", " Signs and signals for Ontario drivers. ");
    formData.set("stage", "G1");
    formData.set("sortOrder", "10");
    formData.set("isActive", "on");

    assert.deepEqual(parseCategoryForm(formData), {
      name: "Road Signs",
      slug: "road-signs",
      description: "Signs and signals for Ontario drivers.",
      stage: "G1",
      sortOrder: 10,
      isActive: true,
    });
  });

  it("allows all-stage categories", () => {
    const formData = new FormData();
    formData.set("name", "Safe Driving");
    formData.set("stage", "ALL");
    formData.set("sortOrder", "");

    assert.deepEqual(parseCategoryForm(formData), {
      name: "Safe Driving",
      slug: "safe-driving",
      description: null,
      stage: null,
      sortOrder: 0,
      isActive: false,
    });
  });

  it("rejects invalid stage values and missing names", () => {
    const formData = new FormData();
    formData.set("name", "");
    formData.set("stage", "M1");

    assert.throws(() => parseCategoryForm(formData), /name/i);

    formData.set("name", "Motorcycle rules");
    assert.throws(() => parseCategoryForm(formData), /valid licence stage/i);
  });

  it("exposes stage options in admin order", () => {
    assert.deepEqual(getCategoryStageOptions().map((option) => option.value), ["ALL", "G1", "G2", "G"]);
  });
});
