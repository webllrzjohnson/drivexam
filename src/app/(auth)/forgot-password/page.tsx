import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <CardTitle>Forgot password</CardTitle>
          <p className="text-sm text-slate-600">Enter your email and we’ll send a secure reset link if the account exists.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ForgotPasswordForm />
          <Link className="block text-sm text-slate-500 hover:text-slate-800" href="/sign-in">Back to sign in</Link>
        </CardContent>
      </Card>
    </main>
  );
}
