import type { Role } from "@prisma/client";

const defaultRedirects: Record<Role, string> = {
  ADMIN: "/admin",
  AUTHOR: "/dashboard",
  USER: "/dashboard",
};

export function isSafeRelativePath(value?: string | null) {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

export function getPostSignInRedirect(role: Role, callbackUrl?: string | null) {
  if (isSafeRelativePath(callbackUrl)) return callbackUrl as string;
  return defaultRedirects[role];
}
