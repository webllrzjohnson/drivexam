import { z } from "zod";
import type { ContentStatus, LicenseStage } from "@prisma/client";

export const lessonStageOptions = [
  { value: "G1", label: "G1" },
  { value: "G2", label: "G2" },
  { value: "G", label: "Full G" },
] as const;

export const lessonStatusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

const lessonFormSchema = z.object({
  title: z.string().trim().min(1, "Enter a lesson title."),
  slug: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  body: z.string().trim().min(1, "Enter lesson content."),
  stage: z.enum(["G1", "G2", "G"], { error: "Choose a valid licence stage." }),
  categoryId: z.string().trim().optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"], { error: "Choose a valid status." }),
  sortOrder: z.coerce.number().int().default(0),
});

export type ParsedLessonForm = {
  title: string;
  slug: string;
  summary: string | null;
  body: string;
  stage: LicenseStage;
  categoryId: string | null;
  status: ContentStatus;
  sortOrder: number;
};

export function getLessonStageOptions() {
  return [...lessonStageOptions];
}

export function getLessonStatusOptions() {
  return [...lessonStatusOptions];
}

export function slugifyLessonTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseLessonForm(formData: FormData): ParsedLessonForm {
  const parsed = lessonFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    summary: formData.get("summary") || undefined,
    body: formData.get("body"),
    stage: formData.get("stage") || "G1",
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status") || "DRAFT",
    sortOrder: formData.get("sortOrder") || 0,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Check the lesson form.");
  }

  const slug = slugifyLessonTitle(parsed.data.slug || parsed.data.title);
  if (!slug) throw new Error("Enter a lesson title or slug.");

  return {
    title: parsed.data.title,
    slug,
    summary: parsed.data.summary || null,
    body: parsed.data.body,
    stage: parsed.data.stage,
    categoryId: parsed.data.categoryId || null,
    status: parsed.data.status,
    sortOrder: parsed.data.sortOrder,
  };
}

export function getAdminLessonsReturnTo(value: FormDataEntryValue | null) {
  const fallback = "/admin/lessons";
  const candidate = String(value ?? "");
  if (!candidate.startsWith("/admin/lessons")) return fallback;
  if (candidate.startsWith("//")) return fallback;
  return candidate;
}
