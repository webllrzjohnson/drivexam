"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

function getSubmissionId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Choose a contact submission.");
  return id;
}

export async function resolveContactSubmission(formData: FormData) {
  await requireAdmin();
  await db.contactSubmission.update({ where: { id: getSubmissionId(formData) }, data: { resolvedAt: new Date() } });
  revalidatePath("/admin/contact");
  redirect("/admin/contact?resolved=submission");
}

export async function reopenContactSubmission(formData: FormData) {
  await requireAdmin();
  await db.contactSubmission.update({ where: { id: getSubmissionId(formData) }, data: { resolvedAt: null } });
  revalidatePath("/admin/contact");
  redirect("/admin/contact?reopened=submission");
}

export async function deleteContactSubmission(formData: FormData) {
  await requireAdmin();
  await db.contactSubmission.delete({ where: { id: getSubmissionId(formData) } });
  revalidatePath("/admin/contact");
  redirect("/admin/contact?deleted=submission");
}
