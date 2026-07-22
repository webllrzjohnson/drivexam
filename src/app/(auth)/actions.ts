"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { hashPassword } from "@/lib/auth/password";
import { normalizeEmail, validatePassword, isValidPasswordReset } from "@/lib/auth/inputs";
import { getAppUrl, createSecureToken, getExpiryDate, hashToken } from "@/lib/auth/tokens";
import { getPostSignInRedirect, isSafeRelativePath } from "@/lib/auth/redirects";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/send-email";
import { passwordResetEmailTemplate } from "@/lib/email/templates/password-reset-email";
import { verificationEmailTemplate } from "@/lib/email/templates/verification-email";

export type FormState = { error?: string; success?: string };
export type SignInState = FormState;

async function createVerificationEmail(email: string) {
  const token = createSecureToken();
  await db.verificationToken.deleteMany({ where: { identifier: email } });
  await db.verificationToken.create({ data: { identifier: email, token: hashToken(token), expires: getExpiryDate(60 * 24) } });
  const url = `${getAppUrl()}/verify-email?token=${token}`;
  await sendEmail({ to: email, ...verificationEmailTemplate(url) });
}

export async function signInWithCredentials(_previousState: SignInState, formData: FormData): Promise<SignInState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
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

export async function signUpWithEmail(_previousState: FormState, formData: FormData): Promise<FormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !name) return { error: "Enter your name and email." };
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.ok) return { error: passwordCheck.message };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const existingUser = await db.user.findUnique({ where: { email }, select: { id: true, emailVerified: true, deletedAt: true } });
  if (existingUser?.deletedAt) return { error: "This account cannot be used. Contact support." };
  if (existingUser?.emailVerified) return { error: "An account already exists for this email. Sign in instead." };

  const passwordHash = await hashPassword(password);
  await db.user.upsert({
    where: { email },
    update: { name, passwordHash, deletedAt: null },
    create: { email, name, passwordHash },
  });
  await createVerificationEmail(email);

  return { success: "Account created. Check your email for the verification link before signing in." };
}

export async function resendVerificationEmail(_previousState: FormState, formData: FormData): Promise<FormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) return { error: "Enter your email." };
  const user = await db.user.findUnique({ where: { email }, select: { emailVerified: true, deletedAt: true } });
  if (!user || user.deletedAt) return { success: "If the account exists, a verification email has been sent." };
  if (user.emailVerified) return { success: "This email is already verified. You can sign in." };
  await createVerificationEmail(email);
  return { success: "Verification email sent. Check your inbox." };
}

export async function verifyEmailToken(token: string) {
  const record = await db.verificationToken.findUnique({ where: { token: hashToken(token) } });
  if (!record || record.expires < new Date()) return false;
  await db.user.update({ where: { email: record.identifier }, data: { emailVerified: new Date() } });
  await db.verificationToken.delete({ where: { token: record.token } });
  return true;
}

export async function requestPasswordReset(_previousState: FormState, formData: FormData): Promise<FormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) return { error: "Enter your email." };
  const user = await db.user.findUnique({ where: { email }, select: { id: true, email: true, deletedAt: true } });
  if (user?.email && !user.deletedAt) {
    const token = createSecureToken();
    await db.passwordResetToken.create({ data: { token: hashToken(token), userId: user.id, expires: getExpiryDate(60) } });
    const url = `${getAppUrl()}/reset-password?token=${token}`;
    await sendEmail({ to: user.email, ...passwordResetEmailTemplate(url) });
  }
  return { success: "If the account exists, a password reset email has been sent." };
}

export async function resetPassword(_previousState: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  if (!token) return { error: "Reset token is missing." };
  if (!isValidPasswordReset(password, confirmPassword)) return { error: "Use matching passwords with at least 8 characters and one number." };

  const record = await db.passwordResetToken.findUnique({ where: { token: hashToken(token) }, include: { user: true } });
  if (!record || record.usedAt || record.expires < new Date() || record.user.deletedAt) return { error: "This reset link is invalid or expired." };
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash: await hashPassword(password), emailVerified: new Date() } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
  return { success: "Password reset. You can sign in now." };
}

export async function signInWithGoogle(formData: FormData) {
  const callbackUrl = String(formData.get("callbackUrl") ?? "");
  await signIn("google", { redirectTo: isSafeRelativePath(callbackUrl) ? callbackUrl : "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
