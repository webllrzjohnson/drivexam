import Link from "next/link";

import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function Page({ searchParams }: SignInPageProps) {
  const { callbackUrl = "" } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <CardTitle>Sign in</CardTitle>
          <p className="text-sm text-slate-600">Access your Ontario driving exam dashboard and admin tools.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm callbackUrl={callbackUrl} />
          <div className="relative py-2 text-center text-xs uppercase text-slate-400">
            <span className="bg-white px-2">or</span>
          </div>
          <GoogleSignInForm callbackUrl={callbackUrl} />
          <div className="flex items-center justify-between text-sm">
            <Link className="font-medium text-green-800 hover:underline" href="/forgot-password">Forgot password?</Link>
            <Link className="font-medium text-green-800 hover:underline" href="/sign-up">Create account</Link>
          </div>
          <Link className="block text-sm text-slate-500 hover:text-slate-800" href="/">Back home</Link>
        </CardContent>
      </Card>
    </main>
  );
}
