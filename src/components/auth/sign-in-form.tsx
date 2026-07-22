"use client";

import { useActionState } from "react";
import { signInWithCredentials, type SignInState } from "@/app/(auth)/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SignInFormProps = {
  callbackUrl?: string;
};

const initialState: SignInState = {};

export function SignInForm({ callbackUrl = "" }: SignInFormProps) {
  const [state, formAction] = useActionState(signInWithCredentials, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input name="callbackUrl" type="hidden" value={callbackUrl} />
      {state.error ? <Alert><AlertTitle>Sign-in failed</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert> : null}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
        <input autoComplete="email" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="email" name="email" required type="email" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
        <input autoComplete="current-password" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" id="password" name="password" required type="password" />
      </div>
      <SubmitButton pendingText="Signing in...">Sign in</SubmitButton>
    </form>
  );
}
