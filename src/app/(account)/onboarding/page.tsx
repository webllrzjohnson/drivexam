import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/account/onboarding-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in?callbackUrl=/onboarding");
  if (!user.emailVerified) redirect("/verify-email");

  const profile = await db.user.findUnique({ where: { id: user.id }, select: { currentStage: true } });
  if (profile?.currentStage) redirect("/dashboard");

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:py-14">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Your guided setup</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Let&apos;s build the right study path</h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">Choose your licence goal and, if you know it, your test date. We&apos;ll take you directly to the best place to start.</p>
      </div>

      <Card className="border-green-200 shadow-sm">
        <CardHeader>
          <CardTitle as="h2">Step 1 of 1 · Set your goal</CardTitle>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>

      <p className="text-center text-sm leading-6 text-slate-500">You can update these choices anytime from Account settings.</p>
    </main>
  );
}
