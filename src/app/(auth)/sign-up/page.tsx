import Link from "next/link";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <CardTitle>Create your account</CardTitle>
          <p className="text-sm text-slate-600">Unlock progress, daily plans, readiness scores, and mistakes review.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
          <div className="flex items-center justify-between text-sm">
            <Link className="font-medium text-green-800 hover:underline" href="/sign-in">Already have an account?</Link>
            <Link className="text-slate-500 hover:text-slate-800" href="/">Back home</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
