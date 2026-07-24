import Link from "next/link";
import type { QuizAttempt } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { summarizeQuizProgress } from "@/lib/learner/progress";

type ProgressSummary = ReturnType<typeof summarizeQuizProgress>;

type DashboardShellProps = {
  attempts: Array<Pick<QuizAttempt, "id" | "stage" | "correctCount" | "totalCount" | "percent" | "createdAt">>;
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

export function DashboardShell({ attempts, summary }: DashboardShellProps) {
  const recentAttempts = attempts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard detail={`${summary.attemptCount} saved attempt${summary.attemptCount === 1 ? "" : "s"}`} title="Average score" value={`${summary.averagePercent}%`} />
        <MetricCard detail="Best saved practice result" title="Readiness score" value={`${summary.bestPercent}%`} />
        <MetricCard detail="Most recent saved quiz" title="Latest score" value={`${summary.latestPercent}%`} />
        <MetricCard detail="Across saved attempts" title="Answered" value={String(summary.totalQuestionsAnswered)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Weak areas</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {summary.weakAreas.length ? summary.weakAreas.map((area) => (
              <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2" key={area.categoryName}>
                <span>{area.categoryName}</span>
                <span>{area.missedCount} missed</span>
              </div>
            )) : <p>No weak areas yet. Save a practice quiz to build your review list.</p>}
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
