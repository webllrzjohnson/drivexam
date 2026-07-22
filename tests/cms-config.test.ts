import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { adminModules, getAdminModule } from "../src/lib/admin/cms-config";

describe("admin CMS module config", () => {
  it("includes the required Phase 2 CMS modules in navigation order", () => {
    assert.deepEqual(adminModules.map((module) => module.slug), [
      "users",
      "settings",
      "assets",
      "categories",
      "questions",
      "lessons",
      "road-test",
      "blog",
      "pages",
      "faq",
      "reports",
      "contact",
    ]);
  });

  it("looks up a module by slug", () => {
    assert.equal(getAdminModule("questions")?.title, "Questions");
    assert.equal(getAdminModule("missing"), undefined);
  });
});
