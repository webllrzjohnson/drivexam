import type { LicenseStage, RoadTestChecklistSection } from "@prisma/client";

export type RoadTestChecklistInput = {
  id: string;
  stage: LicenseStage;
  section: RoadTestChecklistSection;
  title: string;
  description: string | null;
  sortOrder: number;
  isActive?: boolean;
  category: { name: string } | null;
};

export type RoadTestChecklistViewItem = {
  id: string;
  title: string;
  description: string;
  categoryName: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type RoadTestChecklistSectionView = {
  section: RoadTestChecklistSection;
  title: string;
  description: string;
  emptyState: string;
  items: RoadTestChecklistViewItem[];
};

export type RoadTestStageGuide = {
  title: string;
  description: string;
  summaryLabel: string;
  readinessTarget: string;
  formatNotice: string | null;
  formatSourceUrl: string | null;
};

export const roadTestStageOptions = [
  { value: "G2", label: "G2" },
  { value: "G", label: "Full G" },
] as const;

export const roadTestSectionOrder: RoadTestChecklistSection[] = ["BEFORE_TEST", "DURING_TEST", "COMMON_FAIL_REASONS", "SELF_ASSESSMENT"];

export const roadTestSectionLabels: Record<RoadTestChecklistSection, string> = {
  BEFORE_TEST: "Before the test",
  DURING_TEST: "During the test",
  COMMON_FAIL_REASONS: "Common fail reasons",
  SELF_ASSESSMENT: "Self-assessment",
};

const roadTestSectionDescriptions: Record<RoadTestChecklistSection, string> = {
  BEFORE_TEST: "Use these items to decide if you are ready before booking or showing up.",
  DURING_TEST: "Focus on the habits the examiner should clearly see while you drive.",
  COMMON_FAIL_REASONS: "Avoid these unsafe decisions and test-day mistakes.",
  SELF_ASSESSMENT: "Use these checks after practice drives to decide what still needs work.",
};

const roadTestStageCopy: Record<Exclude<LicenseStage, "G1">, Omit<RoadTestStageGuide, "summaryLabel">> = {
  G2: {
    title: "G2 road-test checklist",
    description: "Prep for turns, parking, observation, right-of-way, speed control, and calm basic road-test decisions.",
    readinessTarget: "Aim for three clean mock routes before booking",
    formatNotice: null,
    formatSourceUrl: null,
  },
  G: {
    title: "Full G road-test checklist",
    description: "Prep for highway merging, exiting, lane changes, city traffic, spacing, and confident route decisions.",
    readinessTarget: "Aim for confident city and highway consistency",
    formatNotice: "Ontario's current shortened G test currently excludes parallel parking, roadside stops, three-point turns, and residential-neighbourhood driving until further notice. Those skills remain useful practice, but the current test emphasizes major roads, expressways, intersections, lane changes, turns, curves, and business areas.",
    formatSourceUrl: "https://www.ontario.ca/document/official-mto-drivers-handbook/level-two-road-test",
  },
};

export function getRoadTestStage(value?: string): Exclude<LicenseStage, "G1"> {
  return value === "G" ? "G" : "G2";
}

export function buildRoadTestStageGuide({ stage, checklistCount }: { stage: Exclude<LicenseStage, "G1">; checklistCount: number }): RoadTestStageGuide {
  const copy = roadTestStageCopy[stage];
  return {
    ...copy,
    summaryLabel: checklistCount > 0 ? `${checklistCount} checklist items ready` : `No ${stage === "G" ? "Full G" : "G2"} checklist items yet`,
  };
}

export function splitRoadTestChecklistDescription(description: string): { guidance: string; sourceUrl: string | null } {
  const sourceMatch = description.match(/\s*Source:\s*(https?:\/\/\S+)\s*$/i);
  if (!sourceMatch) return { guidance: description.trim(), sourceUrl: null };

  return {
    guidance: description.slice(0, sourceMatch.index).trim(),
    sourceUrl: sourceMatch[1].split("#")[0],
  };
}

export function groupRoadTestChecklistItems(items: RoadTestChecklistInput[]): RoadTestChecklistSectionView[] {
  const itemsBySection = new Map<RoadTestChecklistSection, RoadTestChecklistViewItem[]>();

  for (const item of items) {
    const sectionItems = itemsBySection.get(item.section) ?? [];
    sectionItems.push({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      categoryName: item.category?.name ?? null,
      sortOrder: item.sortOrder,
      isActive: item.isActive ?? true,
    });
    itemsBySection.set(item.section, sectionItems);
  }

  return roadTestSectionOrder.map((section) => ({
    section,
    title: roadTestSectionLabels[section],
    description: roadTestSectionDescriptions[section],
    emptyState: `Seed or add checklist items for ${roadTestSectionLabels[section].toLowerCase()}.`,
    items: (itemsBySection.get(section) ?? []).sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title)),
  }));
}
