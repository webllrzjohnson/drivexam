import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RoadSignFlashcards } from "@/components/road-signs/road-sign-flashcards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildRoadSignFlashcardGroups, buildRoadSignPracticeGuide } from "@/lib/learner/quiz";

export default async function RoadSignsPage() {
  const [assets, signsCategory, linkedQuestionCount] = await Promise.all([
    db.uploadAsset.findMany({
      where: { type: "ROAD_SIGN", category: "Ontario G1 road signs" },
      orderBy: [{ title: "asc" }, { filename: "asc" }],
    }),
    db.category.findUnique({ where: { slug: "g1-signs-and-lights" }, select: { id: true } }),
    db.question.count({
      where: {
        stage: "G1",
        status: "PUBLISHED",
        assets: { some: { asset: { type: "ROAD_SIGN", category: "Ontario G1 road signs" } } },
      },
    }),
  ]);
  const guide = buildRoadSignPracticeGuide({ assetCount: assets.length, questionCount: linkedQuestionCount });
  const flashcardGroups = buildRoadSignFlashcardGroups(assets.map((asset) => ({
    title: asset.title ?? asset.filename,
    path: asset.path,
    description: asset.description,
  })));
  const signsQuizHref = signsCategory?.id ? `/practice?stage=G1&categoryId=${signsCategory.id}` : "/practice?stage=G1";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Road signs only</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">{guide.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{guide.description}</p>
            <div className="flex flex-wrap gap-3 text-sm font-medium">
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-900">{guide.assetLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{guide.questionLabel}</span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild><Link href={signsQuizHref}>Start signs quiz</Link></Button>
              <Button asChild variant="outline"><Link href="/practice?stage=G1">Review G1 practice</Link></Button>
            </div>
          </div>
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle as="h2">How to study these signs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-slate-700">
              <p>1. Scan the image first and say the meaning out loud before reading the card title.</p>
              <p>2. Use the signs quiz to practise the same signs as real multiple-choice questions.</p>
              <p>3. Repeat until you can recognize the sign shape, colour, and rule quickly.</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">Ontario sign flashcards</h2>
            <p className="text-sm text-slate-600">Source-backed local images. Select “Start signs quiz” when you are ready to test recognition.</p>
          </div>
          {assets.length ? (
            <RoadSignFlashcards groups={flashcardGroups} />
          ) : (
            <Card>
              <CardContent className="p-6 text-sm text-slate-600">No road sign assets are seeded yet. Run the seed command to load the Ontario sign bank.</CardContent>
            </Card>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
