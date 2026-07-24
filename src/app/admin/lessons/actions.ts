"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminLessonsReturnTo, parseLessonForm } from "@/lib/admin/lessons";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

export async function saveLesson(formData: FormData) {
  const user = await requireAdmin();
  const lesson = parseLessonForm(formData);
  const id = String(formData.get("id") ?? "").trim();
  const returnTo = getAdminLessonsReturnTo(formData.get("returnTo"));
  const publishData = lesson.status === "PUBLISHED" ? { reviewedById: user.id, publishedAt: new Date() } : { publishedAt: null };

  if (id) {
    await db.lesson.update({ where: { id }, data: { ...lesson, ...publishData } });
  } else {
    await db.lesson.create({ data: { ...lesson, authorId: user.id, ...publishData } });
  }

  revalidatePath("/admin/lessons");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}saved=lesson`);
}

export async function deleteLesson(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const returnTo = getAdminLessonsReturnTo(formData.get("returnTo"));
  if (!id) throw new Error("Choose a lesson to delete.");

  await db.lesson.delete({ where: { id } });
  revalidatePath("/admin/lessons");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}deleted=lesson`);
}
