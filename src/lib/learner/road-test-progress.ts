import type { LicenseStage, RoadTestChecklistSection } from "@prisma/client";

import { roadTestSectionLabels } from "@/lib/learner/road-test";

export type RoadTestChecklistProgressInput = {
  id: string;
  stage: Extract<LicenseStage, "G2" | "G">;
  section: RoadTestChecklistSection;
  title: string;
  isCompleted: boolean;
};

export type RoadTestChecklistProgressSection = {
  section: RoadTestChecklistSection;
  title: string;
  completedCount: number;
  totalCount: number;
  percent: number;
};

export type RoadTestChecklistProgressSummary = {
  stage: Extract<LicenseStage, "G2" | "G">;
  completedCount: number;
  totalCount: number;
  percent: number;
  nextAction: string;
  sections: RoadTestChecklistProgressSection[];
};

const sectionOrder: RoadTestChecklistSection[] = ["BEFORE_TEST", "DURING_TEST", "COMMON_FAIL_REASONS", "SELF_ASSESSMENT"];

function percent(completedCount: number, totalCount: number) {
  return totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
}

export function buildRoadTestChecklistProgressSummary({
  stage,
  items,
}: {
  stage: Extract<LicenseStage, "G2" | "G">;
  items: RoadTestChecklistProgressInput[];
}): RoadTestChecklistProgressSummary {
  const visibleItems = items.filter((item) => item.stage === stage);
  const completedCount = visibleItems.filter((item) => item.isCompleted).length;
  const totalCount = visibleItems.length;
  const nextItem = visibleItems.find((item) => !item.isCompleted);
  const stageLabel = stage === "G" ? "Full G" : "G2";

  return {
    stage,
    completedCount,
    totalCount,
    percent: percent(completedCount, totalCount),
    nextAction: nextItem?.title ?? (totalCount ? `You have completed the ${stageLabel} checklist. Do a calm mock route before test day.` : `Review the ${stageLabel} road-test checklist once items are available.`),
    sections: sectionOrder.map((section) => {
      const sectionItems = visibleItems.filter((item) => item.section === section);
      const sectionCompletedCount = sectionItems.filter((item) => item.isCompleted).length;
      return {
        section,
        title: roadTestSectionLabels[section],
        completedCount: sectionCompletedCount,
        totalCount: sectionItems.length,
        percent: percent(sectionCompletedCount, sectionItems.length),
      };
    }),
  };
}
