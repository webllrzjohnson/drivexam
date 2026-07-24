"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminQuestionsReturnTo, parseQuestionForm } from "@/lib/admin/questions";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

export async function saveQuestion(formData: FormData) {
  const user = await requireAdmin();
  const parsed = parseQuestionForm(formData);
  const id = String(formData.get("id") ?? "").trim();
  const returnTo = getAdminQuestionsReturnTo(formData.get("returnTo"));

  if (id) {
    await db.question.update({
      where: { id },
      data: {
        ...parsed.question,
        reviewedById: parsed.question.status === "PUBLISHED" ? user.id : undefined,
        publishedAt: parsed.question.status === "PUBLISHED" ? new Date() : null,
        choices: {
          deleteMany: {},
          create: parsed.choices,
        },
        assets: {
          deleteMany: {},
          create: parsed.assetIds.map((assetId, sortOrder) => ({ assetId, sortOrder })),
        },
      },
    });
  } else {
    await db.question.create({
      data: {
        ...parsed.question,
        authorId: user.id,
        reviewedById: parsed.question.status === "PUBLISHED" ? user.id : undefined,
        publishedAt: parsed.question.status === "PUBLISHED" ? new Date() : null,
        choices: { create: parsed.choices },
        assets: { create: parsed.assetIds.map((assetId, sortOrder) => ({ assetId, sortOrder })) },
      },
    });
  }

  revalidatePath("/admin/questions");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}saved=question`);
}

export async function deleteQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const returnTo = getAdminQuestionsReturnTo(formData.get("returnTo"));
  if (!id) throw new Error("Choose a question to delete.");

  await db.question.delete({ where: { id } });
  revalidatePath("/admin/questions");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}deleted=question`);
}
