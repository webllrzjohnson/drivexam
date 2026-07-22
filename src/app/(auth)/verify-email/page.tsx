import Link from "next/link";

import { verifyEmailToken } from "@/app/(auth)/actions";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function Page({ searchParams }: VerifyEmailPageProps) {
  const { token = "" } = await searchParams;
  const verified = token ? await verifyEmailToken(token) : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <CardTitle>Verify email</CardTitle>
          <p className="text-sm text-slate-600">Email verification unlocks your dashboard and saved progress.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {verified === true ? <p className="rounded-md bg-green-50 p-3 text-sm text-green-800">Email verified. You can sign in now.</p> : null}
          {verified === false ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">This verification link is invalid or expired. Request a fresh link below.</p> : null}
          {verified !== true ? <ResendVerificationForm /> : null}
          <Link className="block text-sm text-slate-500 hover:text-slate-800" href="/sign-in">Back to sign in</Link>
        </CardContent>
      </Card>
    </main>
  );
}
