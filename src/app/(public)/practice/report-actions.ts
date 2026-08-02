"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { getSafeQuestionReportReturnTo, parseQuestionReportForm } from "@/lib/question-reports";

export async function createQuestionReport(formData: FormData) {
  const parsed = parseQuestionReportForm(formData);
  const returnTo = getSafeQuestionReportReturnTo(formData.get("returnTo"));
  const user = await getCurrentUser();
  const question = await db.question.findFirst({ where: { id: parsed.questionId, status: "PUBLISHED" }, select: { id: true } });
  if (!question) throw new Error("Choose a published question to report.");

  await db.questionReport.create({
    data: {
      questionId: parsed.questionId,
      reason: parsed.reason,
      comment: parsed.comment,
      reporterEmail: parsed.reporterEmail ?? user?.email ?? null,
      reporterUserId: user?.id ?? null,
    },
  });

  revalidatePath("/admin/reports");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}reported=question`);
}
