"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminRoadTestReturnTo, parseRoadTestChecklistForm } from "@/lib/admin/road-test";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

export async function saveRoadTestChecklistItem(formData: FormData) {
  await requireAdmin();
  const parsed = parseRoadTestChecklistForm(formData);
  const id = String(formData.get("id") ?? "").trim();
  const returnTo = getAdminRoadTestReturnTo(formData.get("returnTo"));

  if (id) {
    await db.roadTestChecklistItem.update({ where: { id }, data: parsed });
  } else {
    await db.roadTestChecklistItem.create({ data: parsed });
  }

  revalidatePath("/admin/road-test");
  revalidatePath("/road-test");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}saved=road-test`);
}

export async function deleteRoadTestChecklistItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const returnTo = getAdminRoadTestReturnTo(formData.get("returnTo"));
  if (!id) throw new Error("Choose a checklist item to delete.");

  await db.roadTestChecklistItem.delete({ where: { id } });
  revalidatePath("/admin/road-test");
  revalidatePath("/road-test");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}deleted=road-test`);
}
