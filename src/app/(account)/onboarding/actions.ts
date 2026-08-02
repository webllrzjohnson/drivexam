"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { getOnboardingDestination, normalizeLearnerProfileForm } from "@/lib/learner/profile";

export async function completeLearnerOnboarding(_previousState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user?.id) return { error: "Sign in to complete learner setup." };
  if (!user.emailVerified) return { error: "Verify your email before completing learner setup." };

  const parsed = normalizeLearnerProfileForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  await db.user.update({ where: { id: user.id }, data: parsed.data });
  revalidatePath("/account");
  revalidatePath("/dashboard");
  redirect(getOnboardingDestination(parsed.data.currentStage));
}
