import type { Prisma, Role } from "@prisma/client";

export const manageableRoles = ["USER", "AUTHOR", "ADMIN"] as const satisfies Role[];

export type ManageableRole = (typeof manageableRoles)[number];

export function getUserSearchFilter(search: string): Prisma.UserWhereInput | undefined {
  const query = search.trim();
  if (!query) return undefined;

  return {
    OR: [
      { email: { contains: query, mode: "insensitive" } },
      { name: { contains: query, mode: "insensitive" } },
    ],
  };
}

export function parseUserRoleForm(formData: FormData): { userId: string; role: ManageableRole } {
  const userId = String(formData.get("userId") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();

  if (!userId) throw new Error("Choose a user to update.");
  if (!manageableRoles.includes(role as ManageableRole)) throw new Error("Choose a valid role.");

  return { userId, role: role as ManageableRole };
}

export function canChangeUserRole({ currentUserId, targetUserId }: { currentUserId: string; targetUserId: string }) {
  return currentUserId !== targetUserId;
}

export function getAdminUsersReturnTo(value: FormDataEntryValue | null) {
  const fallback = "/admin/users";
  const candidate = String(value ?? "");
  if (!candidate.startsWith("/admin/users")) return fallback;
  if (candidate.startsWith("//")) return fallback;
  return candidate;
}
