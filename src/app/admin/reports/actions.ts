"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

function getReportId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Choose a report.");
  return id;
}

export async function resolveQuestionReport(formData: FormData) {
  await requireAdmin();
  await db.questionReport.update({ where: { id: getReportId(formData) }, data: { resolvedAt: new Date() } });
  revalidatePath("/admin/reports");
  redirect("/admin/reports?resolved=report");
}

export async function reopenQuestionReport(formData: FormData) {
  await requireAdmin();
  await db.questionReport.update({ where: { id: getReportId(formData) }, data: { resolvedAt: null } });
  revalidatePath("/admin/reports");
  redirect("/admin/reports?reopened=report");
}

export async function deleteQuestionReport(formData: FormData) {
  await requireAdmin();
  await db.questionReport.delete({ where: { id: getReportId(formData) } });
  revalidatePath("/admin/reports");
  redirect("/admin/reports?deleted=report");
}
