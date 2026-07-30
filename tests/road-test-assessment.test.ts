import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildMockDriveAssessment,
  getMockDriveCriteria,
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
});
