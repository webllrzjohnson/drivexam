import Link from "next/link";

import { PracticeQuiz } from "@/components/quiz/practice-quiz";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildQuizQuestionViews } from "@/lib/learner/quiz";
import { db } from "@/lib/db";
import { auth } from "@/auth";

type PracticePageProps = {
  searchParams: Promise<{ stage?: string; categoryId?: string }>;
};

const stageOptions = [
  { value: "G1", label: "G1" },
  { value: "G2", label: "G2" },
  { value: "G", label: "Full G" },
] as const;

function getStage(value?: string) {
  return value === "G2" || value === "G" ? value : "G1";
}

export default async function PracticePage({ searchParams }: PracticePageProps) {
  const params = await searchParams;
  const stage = getStage(params.stage);
  const categoryId = params.categoryId || undefined;
  const [session, categories, questions] = await Promise.all([
    auth(),
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
      take: 20,
    }),
  ]);
  const quizQuestions = buildQuizQuestionViews(questions);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Practice quiz</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">Ontario driving practice questions</h1>
          <p className="max-w-3xl text-slate-600">Choose your stage, answer published admin questions, and review explanations immediately.</p>
        </div>

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

        <PracticeQuiz canSaveProgress={Boolean(session?.user?.emailVerified)} questions={quizQuestions} stage={stage} />
      </main>
      <SiteFooter />
    </>
  );
}
