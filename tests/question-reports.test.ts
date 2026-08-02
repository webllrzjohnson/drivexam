import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildQuestionReportSummary,
  getQuestionReportReasonOptions,
  getSafeQuestionReportReturnTo,
  parseQuestionReportForm,
} from "../src/lib/question-reports";

describe("question report helpers", () => {
  it("exposes learner-friendly reason options in stable order", () => {
    assert.deepEqual(getQuestionReportReasonOptions().map((option) => option.value), [
      "INCORRECT_ANSWER",
      "CONFUSING_EXPLANATION",
      "TYPO_GRAMMAR",
      "OUTDATED_RULE",
      "IMAGE_SIGN_ISSUE",
      "OTHER",
    ]);
    assert.equal(getQuestionReportReasonOptions()[0].label, "Incorrect answer");
  });

  it("keeps reports on recognized learner quiz routes", () => {
    assert.equal(getSafeQuestionReportReturnTo("/practice?stage=G1"), "/practice?stage=G1");
    assert.equal(getSafeQuestionReportReturnTo("/g1-mock-exam?attempt=42"), "/g1-mock-exam?attempt=42");
    assert.equal(getSafeQuestionReportReturnTo("/g1-mock-exam-evil"), "/practice");
    assert.equal(getSafeQuestionReportReturnTo("https://example.com/g1-mock-exam"), "/practice");
  });

  it("normalizes report form values", () => {
    const formData = new FormData();
    formData.set("questionId", " q_123 ");
    formData.set("reason", "CONFUSING_EXPLANATION");
    formData.set("comment", " Explanation needs a clearer handbook reference. ");
    formData.set("reporterEmail", " DRIVER@Example.COM ");

    assert.deepEqual(parseQuestionReportForm(formData), {
      questionId: "q_123",
      reason: "CONFUSING_EXPLANATION",
      comment: "Explanation needs a clearer handbook reference.",
      reporterEmail: "driver@example.com",
    });
  });

  it("rejects missing question, invalid reason, and short comments for other reports", () => {
    const formData = new FormData();
    formData.set("reason", "OTHER");
    formData.set("comment", "bad");

    assert.throws(() => parseQuestionReportForm(formData), /Choose a question/);

    formData.set("questionId", "q_123");
    formData.set("reason", "NOT_REAL");
    assert.throws(() => parseQuestionReportForm(formData), /Choose a valid report reason/);

    formData.set("reason", "OTHER");
    assert.throws(() => parseQuestionReportForm(formData), /Add a short comment/);
  });

  it("summarizes open and resolved admin report queues", () => {
    const now = new Date("2026-07-24T12:00:00Z");
    const summary = buildQuestionReportSummary([
      { id: "r1", reason: "INCORRECT_ANSWER", resolvedAt: null, createdAt: now },
      { id: "r2", reason: "INCORRECT_ANSWER", resolvedAt: now, createdAt: now },
      { id: "r3", reason: "TYPO_GRAMMAR", resolvedAt: null, createdAt: now },
    ]);

    assert.equal(summary.openCount, 2);
    assert.equal(summary.resolvedCount, 1);
    assert.deepEqual(summary.reasonCounts, [
      { reason: "INCORRECT_ANSWER", label: "Incorrect answer", count: 2 },
      { reason: "TYPO_GRAMMAR", label: "Typo / grammar", count: 1 },
    ]);
  });
});
