import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PracticeQuiz } from "@/components/quiz/practice-quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getOptionalSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { buildG1MockExam, buildQuizQuestionViews, getNextG1MockExamAttempt, normalizeG1MockExamAttempt } from "@/lib/learner/quiz";

const handbookUrl = "https://www.ontario.ca/document/official-mto-drivers-handbook";

type G1MockExamPageProps = {
  searchParams: Promise<{ attempt?: string; reported?: string }>;
};

export default async function G1MockExamPage({ searchParams }: G1MockExamPageProps) {
  const params = await searchParams;
  const attempt = normalizeG1MockExamAttempt(params.attempt);
  const [session, questions] = await Promise.all([
    getOptionalSession(),
    db.question.findMany({
      where: {
        stage: "G1",
        status: "PUBLISHED",
        choices: { some: { isCorrect: true } },
      },
      include: {
        category: true,
        assets: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
        choices: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);
  const exam = buildG1MockExam(buildQuizQuestionViews(questions), { seed: `g1-mock-exam:${attempt}` });
  const returnTo = `/g1-mock-exam?attempt=${attempt}`;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:py-10">
        <section className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">G1 mock exam</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Test your signs and rules knowledge</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Complete 40 questions in one sitting: 20 signs and 20 rules. You need at least 16 correct answers in each section to pass this drivexam simulation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href="/practice?stage=G1">Return to G1 practice</Link></Button>
            <Button asChild variant="outline"><Link href={`/g1-mock-exam?attempt=${getNextG1MockExamAttempt(attempt)}`}>Load another mock exam</Link></Button>
          </div>
        </section>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader><h2 className="text-xl font-semibold">Before you begin</h2></CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 text-amber-950 sm:grid-cols-3">
            <p><strong>Exam conditions:</strong> answer every question before submitting.</p>
            <p><strong>Feedback:</strong> answers and explanations stay hidden until the end.</p>
            <p><strong>Source:</strong> content is based on the <a className="underline" href={handbookUrl} rel="noreferrer" target="_blank">Official MTO Driver’s Handbook</a>.</p>
          </CardContent>
        </Card>

        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          This is an unofficial study simulation. It does not reproduce or guarantee the exact live DriveTest knowledge test.
        </p>

        {params.reported === "question" ? <p aria-live="polite" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900" role="status">Thanks — your question report was sent to admins.</p> : null}

        {exam.ready ? (
          <PracticeQuiz
            canSaveProgress={Boolean(session?.user?.emailVerified)}
            experience="g1-mock-exam"
            key={attempt}
            questions={exam.questions}
            returnTo={returnTo}
            stage="G1"
          />
        ) : (
          <Card>
            <CardContent className="space-y-2 p-8 text-center text-slate-700">
              <p className="font-semibold">The mock exam is temporarily unavailable.</p>
              <p>It needs 20 published sign questions and 20 published rules questions. Missing: {exam.missing.signs} signs and {exam.missing.rules} rules.</p>
            </CardContent>
          </Card>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
