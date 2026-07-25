import Link from "next/link";
import { redirect } from "next/navigation";

import { LearnerProfileForm } from "@/components/account/learner-profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { formatTargetTestDateInput } from "@/lib/learner/profile";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in?callbackUrl=/account");

  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: { currentStage: true, targetTestDate: true },
  });

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Account settings</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Learner profile</h1>
        <p className="text-slate-600">Set your licence goal and test date so drivexam can personalize your daily study plan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study plan settings</CardTitle>
        </CardHeader>
        <CardContent>
          <LearnerProfileForm currentStage={profile?.currentStage ?? null} targetTestDate={formatTargetTestDateInput(profile?.targetTestDate ?? null)} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline"><Link href="/dashboard">View dashboard</Link></Button>
        <Button asChild variant="outline"><Link href="/">Back home</Link></Button>
        <Button asChild variant="ghost"><Link href="/account/delete">Delete account</Link></Button>
      </div>
    </main>
  );
}
