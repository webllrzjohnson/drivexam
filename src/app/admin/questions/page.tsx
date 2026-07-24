import { ModulePage } from "@/components/admin/module-page";
import { QuestionForm } from "@/components/admin/question-form";
import { db } from "@/lib/db";

type QuestionsPageProps = {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
};

export default async function Page({ searchParams }: QuestionsPageProps) {
  const [params, categories, assets, questions] = await Promise.all([
    searchParams,
    db.category.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    db.uploadAsset.findMany({ where: { type: "ROAD_SIGN" }, orderBy: { createdAt: "desc" }, take: 50 }),
    db.question.findMany({
      include: {
        category: true,
        choices: { orderBy: { sortOrder: "asc" } },
        assets: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
      take: 25,
    }),
  ]);

  return (
    <ModulePage slug="questions">
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Question management is live.</p>
          <p>Create handbook-based prompts, answer choices, explanations, review states, and road-sign image attachments.</p>
        </div>
        {params.saved === "question" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Question saved.</p> : null}
        {params.deleted === "question" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Question deleted.</p> : null}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Create question</h3>
          <QuestionForm assets={assets} categories={categories} />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Latest questions</h3>
          {questions.length ? (
            <div className="grid gap-4">
              {questions.map((question) => (
                <div className="space-y-3 rounded-xl border bg-slate-50 p-4" key={question.id}>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-950">{question.prompt}</p>
                    <p className="text-sm text-slate-600">{question.stage} · {question.type.replaceAll("_", " ").toLowerCase()} · {question.status.replaceAll("_", " ").toLowerCase()} · {question.category?.name ?? "No category"}</p>
                  </div>
                  <QuestionForm assets={assets} categories={categories} question={question} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border bg-white px-4 py-8 text-center text-sm text-slate-600">No questions yet.</p>
          )}
        </div>
      </div>
    </ModulePage>
  );
}
