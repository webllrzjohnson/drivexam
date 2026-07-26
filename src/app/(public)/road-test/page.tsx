import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildRoadTestStageGuide, getRoadTestStage, groupRoadTestChecklistItems, roadTestStageOptions } from "@/lib/learner/road-test";

type RoadTestPageProps = {
  searchParams: Promise<{ stage?: string }>;
};

function buildRoadTestUrl(stage: string) {
  return `/road-test?stage=${stage}`;
}

export default async function RoadTestPage({ searchParams }: RoadTestPageProps) {
  const params = await searchParams;
  const stage = getRoadTestStage(params.stage);
  const checklistItems = await db.roadTestChecklistItem.findMany({
    where: { stage, isActive: true },
    include: { category: true },
    orderBy: [{ section: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
  const sections = groupRoadTestChecklistItems(checklistItems);
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
            </div>
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
              <p className="text-sm leading-6 text-slate-700">
                Use this checklist with real practice drives, then jump into the matching question set when you want feedback.
              </p>
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
                    <article className="rounded-xl border bg-slate-50 p-4" key={item.id}>
                      <div className="flex flex-col gap-2">
                        <div>
                          <h2 className="font-semibold text-slate-950">{item.title}</h2>
                          {item.categoryName ? <p className="text-xs font-medium uppercase tracking-wide text-green-800">{item.categoryName}</p> : null}
                        </div>
                        <p className="whitespace-pre-line text-sm leading-6 text-slate-600">{item.description}</p>
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
