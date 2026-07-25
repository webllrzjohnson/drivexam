"use server";

import { revalidatePath } from "next/cache";

import type { FormState } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { normalizeLearnerProfileForm } from "@/lib/learner/profile";

export async function updateLearnerProfile(_previousState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user?.id) return { error: "Sign in to update your learner profile." };

  const parsed = normalizeLearnerProfileForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  await db.user.update({
    where: { id: user.id },
    data: parsed.data,
  });

  revalidatePath("/account");
  revalidatePath("/dashboard");
  return { success: "Learner profile saved. Your dashboard study plan will use these settings." };
}
