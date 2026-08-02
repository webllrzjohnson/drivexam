import Link from "next/link";
import type { QuizAttempt } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { buildRoadTestChecklistProgressSummary } from "@/lib/learner/road-test-progress";
import type { buildDailyStudyPlan, buildMistakeReviewQueue, summarizeQuizProgress } from "@/lib/learner/progress";

type ProgressSummary = ReturnType<typeof summarizeQuizProgress>;
type DailyStudyPlan = ReturnType<typeof buildDailyStudyPlan>;
type MistakeReview = ReturnType<typeof buildMistakeReviewQueue>;
type RoadTestChecklistProgressSummary = ReturnType<typeof buildRoadTestChecklistProgressSummary>;

type DashboardShellProps = {
  attempts: Array<Pick<QuizAttempt, "id" | "stage" | "correctCount" | "totalCount" | "percent" | "createdAt">>;
  checklistProgress: RoadTestChecklistProgressSummary[];
  mistakeReview: MistakeReview;
  plan: DailyStudyPlan;
  summary: ProgressSummary;
};

function MetricCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-green-900">{value}</p>
        <p className="text-sm text-slate-600">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardShell({ attempts, checklistProgress, mistakeReview, plan, summary }: DashboardShellProps) {
  const recentAttempts = attempts.slice(0, 5);
  const activeByStageCategory = new Map<string, { stage: NonNullable<(typeof mistakeReview.items)[number]["stage"]>; categoryName: string; activeCount: number }>();
  for (const item of mistakeReview.items) {
    if (!item.stage) continue;
    const key = `${item.stage}:${item.categoryName}`;
    const current = activeByStageCategory.get(key);
    activeByStageCategory.set(key, { stage: item.stage, categoryName: item.categoryName, activeCount: (current?.activeCount ?? 0) + 1 });
  }
  const weakAreas = Array.from(activeByStageCategory.values()).sort((a, b) => b.activeCount - a.activeCount || a.stage.localeCompare(b.stage) || a.categoryName.localeCompare(b.categoryName));

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-800">Today&apos;s study plan</p>
          <CardTitle className="text-2xl">Focus on {plan.focusArea}</CardTitle>
          <p className="text-sm text-slate-600">
            {plan.stageLabel}{plan.daysUntilTest === null ? "" : ` · ${plan.daysUntilTest} day${plan.daysUntilTest === 1 ? "" : "s"} until test`} · {plan.readinessTone} pace
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {plan.actions.map((action, index) => (
            <Link className="rounded-xl border bg-white p-4 shadow-sm transition hover:border-green-300 hover:shadow" href={action.href} key={action.title}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-900 text-sm font-bold text-white">{index + 1}</span>
              <h2 className="mt-3 font-semibold text-slate-950">{action.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{action.detail}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard detail={`${summary.attemptCount} saved attempt${summary.attemptCount === 1 ? "" : "s"}`} title="Average score" value={`${summary.averagePercent}%`} />
        <MetricCard detail="Best saved practice result" title="Readiness score" value={`${summary.bestPercent}%`} />
        <MetricCard detail="Most recent saved quiz" title="Latest score" value={`${summary.latestPercent}%`} />
        <MetricCard detail="Across saved attempts" title="Answered" value={String(summary.totalQuestionsAnswered)} />
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle>Review mistakes</CardTitle>
          <p className="text-sm text-amber-950">Retry missed questions until you answer each one correctly twice in a row.</p>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-3xl font-bold text-amber-950">{mistakeReview.activeCount}</p>
            <p className="text-sm text-amber-900">active question{mistakeReview.activeCount === 1 ? "" : "s"} to strengthen</p>
          </div>
          <Button asChild><Link href="/mistake-review">{mistakeReview.activeCount ? "Practise my mistakes" : "View mistake review"}</Link></Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Road-test checklist progress</CardTitle>
          <p className="text-sm text-slate-600">Track practical road-test readiness separately from quiz scores.</p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {checklistProgress.map((stageSummary) => (
            <Link className="rounded-xl border bg-slate-50 p-4 transition hover:border-green-300 hover:bg-green-50" href={`/road-test?stage=${stageSummary.stage}`} key={stageSummary.stage}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-slate-950">{stageSummary.stage === "G" ? "Full G" : "G2"} checklist</h2>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-green-900">{stageSummary.percent}%</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-green-900">{stageSummary.completedCount}/{stageSummary.totalCount} complete</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">Next: {stageSummary.nextAction}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Weak areas</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {weakAreas.length ? weakAreas.map((area) => (
              <Link className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2 transition hover:border-green-300 hover:bg-green-50" href={`/mistake-review?stage=${area.stage}&category=${encodeURIComponent(area.categoryName)}`} key={`${area.stage}:${area.categoryName}`}>
                <span>{area.stage === "G" ? "Full G" : area.stage} · {area.categoryName}</span>
                <span>{area.activeCount} active</span>
              </Link>
            )) : <p>No active weak areas. Keep practising to maintain your progress.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent practice</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {recentAttempts.length ? recentAttempts.map((attempt) => (
              <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2" key={attempt.id}>
                <span>{attempt.stage} · {attempt.correctCount}/{attempt.totalCount}</span>
                <span>{attempt.percent}%</span>
              </div>
            )) : <p>No saved quizzes yet.</p>}
            <Button asChild className="mt-2"><Link href="/practice">Practice now</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
