import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRoadTestStageGuide,
  groupRoadTestChecklistItems,
  roadTestSectionLabels,
  splitRoadTestChecklistDescription,
  type RoadTestChecklistInput,
} from "../src/lib/learner/road-test";

const checklistItems: RoadTestChecklistInput[] = [
  {
    id: "late-exit",
    stage: "G",
    section: "COMMON_FAIL_REASONS",
    title: "Do not make last-second exits",
    description: "Plan exits early instead of cutting across traffic.",
    sortOrder: 30,
    category: { name: "Full G highway merging and exiting" },
  },
  {
    id: "highway-practice",
    stage: "G",
    section: "BEFORE_TEST",
    title: "Practise highway comfort before booking",
    description: "Book only when merging and exiting feel routine.",
    sortOrder: 10,
    category: { name: "Full G road-test readiness" },
  },
  {
    id: "smooth-lane-change",
    stage: "G",
    section: "DURING_TEST",
    title: "Keep lane changes smooth",
    description: "Use mirrors, signal, shoulder check, and a safe gap.",
    sortOrder: 20,
    category: null,
  },
  {
    id: "mock-drive",
    stage: "G",
    section: "SELF_ASSESSMENT",
    title: "Complete three highway mock drives",
    description: "Practise until no safety intervention is needed.",
    sortOrder: 40,
    category: { name: "Full G road-test readiness" },
  },
];

describe("road-test checklist helpers", () => {
  it("builds stage-specific road-test page guidance", () => {
    const g2Guide = buildRoadTestStageGuide({ stage: "G2", checklistCount: 8 });
    const gGuide = buildRoadTestStageGuide({ stage: "G", checklistCount: 8 });

    assert.equal(g2Guide.title, "G2 road-test checklist");
    assert.equal(g2Guide.summaryLabel, "8 checklist items ready");
    assert.match(g2Guide.description, /turns, parking, observation/i);
    assert.equal(g2Guide.formatNotice, null);
    assert.equal(gGuide.title, "Full G road-test checklist");
    assert.match(gGuide.description, /highway/i);
    assert.match(gGuide.formatNotice ?? "", /currently excludes.*parallel parking.*roadside stops.*three-point turns.*residential/i);
    assert.match(gGuide.formatSourceUrl ?? "", /^https:\/\/www\.ontario\.ca\/document\/official-mto-drivers-handbook\/level-two-road-test$/);
  });

  it("groups checklist items in learner-friendly section order", () => {
    const sections = groupRoadTestChecklistItems(checklistItems);

    assert.deepEqual(sections.map((section) => section.section), ["BEFORE_TEST", "DURING_TEST", "COMMON_FAIL_REASONS", "SELF_ASSESSMENT"]);
    assert.deepEqual(sections.map((section) => section.title), [
      roadTestSectionLabels.BEFORE_TEST,
      roadTestSectionLabels.DURING_TEST,
      roadTestSectionLabels.COMMON_FAIL_REASONS,
      roadTestSectionLabels.SELF_ASSESSMENT,
    ]);
    assert.equal(sections[0].items[0].title, "Practise highway comfort before booking");
    assert.equal(sections[2].items[0].categoryName, "Full G highway merging and exiting");
    assert.equal(sections[2].items[0].description, "Plan exits early instead of cutting across traffic.");
  });

  it("keeps empty sections visible with practical fallback text", () => {
    const sections = groupRoadTestChecklistItems([]);

    assert.equal(sections.length, 4);
    assert.ok(sections.every((section) => section.items.length === 0));
    assert.match(sections[0].emptyState, /Seed or add checklist items/i);
  });

  it("separates checklist guidance from its official source link", () => {
    assert.deepEqual(
      splitRoadTestChecklistDescription("Check mirrors before moving.\n\nSource: https://www.ontario.ca/example"),
      {
        guidance: "Check mirrors before moving.",
        sourceUrl: "https://www.ontario.ca/example",
      },
    );
    assert.equal(
      splitRoadTestChecklistDescription("Practise merging.\n\nSource: https://www.ontario.ca/example#stale-section").sourceUrl,
      "https://www.ontario.ca/example",
    );
    assert.deepEqual(splitRoadTestChecklistDescription("Practice this habit."), {
      guidance: "Practice this habit.",
      sourceUrl: null,
    });
  });
});
