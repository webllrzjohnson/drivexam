import { z } from "zod";
import type { LicenseStage, RoadTestChecklistSection } from "@prisma/client";

export const roadTestAdminStageOptions = [
  { value: "G2", label: "G2" },
  { value: "G", label: "Full G" },
] as const;

export const roadTestChecklistSectionOptions = [
  { value: "BEFORE_TEST", label: "Before test" },
  { value: "DURING_TEST", label: "During test" },
  { value: "COMMON_FAIL_REASONS", label: "Common fail reasons" },
  { value: "SELF_ASSESSMENT", label: "Self-assessment" },
] as const;

const roadTestChecklistFormSchema = z.object({
  stage: z.enum(["G2", "G"], { error: "Choose G2 or Full G." }),
  section: z.enum(["BEFORE_TEST", "DURING_TEST", "COMMON_FAIL_REASONS", "SELF_ASSESSMENT"], { error: "Choose a valid checklist section." }),
  title: z.string().trim().min(1, "Enter a checklist title."),
  description: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean(),
});

export type ParsedRoadTestChecklistForm = {
  stage: Exclude<LicenseStage, "G1">;
  section: RoadTestChecklistSection;
  title: string;
  description: string | null;
  categoryId: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function getRoadTestStageOptions() {
  return [...roadTestAdminStageOptions];
}

export function getRoadTestChecklistSectionOptions() {
  return [...roadTestChecklistSectionOptions];
}

export function parseRoadTestChecklistForm(formData: FormData): ParsedRoadTestChecklistForm {
  const parsed = roadTestChecklistFormSchema.safeParse({
    stage: formData.get("stage") || "G2",
    section: formData.get("section") || "BEFORE_TEST",
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Check the road-test checklist form.");
  }

  return {
    stage: parsed.data.stage,
    section: parsed.data.section,
    title: parsed.data.title,
    description: parsed.data.description?.trim() || null,
    categoryId: parsed.data.categoryId || null,
    sortOrder: parsed.data.sortOrder,
    isActive: parsed.data.isActive,
  };
}

export function getAdminRoadTestReturnTo(value: FormDataEntryValue | string | null) {
  const fallback = "/admin/road-test";
  const candidate = String(value ?? "");
  if (!candidate.startsWith("/admin/road-test")) return fallback;
  if (candidate.startsWith("//")) return fallback;
  return candidate;
}
