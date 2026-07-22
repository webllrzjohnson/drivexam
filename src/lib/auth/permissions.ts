import { auth } from "@/auth";
import type { Role } from "@prisma/client";
export function isAdmin(user?: { role?: Role | string | null }) { return user?.role === "ADMIN"; }
export function isAuthorOrAdmin(user?: { role?: Role | string | null }) { return user?.role === "AUTHOR" || user?.role === "ADMIN"; }
export async function getCurrentUser() { const session = await auth(); return session?.user ?? null; }
export async function requireVerifiedUser() { const user = await getCurrentUser(); if (!user) throw new Error("Authentication required"); if (!user.emailVerified) throw new Error("Email verification required"); return user; }
export async function requireAdmin() { const user = await requireVerifiedUser(); if (!isAdmin(user)) throw new Error("Admin access required"); return user; }
