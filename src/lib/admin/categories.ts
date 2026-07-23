import { z } from "zod";
import type { LicenseStage } from "@prisma/client";

export const categoryStageOptions = [
  { value: "ALL", label: "All stages" },
  { value: "G1", label: "G1" },
  { value: "G2", label: "G2" },
  { value: "G", label: "Full G" },
] as const;

const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a category name."),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  stage: z.enum(["ALL", "G1", "G2", "G"], { error: "Choose a valid licence stage." }),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean(),
});

export type ParsedCategoryForm = {
  name: string;
  slug: string;
  description: string | null;
  stage: LicenseStage | null;
  sortOrder: number;
  isActive: boolean;
};

export function getCategoryStageOptions() {
  return [...categoryStageOptions];
}

export function slugifyCategoryName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseCategoryForm(formData: FormData): ParsedCategoryForm {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    stage: formData.get("stage") || "ALL",
    sortOrder: formData.get("sortOrder") || 0,
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Check the category form.");
  }

  const slug = slugifyCategoryName(parsed.data.slug || parsed.data.name);
  if (!slug) throw new Error("Enter a category name or slug.");

  return {
    name: parsed.data.name,
    slug,
    description: parsed.data.description?.trim() || null,
    stage: parsed.data.stage === "ALL" ? null : parsed.data.stage,
    sortOrder: parsed.data.sortOrder,
    isActive: parsed.data.isActive,
  };
}

export function getAdminCategoriesReturnTo(value: FormDataEntryValue | null) {
  const fallback = "/admin/categories";
  const candidate = String(value ?? "");
  if (!candidate.startsWith("/admin/categories")) return fallback;
  if (candidate.startsWith("//")) return fallback;
  return candidate;
}
