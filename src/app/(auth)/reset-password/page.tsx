import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function Page({ searchParams }: ResetPasswordPageProps) {
  const { token = "" } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <CardTitle>Reset password</CardTitle>
          <p className="text-sm text-slate-600">Choose a new password for your drivexam account.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {token ? <ResetPasswordForm token={token} /> : <p className="text-sm text-red-700">Reset token is missing. Request a new link.</p>}
          <Link className="block text-sm text-slate-500 hover:text-slate-800" href="/forgot-password">Request a new reset link</Link>
        </CardContent>
      </Card>
    </main>
  );
}
