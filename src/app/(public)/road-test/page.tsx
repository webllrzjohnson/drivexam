import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RoadTestChecklistProgressForm } from "@/components/road-test/road-test-checklist-progress-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { buildRoadTestChecklistProgressSummary } from "@/lib/learner/road-test-progress";
import { buildRoadTestStageGuide, getRoadTestStage, groupRoadTestChecklistItems, roadTestStageOptions } from "@/lib/learner/road-test";

type RoadTestPageProps = {
  searchParams: Promise<{ stage?: string; saved?: string }>;
};

function buildRoadTestUrl(stage: string) {
  return `/road-test?stage=${stage}`;
}

export default async function RoadTestPage({ searchParams }: RoadTestPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const stage = getRoadTestStage(params.stage);
  const canSaveProgress = Boolean(user?.id && user.emailVerified);
  const checklistItems = await db.roadTestChecklistItem.findMany({
    where: { stage, isActive: true },
    include: {
      category: true,
      progress: canSaveProgress ? { where: { userId: user?.id }, select: { itemId: true } } : false,
    },
    orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
  const completedIds = new Set(checklistItems.flatMap((item) => item.progress?.map((progress) => progress.itemId) ?? []));
  const sections = groupRoadTestChecklistItems(checklistItems);
  const progressSummary = buildRoadTestChecklistProgressSummary({
    stage,
    items: checklistItems.map((item) => ({
      id: item.id,
      stage,
      section: item.section,
      title: item.title,
      isCompleted: completedIds.has(item.id),
    })),
  });
  const guide = buildRoadTestStageGuide({ stage, checklistCount: checklistItems.length });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Road-test prep</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">{guide.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{guide.description}</p>
            <div className="flex flex-wrap gap-3 text-sm font-medium">
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-900">{guide.summaryLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{guide.readinessTarget}</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-900">{progressSummary.completedCount}/{progressSummary.totalCount} complete · {progressSummary.percent}%</span>
            </div>
            {params.saved === "checklist" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Checklist progress saved.</p> : null}
          </div>
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl">Choose your road test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {roadTestStageOptions.map((option) => (
                  <Button asChild key={option.value} variant={option.value === stage ? "default" : "outline"}>
                    <Link href={buildRoadTestUrl(option.value)}>{option.label}</Link>
                  </Button>
                ))}
              </div>
              <div className="rounded-xl border bg-white p-3 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-slate-950">Next action</p>
                <p>{progressSummary.nextAction}</p>
                {!canSaveProgress ? <p className="mt-2 text-xs text-slate-500">Sign in with a verified account to save checklist progress.</p> : null}
              </div>
              <Button asChild variant="outline">
                <Link href={`/practice?stage=${stage}`}>Practice {stage === "G" ? "Full G" : "G2"} questions</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.section}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <p className="text-sm leading-6 text-slate-600">{section.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.items.length ? (
                  section.items.map((item) => (
                    <article className={`rounded-xl border p-4 ${completedIds.has(item.id) ? "border-green-200 bg-green-50" : "bg-slate-50"}`} key={item.id}>
                      <div className="flex flex-col gap-3">
                        <div>
                          <h2 className="font-semibold text-slate-950">{item.title}</h2>
                          {item.categoryName ? <p className="text-xs font-medium uppercase tracking-wide text-green-800">{item.categoryName}</p> : null}
                        </div>
                        <p className="whitespace-pre-line text-sm leading-6 text-slate-600">{item.description}</p>
                        <RoadTestChecklistProgressForm canSaveProgress={canSaveProgress} isCompleted={completedIds.has(item.id)} itemId={item.id} stage={stage} />
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-xl border bg-white px-4 py-8 text-center text-sm text-slate-600">{section.emptyState}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
