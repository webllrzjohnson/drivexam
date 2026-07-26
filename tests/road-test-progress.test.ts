import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRoadTestChecklistProgressSummary,
  type RoadTestChecklistProgressInput,
} from "../src/lib/learner/road-test-progress";

const items: RoadTestChecklistProgressInput[] = [
  { id: "before-1", stage: "G2", section: "BEFORE_TEST", title: "Practise observation", isCompleted: true },
  { id: "during-1", stage: "G2", section: "DURING_TEST", title: "Smooth lane changes", isCompleted: false },
  { id: "fail-1", stage: "G2", section: "COMMON_FAIL_REASONS", title: "Avoid rolling stops", isCompleted: true },
  { id: "self-1", stage: "G2", section: "SELF_ASSESSMENT", title: "Pass a mock route", isCompleted: false },
];

describe("road-test checklist progress helpers", () => {
  it("summarizes completed checklist items by stage and section", () => {
    const summary = buildRoadTestChecklistProgressSummary({ stage: "G2", items });

    assert.equal(summary.stage, "G2");
    assert.equal(summary.totalCount, 4);
    assert.equal(summary.completedCount, 2);
    assert.equal(summary.percent, 50);
    assert.equal(summary.nextAction, "Smooth lane changes");
    assert.deepEqual(summary.sections.map((section) => ({ section: section.section, completedCount: section.completedCount, totalCount: section.totalCount })), [
      { section: "BEFORE_TEST", completedCount: 1, totalCount: 1 },
      { section: "DURING_TEST", completedCount: 0, totalCount: 1 },
      { section: "COMMON_FAIL_REASONS", completedCount: 1, totalCount: 1 },
      { section: "SELF_ASSESSMENT", completedCount: 0, totalCount: 1 },
    ]);
  });

  it("uses a practical empty state when there are no active checklist items", () => {
    const summary = buildRoadTestChecklistProgressSummary({ stage: "G", items: [] });

    assert.equal(summary.totalCount, 0);
    assert.equal(summary.completedCount, 0);
    assert.equal(summary.percent, 0);
    assert.equal(summary.nextAction, "Review the Full G road-test checklist once items are available.");
    assert.equal(summary.sections.length, 4);
  });

  it("marks checklist readiness complete when every active item is done", () => {
    const summary = buildRoadTestChecklistProgressSummary({
      stage: "G2",
      items: items.map((item) => ({ ...item, isCompleted: true })),
    });

    assert.equal(summary.percent, 100);
    assert.equal(summary.nextAction, "You have completed the G2 checklist. Do a calm mock route before test day.");
  });
});
