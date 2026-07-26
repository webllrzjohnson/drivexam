"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireVerifiedUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { getRoadTestStage } from "@/lib/learner/road-test";

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
