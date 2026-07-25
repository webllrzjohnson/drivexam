import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeLearnerProfileForm } from "../src/lib/learner/profile";

describe("learner profile settings helpers", () => {
  it("normalizes stage and target test date form values", () => {
    const formData = new FormData();
    formData.set("currentStage", "G2");
    formData.set("targetTestDate", "2026-08-15");

    assert.deepEqual(normalizeLearnerProfileForm(formData), {
      ok: true,
      data: {
        currentStage: "G2",
        targetTestDate: new Date("2026-08-15T00:00:00.000Z"),
      },
    });
  });

  it("allows clearing an optional target test date", () => {
    const formData = new FormData();
    formData.set("currentStage", "G1");
    formData.set("targetTestDate", "");

    assert.deepEqual(normalizeLearnerProfileForm(formData), {
      ok: true,
      data: {
        currentStage: "G1",
        targetTestDate: null,
      },
    });
  });

  it("rejects invalid stage and malformed target dates", () => {
    const badStage = new FormData();
    badStage.set("currentStage", "M1");
    badStage.set("targetTestDate", "2026-08-15");
    assert.deepEqual(normalizeLearnerProfileForm(badStage), { ok: false, error: "Choose a valid licence stage." });

    const badDate = new FormData();
    badDate.set("currentStage", "G");
    badDate.set("targetTestDate", "15/08/2026");
    assert.deepEqual(normalizeLearnerProfileForm(badDate), { ok: false, error: "Use a valid target test date." });
  });
});
