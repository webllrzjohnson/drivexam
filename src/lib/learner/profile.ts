import type { LicenseStage } from "@prisma/client";

export type LearnerProfileFormResult =
  | { ok: true; data: { currentStage: LicenseStage; targetTestDate: Date | null } }
  | { ok: false; error: string };

const validStages = new Set<LicenseStage>(["G1", "G2", "G"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeLearnerProfileForm(formData: FormData): LearnerProfileFormResult {
  const currentStage = String(formData.get("currentStage") ?? "").trim();
  const targetTestDateValue = String(formData.get("targetTestDate") ?? "").trim();

  if (!validStages.has(currentStage as LicenseStage)) {
    return { ok: false, error: "Choose a valid licence stage." };
  }

  if (!targetTestDateValue) {
    return { ok: true, data: { currentStage: currentStage as LicenseStage, targetTestDate: null } };
  }

  if (!datePattern.test(targetTestDateValue)) {
    return { ok: false, error: "Use a valid target test date." };
  }

  const targetTestDate = new Date(`${targetTestDateValue}T00:00:00.000Z`);
  if (Number.isNaN(targetTestDate.getTime()) || targetTestDate.toISOString().slice(0, 10) !== targetTestDateValue) {
    return { ok: false, error: "Use a valid target test date." };
  }

  return { ok: true, data: { currentStage: currentStage as LicenseStage, targetTestDate } };
}

export function formatTargetTestDateInput(targetTestDate: Date | null) {
  return targetTestDate?.toISOString().slice(0, 10) ?? "";
}
