import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PracticeQuiz } from "@/components/quiz/practice-quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { getMistakeReviewHistory } from "@/lib/learner/mistake-review";
import { buildQuizQuestionViews } from "@/lib/learner/quiz";
import { buildMistakeReviewQueue, filterMistakeReviewItems } from "@/lib/learner/progress";

const stageOptions = ["G1", "G2", "G"] as const;
type ReviewStage = (typeof stageOptions)[number];

type MistakeReviewPageProps = {
  searchParams: Promise<{ stage?: string; category?: string; reported?: string; reportedQuestionId?: string }>;
};

function parseStage(value: string | undefined, fallback: ReviewStage): ReviewStage {
  return stageOptions.includes(value as ReviewStage) ? value as ReviewStage : fallback;
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:py-10">{children}</main>
      <SiteFooter />
    </>
  );
}

export default async function MistakeReviewPage({ searchParams }: MistakeReviewPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    return (
      <PageFrame>
        <Card className="mx-auto max-w-2xl border-green-200 bg-green-50">
          <CardHeader><CardTitle>Sign in to review mistakes</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>Saved practice results let drivexam build a private retry queue from the questions you missed.</p>
            <Button asChild><Link href="/sign-in">Sign in</Link></Button>
          </CardContent>
        </Card>
      </PageFrame>
    );
  }

  if (!user.emailVerified) {
    return (
      <PageFrame>
        <Card className="mx-auto max-w-2xl">
          <CardHeader><CardTitle>Verify your email to review mistakes</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>Your personalized retry queue is available after email verification.</p>
            <Button asChild><Link href="/verify-email">Verification help</Link></Button>
          </CardContent>
        </Card>
      </PageFrame>
    );
  }

  const [profile, history] = await Promise.all([
    db.user.findUnique({ where: { id: user.id }, select: { currentStage: true } }),
    getMistakeReviewHistory(user.id),
  ]);

  const review = buildMistakeReviewQueue(history);
  const stage = parseStage(params.stage, profile?.currentStage ?? "G1");
  const stageItems = review.items.filter((item) => item.stage === stage);
  const requestedCategory = typeof params.category === "string" && stageItems.some((item) => item.categoryName === params.category)
    ? params.category
    : null;
  const selectedItems = filterMistakeReviewItems(review.items, { stage, categoryName: requestedCategory, limit: 20 });
  const questions = selectedItems.length ? await db.question.findMany({
    where: {
      id: { in: selectedItems.map((item) => item.questionId) },
      stage,
      status: "PUBLISHED",
      choices: { some: { isCorrect: true } },
    },
    include: {
      category: true,
      assets: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
      choices: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
    },
  }) : [];
  const viewById = new Map(buildQuizQuestionViews(questions).map((question) => [question.id, question]));
  const quizQuestions = selectedItems.flatMap((item) => {
    const question = viewById.get(item.questionId);
    return question ? [question] : [];
  });
  const returnParams = new URLSearchParams({ stage });
  if (requestedCategory) returnParams.set("category", requestedCategory);
  const returnTo = `/mistake-review?${returnParams.toString()}`;
  const categories = Array.from(new Set(stageItems.map((item) => item.categoryName))).sort((a, b) => a.localeCompare(b));

  return (
    <PageFrame>
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-800">Personalized review</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Turn mistakes into stronger answers</h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Retry up to 20 current published questions, starting with the ones you miss most. Two correct retries in a row remove a question from your active review queue.
        </p>
      </section>

      {params.reported === "question" ? <p aria-live="polite" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900" role="status">Thanks — your question report was sent to admins.</p> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-base">Active mistakes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-900">{review.activeCount}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">This stage</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-900">{stageItems.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Retry set</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-900">{quizQuestions.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Choose a targeted drill</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2" aria-label="License stage">
            {stageOptions.map((option) => <Button asChild key={option} variant={option === stage ? "default" : "outline"}><Link aria-current={option === stage ? "page" : undefined} href={`/mistake-review?stage=${option}`}>{option === "G" ? "Full G" : option}</Link></Button>)}
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Weak category">
            <Button asChild variant={requestedCategory ? "outline" : "default"}><Link aria-current={requestedCategory ? undefined : "page"} href={`/mistake-review?stage=${stage}`}>All weak areas</Link></Button>
            {categories.map((category) => (
              <Button asChild key={category} variant={requestedCategory === category ? "default" : "outline"}>
                <Link aria-current={requestedCategory === category ? "page" : undefined} href={`/mistake-review?stage=${stage}&category=${encodeURIComponent(category)}`}>{category}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {quizQuestions.length ? (
        <PracticeQuiz
          canSaveProgress
          emptyState="No active mistakes match this drill."
          initialQuestionId={params.reportedQuestionId}
          key={returnTo}
          questions={quizQuestions}
          returnTo={returnTo}
          stage={stage}
        />
      ) : (
        <Card>
          <CardContent className="space-y-3 p-8 text-center text-slate-700">
            <p className="font-semibold">No active mistakes for this drill.</p>
            <p>Complete and save a practice quiz, or choose another stage or weak area.</p>
            <Button asChild><Link href={`/practice?stage=${stage}`}>Start practice</Link></Button>
          </CardContent>
        </Card>
      )}
    </PageFrame>
  );
}
