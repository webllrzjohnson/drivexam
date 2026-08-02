import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildMockDriveAssessment,
  buildRoadTestAssessmentProgressSummary,
  doesSavedMockDriveAssessmentMatchSubmission,
  getMockDriveCriteria,
  normalizeMockDriveAssessmentSubmission,
} from "../src/lib/learner/road-test-assessment";

describe("mock-drive assessment", () => {
  it("uses examiner-visible core habits and stage-specific tasks", () => {
    const g2Criteria = getMockDriveCriteria("G2");
    const gCriteria = getMockDriveCriteria("G");

    assert.equal(g2Criteria.length, 10);
    assert.equal(gCriteria.length, 10);
    assert.deepEqual(
      g2Criteria.slice(0, 8).map((criterion) => criterion.id),
      gCriteria.slice(0, 8).map((criterion) => criterion.id),
    );
    assert.ok(g2Criteria.some((criterion) => /parking/i.test(criterion.label)));
    assert.ok(gCriteria.some((criterion) => /freeway|merge|exit/i.test(criterion.label)));
    assert.ok(gCriteria.some((criterion) => /lane change/i.test(criterion.label)));
  });

  it("marks a consistently safe drive ready", () => {
    const criteria = getMockDriveCriteria("G");
    const result = buildMockDriveAssessment({
      stage: "G",
      ratings: Object.fromEntries(criteria.map((criterion) => [criterion.id, 2])),
      criticalErrorCount: 0,
    });

    assert.equal(result.percent, 100);
    assert.equal(result.verdict, "READY");
    assert.equal(result.priorities.length, 0);
    assert.equal(result.unratedCount, 0);
  });

  it("never marks a drive ready when a critical safety error occurred", () => {
    const criteria = getMockDriveCriteria("G2");
    const result = buildMockDriveAssessment({
      stage: "G2",
      ratings: Object.fromEntries(criteria.map((criterion) => [criterion.id, 2])),
      criticalErrorCount: 1,
    });

    assert.equal(result.percent, 100);
    assert.equal(result.verdict, "NEEDS_PRACTICE");
    assert.match(result.summary, /critical safety error/i);
  });

  it("never marks a drive ready when any safety habit is completely missed", () => {
    const criteria = getMockDriveCriteria("G");
    const ratings = Object.fromEntries(criteria.map((criterion) => [criterion.id, 2]));
    ratings[criteria[0].id] = 0;

    const result = buildMockDriveAssessment({ stage: "G", ratings, criticalErrorCount: 0 });

    assert.equal(result.percent, 90);
    assert.equal(result.verdict, "NEEDS_PRACTICE");
    assert.match(result.summary, /completely missed/i);
  });

  it("returns the three weakest rated habits as priorities", () => {
    const criteria = getMockDriveCriteria("G");
    const ratings = Object.fromEntries(criteria.map((criterion) => [criterion.id, 2]));
    ratings[criteria[1].id] = 0;
    ratings[criteria[4].id] = 1;
    ratings[criteria[8].id] = 0;
    ratings[criteria[9].id] = 1;

    const result = buildMockDriveAssessment({ stage: "G", ratings, criticalErrorCount: 0 });

    assert.equal(result.verdict, "NEEDS_PRACTICE");
    assert.deepEqual(result.priorities.map((priority) => priority.id), [criteria[1].id, criteria[8].id, criteria[4].id]);
  });

  it("reports incomplete assessments without treating missing ratings as safe", () => {
    const result = buildMockDriveAssessment({
      stage: "G2",
      ratings: { "mirror-checks": 2 },
      criticalErrorCount: 0,
    });

    assert.equal(result.verdict, "INCOMPLETE");
    assert.equal(result.unratedCount, 9);
    assert.match(result.summary, /rate all 10 habits/i);
  });

  it("normalizes a complete saved assessment and recomputes its result", () => {
    const ratings = Object.fromEntries(getMockDriveCriteria("G2").map((criterion) => [criterion.id, 2]));
    const formData = new FormData();
    formData.set("stage", "G2");
    formData.set("ratings", JSON.stringify(ratings));
    formData.set("criticalErrorCount", "1");
    formData.set("clientAssessmentId", "4d03d66a-7fb0-4aba-932d-21db9d5e9f19");

    const parsed = normalizeMockDriveAssessmentSubmission(formData);

    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.data.result.percent, 100);
    assert.equal(parsed.data.result.verdict, "NEEDS_PRACTICE");
    assert.equal(parsed.data.criticalErrorCount, 1);
    assert.equal(parsed.data.clientAssessmentId, "4d03d66a-7fb0-4aba-932d-21db9d5e9f19");
  });

  it("rejects non-canonical critical error counts from tampered submissions", () => {
    const ratings = Object.fromEntries(getMockDriveCriteria("G").map((criterion) => [criterion.id, 2]));
    const formData = new FormData();
    formData.set("stage", "G");
    formData.set("ratings", JSON.stringify(ratings));
    formData.set("criticalErrorCount", "1e0");
    formData.set("clientAssessmentId", "4d03d66a-7fb0-4aba-932d-21db9d5e9f19");

    assert.deepEqual(normalizeMockDriveAssessmentSubmission(formData), {
      ok: false,
      error: "Choose a valid critical safety error count.",
    });
  });

  it("rejects a saved assessment without a valid idempotency identifier", () => {
    const ratings = Object.fromEntries(getMockDriveCriteria("G2").map((criterion) => [criterion.id, 2]));
    const formData = new FormData();
    formData.set("stage", "G2");
    formData.set("ratings", JSON.stringify(ratings));
    formData.set("criticalErrorCount", "0");

    assert.deepEqual(normalizeMockDriveAssessmentSubmission(formData), {
      ok: false,
      error: "Start a new mock-drive assessment before saving.",
    });
  });

  it("accepts exact idempotent replays and rejects conflicting identifier reuse", () => {
    const ratings = Object.fromEntries(getMockDriveCriteria("G2").map((criterion) => [criterion.id, 2]));
    const formData = new FormData();
    formData.set("stage", "G2");
    formData.set("ratings", JSON.stringify(ratings));
    formData.set("criticalErrorCount", "0");
    formData.set("clientAssessmentId", "4d03d66a-7fb0-4aba-932d-21db9d5e9f19");
    const parsed = normalizeMockDriveAssessmentSubmission(formData);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;

    const existing = {
      stage: "G2" as const,
      percent: 100,
      verdict: "READY" as const,
      criticalErrorCount: 0,
      ratings,
      priorityIds: [],
    };
    assert.equal(doesSavedMockDriveAssessmentMatchSubmission(existing, parsed.data), true);
    assert.equal(doesSavedMockDriveAssessmentMatchSubmission({ ...existing, stage: "G" }, parsed.data), false);
    assert.equal(doesSavedMockDriveAssessmentMatchSubmission({ ...existing, ratings: { ...ratings, "mirror-checks": 1 } }, parsed.data), false);
  });

  it("summarizes the latest saved drive and its score trend", () => {
    const summary = buildRoadTestAssessmentProgressSummary({
      stage: "G2",
      assessments: [
        { id: "older", stage: "G2", percent: 70, verdict: "NEEDS_PRACTICE", criticalErrorCount: 0, createdAt: new Date("2026-08-01T10:00:00Z") },
        { id: "latest", stage: "G2", percent: 85, verdict: "READY", criticalErrorCount: 0, createdAt: new Date("2026-08-02T10:00:00Z") },
        { id: "other-stage", stage: "G", percent: 100, verdict: "READY", criticalErrorCount: 0, createdAt: new Date("2026-08-03T10:00:00Z") },
      ],
    });

    assert.equal(summary.assessmentCount, 2);
    assert.equal(summary.latestPercent, 85);
    assert.equal(summary.bestPercent, 85);
    assert.equal(summary.trendPoints, 15);
    assert.match(summary.nextAction, /different route/i);
  });

  it("uses authoritative aggregates without unbounding recent trend history", () => {
    const summary = buildRoadTestAssessmentProgressSummary({
      stage: "G",
      assessments: [
        { id: "previous", stage: "G", percent: 70, verdict: "NEEDS_PRACTICE", criticalErrorCount: 0, createdAt: new Date("2026-08-01T10:00:00Z") },
        { id: "latest", stage: "G", percent: 80, verdict: "NEARLY_READY", criticalErrorCount: 0, createdAt: new Date("2026-08-02T10:00:00Z") },
      ],
      assessmentCount: 24,
      bestPercent: 100,
    });

    assert.equal(summary.assessmentCount, 24);
    assert.equal(summary.bestPercent, 100);
    assert.equal(summary.latestPercent, 80);
    assert.equal(summary.trendPoints, 10);
  });
});
