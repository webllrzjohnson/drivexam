"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireVerifiedUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { getRoadTestStage } from "@/lib/learner/road-test";
import { doesSavedMockDriveAssessmentMatchSubmission, normalizeMockDriveAssessmentSubmission } from "@/lib/learner/road-test-assessment";

export async function saveMockDriveAssessment(formData: FormData) {
  const user = await requireVerifiedUser();
  const parsed = normalizeMockDriveAssessmentSubmission(formData);
  if (!parsed.ok) throw new Error(parsed.error);
  if (parsed.data.result.verdict === "INCOMPLETE") throw new Error("Complete every assessment rating before saving.");

  try {
    await db.roadTestAssessment.create({
      data: {
        userId: user.id,
        clientAssessmentId: parsed.data.clientAssessmentId,
        stage: parsed.data.stage,
        percent: parsed.data.result.percent,
        verdict: parsed.data.result.verdict,
        criticalErrorCount: parsed.data.criticalErrorCount,
        ratings: parsed.data.ratings,
        priorityIds: parsed.data.result.priorities.map((priority) => priority.id),
      },
    });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
    const existing = await db.roadTestAssessment.findUnique({
      where: { userId_clientAssessmentId: { userId: user.id, clientAssessmentId: parsed.data.clientAssessmentId } },
      select: { stage: true, percent: true, verdict: true, criticalErrorCount: true, ratings: true, priorityIds: true },
    });
    if (!existing) throw error;
    if (!doesSavedMockDriveAssessmentMatchSubmission(existing, parsed.data)) {
      throw new Error("This mock-drive assessment identifier was already used for different results.");
    }
  }

  revalidatePath("/road-test");
  revalidatePath("/dashboard");
  redirect(`/road-test?stage=${parsed.data.stage}&saved=drive#mock-drive-assessment`);
}

export async function toggleRoadTestChecklistProgress(formData: FormData) {
  const user = await requireVerifiedUser();
  const itemId = String(formData.get("itemId") ?? "").trim();
  const stage = getRoadTestStage(String(formData.get("stage") ?? ""));
  const shouldComplete = formData.get("completed") === "on";

  if (!itemId) throw new Error("Choose a checklist item.");

  const item = await db.roadTestChecklistItem.findFirst({
    where: { id: itemId, stage, isActive: true },
    select: { id: true },
  });
  if (!item) throw new Error("Checklist item is not available.");

  if (shouldComplete) {
    await db.roadTestChecklistProgress.upsert({
      where: { userId_itemId: { userId: user.id, itemId } },
      update: { completedAt: new Date() },
      create: { userId: user.id, itemId },
    });
  } else {
    await db.roadTestChecklistProgress.deleteMany({ where: { userId: user.id, itemId } });
  }

  revalidatePath("/road-test");
  revalidatePath("/dashboard");
  redirect(`/road-test?stage=${stage}&saved=checklist`);
}
