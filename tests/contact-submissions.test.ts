import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildContactSubmissionSummary,
  parseContactSubmissionForm,
} from "../src/lib/contact-submissions";

describe("contact submission helpers", () => {
  it("normalizes verified-user contact form values", () => {
    const formData = new FormData();
    formData.set("subject", "  Question about G1 progress  ");
    formData.set("message", "  I want help understanding which weak areas to study next.  ");

    assert.deepEqual(parseContactSubmissionForm(formData), {
      subject: "Question about G1 progress",
      message: "I want help understanding which weak areas to study next.",
    });
  });

  it("rejects missing, too-short, or oversized submissions", () => {
    const formData = new FormData();

    assert.throws(() => parseContactSubmissionForm(formData), /Enter a subject|Enter a message/);

    formData.set("subject", "Hi");
    formData.set("message", "short");
    assert.throws(() => parseContactSubmissionForm(formData), /Subject must be at least|Message must be at least/);

    formData.set("subject", "x".repeat(121));
    formData.set("message", "x".repeat(3001));
    assert.throws(() => parseContactSubmissionForm(formData), /Subject must be 120 characters or less|Message must be 3000 characters or less/);
  });

  it("summarizes open and resolved admin queues", () => {
    const now = new Date("2026-07-25T10:00:00Z");
    const submissions = [
      { resolvedAt: null, createdAt: new Date("2026-07-25T09:00:00Z") },
      { resolvedAt: now, createdAt: new Date("2026-07-24T09:00:00Z") },
      { resolvedAt: null, createdAt: new Date("2026-07-23T09:00:00Z") },
    ];

    assert.deepEqual(buildContactSubmissionSummary(submissions), {
      totalCount: 3,
      openCount: 2,
      resolvedCount: 1,
      latestCreatedAt: new Date("2026-07-25T09:00:00Z"),
    });
  });

  it("handles an empty contact queue", () => {
    assert.deepEqual(buildContactSubmissionSummary([]), {
      totalCount: 0,
      openCount: 0,
      resolvedCount: 0,
      latestCreatedAt: null,
    });
  });
});
