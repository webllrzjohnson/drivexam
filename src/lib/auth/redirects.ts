import type { Role } from "@prisma/client";

const defaultRedirects: Record<Role, string> = {
  ADMIN: "/admin",
  AUTHOR: "/dashboard",
  USER: "/dashboard",
};

export function isSafeRelativePath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return false;
  if (/[\\\u0000-\u001f\u007f]/.test(value) || /%(?:2f|5c)/i.test(value)) return false;

  try {
    const appOrigin = "https://drivexam.invalid";
    return new URL(value, appOrigin).origin === appOrigin;
  } catch {
    return false;
  }
}

export function shouldRequireLearnerOnboarding(role: Role, currentStage: string | null | undefined) {
  return role === "USER" && !currentStage;
}

export function getPostSignInRedirect(role: Role, callbackUrl?: string | null, needsOnboarding = false) {
  if (isSafeRelativePath(callbackUrl)) return callbackUrl as string;
  if (role === "USER" && needsOnboarding) return "/onboarding";
  return defaultRedirects[role];
}
