"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminCategoriesReturnTo, parseCategoryForm } from "@/lib/admin/categories";
import { db } from "@/lib/db";

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const category = parseCategoryForm(formData);
  const id = String(formData.get("id") ?? "").trim();
  const returnTo = getAdminCategoriesReturnTo(formData.get("returnTo"));

  if (id) {
    await db.category.update({ where: { id }, data: category });
  } else {
    await db.category.create({ data: category });
  }

  revalidatePath("/admin/categories");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}saved=category`);
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const returnTo = getAdminCategoriesReturnTo(formData.get("returnTo"));
  if (!id) throw new Error("Choose a category to delete.");

  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}deleted=category`);
}
