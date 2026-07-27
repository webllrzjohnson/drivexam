import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PracticeQuiz } from "@/components/quiz/practice-quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { buildPracticeQuestionSet, buildPracticeStageGuide, buildQuizQuestionViews } from "@/lib/learner/quiz";

type PracticePageProps = {
  searchParams: Promise<{ stage?: string; categoryId?: string; reported?: string; questionSet?: string }>;
};

const stageOptions = [
  { value: "G1", label: "G1" },
  { value: "G2", label: "G2" },
  { value: "G", label: "Full G" },
] as const;

function getStage(value?: string) {
  return value === "G2" || value === "G" ? value : "G1";
}

function getQuestionSet(value?: string) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildPracticeUrl(stage: string, categoryId: string | undefined, questionSet: number) {
  const search = new URLSearchParams({ stage, questionSet: String(questionSet) });
  if (categoryId) search.set("categoryId", categoryId);
  return `/practice?${search.toString()}`;
}

export default async function PracticePage({ searchParams }: PracticePageProps) {
  const params = await searchParams;
  const stage = getStage(params.stage);
  const categoryId = params.categoryId || undefined;
  const requestedSet = getQuestionSet(params.questionSet);
  const returnTo = buildPracticeUrl(stage, categoryId, requestedSet);
  const [session, categories, questions] = await Promise.all([
    getOptionalSession(),
    db.category.findMany({ where: { isActive: true, OR: [{ stage }, { stage: null }] }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    db.question.findMany({
      where: {
        stage,
        status: "PUBLISHED",
        ...(categoryId ? { categoryId } : {}),
        choices: { some: { isCorrect: true } },
      },
      include: {
        category: true,
        assets: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
        choices: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
  ]);
  const quizQuestions = buildQuizQuestionViews(questions);
  const questionSet = buildPracticeQuestionSet(quizQuestions, { requestedSet, pageSize: 20 });
  const guide = buildPracticeStageGuide({ stage, categoryCount: categories.length, questionCount: questionSet.questions.length });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Practice quiz</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">{guide.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{guide.description}</p>
            <div className="flex flex-wrap gap-3 text-sm font-medium">
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-900">{guide.questionTargetLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{guide.readinessTarget}</span>
            </div>
          </div>
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl">How to use this practice set</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {guide.milestones.map((milestone, index) => (
                <div className="flex gap-3 rounded-xl bg-white p-3 shadow-sm" key={milestone.title}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-900 text-sm font-bold text-white">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-slate-950">{milestone.title}</p>
                    <p className="text-sm leading-6 text-slate-600">{milestone.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Choose practice set</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" method="get">
              <label className="space-y-2 text-sm font-medium">
                <span>Stage</span>
                <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={stage} name="stage">
                  {stageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Category</span>
                <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={categoryId ?? ""} name="categoryId">
                  <option value="">All categories</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <div className="flex items-end gap-2">
                <Button type="submit">Load quiz</Button>
                <Button asChild type="button" variant="outline"><Link href="/practice">Reset</Link></Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {params.reported === "question" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Thanks — your question report was sent to admins.</p> : null}

        {questionSet.totalSets > 1 ? (
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-700">
                Showing set {questionSet.activeSet} of {questionSet.totalSets} · {questionSet.totalCount} published questions available
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: questionSet.totalSets }, (_, index) => index + 1).map((set) => (
                  <Button asChild key={set} size="sm" variant={set === questionSet.activeSet ? "default" : "outline"}>
                    <Link href={buildPracticeUrl(stage, categoryId, set)}>Set {set}</Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <PracticeQuiz canSaveProgress={Boolean(session?.user?.emailVerified)} emptyState={guide.emptyState} questions={questionSet.questions} returnTo={returnTo} stage={stage} />
      </main>
      <SiteFooter />
    </>
  );
}
