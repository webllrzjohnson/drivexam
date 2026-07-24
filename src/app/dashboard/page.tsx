import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { summarizeQuizProgress } from "@/lib/learner/progress";

type DashboardPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect("/sign-in");

  if (!user.emailVerified) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <Alert>
          <AlertTitle>Email verification required</AlertTitle>
          <AlertDescription>Verify your email before accessing saved progress and daily plans.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4"><Link href="/verify-email">Verification help</Link></Button>
      </main>
    );
  }

  const attempts = await db.quizAttempt.findMany({
    where: { userId: user.id },
    include: { answers: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const summary = summarizeQuizProgress(attempts.map((attempt) => ({
    ...attempt,
    answers: attempt.answers.map((answer) => ({ isCorrect: answer.isCorrect, categoryName: answer.categoryName })),
  })));

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Your drivexam dashboard</h1>
        <p className="text-slate-600">Track saved practice scores, weak areas, and next study actions.</p>
      </div>
      {params.saved === "quiz" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Quiz progress saved.</p> : null}
      <DashboardShell attempts={attempts} summary={summary} />
    </main>
  );
}
