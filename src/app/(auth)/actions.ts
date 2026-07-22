"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { getPostSignInRedirect, isSafeRelativePath } from "@/lib/auth/redirects";

export type SignInState = { error?: string };

export async function signInWithCredentials(_previousState: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Invalid email or password." };
    throw error;
  }

  const user = await db.user.findUnique({ where: { email }, select: { role: true, emailVerified: true } });
  if (!user?.emailVerified) redirect("/verify-email");
  redirect(getPostSignInRedirect(user.role, callbackUrl));
}

export async function signInWithGoogle(formData: FormData) {
  const callbackUrl = String(formData.get("callbackUrl") ?? "");
  await signIn("google", { redirectTo: isSafeRelativePath(callbackUrl) ? callbackUrl : "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
