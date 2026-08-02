import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/permissions";
import { shouldRequireLearnerOnboarding } from "@/lib/auth/redirects";
import { db } from "@/lib/db";
import { getMistakeReviewHistory } from "@/lib/learner/mistake-review";
import { buildRoadTestAssessmentProgressSummary } from "@/lib/learner/road-test-assessment";
import { buildRoadTestChecklistProgressSummary } from "@/lib/learner/road-test-progress";
import { buildDailyStudyPlan, buildMistakeReviewQueue, summarizeQuizProgress } from "@/lib/learner/progress";

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
          <AlertTitle as="h1">Email verification required</AlertTitle>
          <AlertDescription>Verify your email before accessing saved progress and daily plans.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4"><Link href="/verify-email">Verification help</Link></Button>
      </main>
    );
  }

  const learnerProfile = await db.user.findUnique({
    where: { id: user.id },
    select: { currentStage: true, targetTestDate: true },
  });
  if (shouldRequireLearnerOnboarding(user.role, learnerProfile?.currentStage ?? null)) redirect("/onboarding");

  const [attempts, checklistItems, mistakeHistory, g2AssessmentHistory, gAssessmentHistory, roadTestAssessmentTotals] = await Promise.all([
    db.quizAttempt.findMany({
      where: { userId: user.id },
      include: { answers: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.roadTestChecklistItem.findMany({
      where: { stage: { in: ["G2", "G"] }, isActive: true },
      include: { progress: { where: { userId: user.id }, select: { itemId: true } } },
      orderBy: [{ stage: "asc" }, { section: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
    }),
    getMistakeReviewHistory(user.id),
    db.roadTestAssessment.findMany({
      where: { userId: user.id, stage: "G2" },
      select: { id: true, stage: true, percent: true, verdict: true, criticalErrorCount: true, createdAt: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 10,
    }),
    db.roadTestAssessment.findMany({
      where: { userId: user.id, stage: "G" },
      select: { id: true, stage: true, percent: true, verdict: true, criticalErrorCount: true, createdAt: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 10,
    }),
    db.roadTestAssessment.groupBy({
      by: ["stage"],
      where: { userId: user.id, stage: { in: ["G2", "G"] } },
      _count: { _all: true },
      _max: { percent: true },
    }),
  ]);
  const roadTestAssessmentHistory = [...g2AssessmentHistory, ...gAssessmentHistory];
  const summary = summarizeQuizProgress(attempts.map((attempt) => ({
    ...attempt,
    answers: attempt.answers.map((answer) => ({ isCorrect: answer.isCorrect, categoryName: answer.categoryName })),
  })));
  const mistakeReview = buildMistakeReviewQueue(mistakeHistory);
  const plan = buildDailyStudyPlan({
    currentStage: learnerProfile?.currentStage ?? null,
    mistakeReview,
    targetTestDate: learnerProfile?.targetTestDate ?? null,
    summary,
  });
  const checklistProgress = (["G2", "G"] as const).map((stage) => buildRoadTestChecklistProgressSummary({
    stage,
    items: checklistItems.filter((item) => item.stage === stage).map((item) => ({
      id: item.id,
      stage,
      section: item.section,
      title: item.title,
      isCompleted: item.progress.length > 0,
    })),
  }));
  const roadTestAssessments = (["G2", "G"] as const).map((stage) => {
    const totals = roadTestAssessmentTotals.find((total) => total.stage === stage);
    return buildRoadTestAssessmentProgressSummary({
      stage,
      assessments: roadTestAssessmentHistory.filter((assessment) => assessment.stage === "G2" || assessment.stage === "G"),
      assessmentCount: totals?._count._all ?? 0,
      bestPercent: totals?._max.percent ?? 0,
    });
  });

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Your drivexam dashboard</h1>
        <p className="text-slate-600">Track saved practice scores, weak areas, and next study actions.</p>
      </div>
      {params.saved === "quiz" ? <p aria-live="polite" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900" role="status">Quiz progress saved.</p> : null}
      {params.saved === "checklist" ? <p aria-live="polite" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900" role="status">Checklist progress saved.</p> : null}
      <DashboardShell attempts={attempts} checklistProgress={checklistProgress} mistakeReview={mistakeReview} plan={plan} roadTestAssessments={roadTestAssessments} summary={summary} />
    </main>
  );
}
