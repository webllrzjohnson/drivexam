import { z } from "zod";
import type { ContentStatus, LicenseStage, QuestionType } from "@prisma/client";

export const questionTypeOptions = [
  { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
  { value: "TRUE_FALSE", label: "True / false" },
  { value: "MULTI_SELECT", label: "Multi-select" },
] as const;

export const questionStageOptions = [
  { value: "G1", label: "G1" },
  { value: "G2", label: "G2" },
  { value: "G", label: "Full G" },
] as const;

export const contentStatusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

const questionFormSchema = z.object({
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "MULTI_SELECT"], { error: "Choose a valid question type." }),
  prompt: z.string().trim().min(1, "Enter a question prompt."),
  explanation: z.string().trim().min(1, "Enter an explanation."),
  stage: z.enum(["G1", "G2", "G"], { error: "Choose a valid licence stage." }),
  categoryId: z.string().trim().optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"], { error: "Choose a valid status." }),
  selectCount: z.coerce.number().int().min(1).optional(),
  sourceReference: z.string().trim().optional(),
});

export type ParsedQuestionForm = {
  question: {
    type: QuestionType;
    prompt: string;
    explanation: string;
    stage: LicenseStage;
    categoryId: string | null;
    status: ContentStatus;
    selectCount: number | null;
    sourceReference: string | null;
  };
  choices: Array<{
    text: string | null;
    assetId: string | null;
    isCorrect: boolean;
    sortOrder: number;
  }>;
  assetIds: string[];
};

export function getQuestionTypeOptions() {
  return [...questionTypeOptions];
}

export function getQuestionStageOptions() {
  return [...questionStageOptions];
}

export function getContentStatusOptions() {
  return [...contentStatusOptions];
}

function compactStrings(values: FormDataEntryValue[]) {
  return values.map(String).map((value) => value.trim()).filter(Boolean);
}

export function parseQuestionForm(formData: FormData): ParsedQuestionForm {
  const parsed = questionFormSchema.safeParse({
    type: formData.get("type") || "MULTIPLE_CHOICE",
    prompt: formData.get("prompt"),
    explanation: formData.get("explanation"),
    stage: formData.get("stage") || "G1",
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status") || "DRAFT",
    selectCount: formData.get("selectCount") || undefined,
    sourceReference: formData.get("sourceReference") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Check the question form.");
  }

  const choiceTexts = formData.getAll("choiceText").map(String);
  const choiceAssetIds = formData.getAll("choiceAssetId").map(String);
  const correctIndexes = new Set(compactStrings(formData.getAll("correctChoice")).map(Number));
  const choices = choiceTexts
    .map((text, index) => ({
      text: text.trim() || null,
      assetId: choiceAssetIds[index]?.trim() || null,
      isCorrect: correctIndexes.has(index),
      sortOrder: index,
    }))
    .filter((choice) => choice.text || choice.assetId);

  if (choices.length < 2) throw new Error("Add at least two answer choices.");
  if (!choices.some((choice) => choice.isCorrect)) throw new Error("Choose one correct answer.");
  if (parsed.data.type !== "MULTI_SELECT" && choices.filter((choice) => choice.isCorrect).length !== 1) {
    throw new Error("Choose one correct answer.");
  }

  return {
    question: {
      type: parsed.data.type,
      prompt: parsed.data.prompt,
      explanation: parsed.data.explanation,
      stage: parsed.data.stage,
      categoryId: parsed.data.categoryId || null,
      status: parsed.data.status,
      selectCount: parsed.data.selectCount ?? choices.filter((choice) => choice.isCorrect).length,
      sourceReference: parsed.data.sourceReference || null,
    },
    choices,
    assetIds: Array.from(new Set(compactStrings(formData.getAll("questionAssetId")))),
  };
}

export function getAdminQuestionsReturnTo(value: FormDataEntryValue | null) {
  const fallback = "/admin/questions";
  const candidate = String(value ?? "");
  if (!candidate.startsWith("/admin/questions")) return fallback;
  if (candidate.startsWith("//")) return fallback;
  return candidate;
}
