"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/permissions";
import { canChangeUserRole, getAdminUsersReturnTo, parseUserRoleForm } from "@/lib/admin/users";
import { db } from "@/lib/db";

export async function updateUserRole(formData: FormData) {
  const currentUser = await requireAdmin();
  const { userId, role } = parseUserRoleForm(formData);
  const returnTo = getAdminUsersReturnTo(formData.get("returnTo"));

  if (!canChangeUserRole({ currentUserId: currentUser.id, targetUserId: userId })) {
    redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}error=self-role`);
  }

  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}updated=role`);
}
