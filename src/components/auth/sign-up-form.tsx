"use client";

import { useActionState } from "react";
import { signUpWithEmail, type FormState } from "@/app/(auth)/actions";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: FormState = {};

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpWithEmail, initialState);
  return (
    <form action={formAction} className="space-y-4">
      <FormMessage state={state} />
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700" htmlFor="name">Name</label><input autoComplete="name" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="name" name="name" required /></div>
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label><input autoComplete="email" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="email" name="email" required type="email" /></div>
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label><input autoComplete="new-password" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="password" name="password" required type="password" /></div>
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">Confirm password</label><input autoComplete="new-password" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="confirmPassword" name="confirmPassword" required type="password" /></div>
      <SubmitButton pendingText="Creating account...">Create account</SubmitButton>
    </form>
  );
}
