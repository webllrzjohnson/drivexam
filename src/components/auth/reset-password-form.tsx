"use client";

import { useActionState } from "react";
import { resetPassword, type FormState } from "@/app/(auth)/actions";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";

type ResetPasswordFormProps = { token: string };
const initialState: FormState = {};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(resetPassword, initialState);
  return (
    <form action={formAction} className="space-y-4">
      <input name="token" type="hidden" value={token} />
      <FormMessage state={state} />
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700" htmlFor="password">New password</label><input autoComplete="new-password" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="password" name="password" required type="password" /></div>
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">Confirm password</label><input autoComplete="new-password" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="confirmPassword" name="confirmPassword" required type="password" /></div>
      <SubmitButton pendingText="Resetting password...">Reset password</SubmitButton>
    </form>
  );
}
