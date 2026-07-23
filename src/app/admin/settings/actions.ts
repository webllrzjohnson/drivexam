"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/permissions";
import { parseSiteSettingsForm, saveSiteSettings } from "@/lib/admin/site-settings";

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const settings = parseSiteSettingsForm(formData);
  await saveSiteSettings(settings);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?updated=settings");
}
