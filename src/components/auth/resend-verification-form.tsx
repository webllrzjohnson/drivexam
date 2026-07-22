"use client";

import { useActionState } from "react";
import { resendVerificationEmail, type FormState } from "@/app/(auth)/actions";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: FormState = {};

export function ResendVerificationForm() {
  const [state, formAction] = useActionState(resendVerificationEmail, initialState);
  return (
    <form action={formAction} className="space-y-4">
      <FormMessage state={state} />
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label><input autoComplete="email" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="email" name="email" required type="email" /></div>
      <SubmitButton pendingText="Sending...">Resend verification email</SubmitButton>
    </form>
  );
}
