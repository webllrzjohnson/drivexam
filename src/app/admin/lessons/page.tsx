import { ModulePage } from "@/components/admin/module-page";
import { LessonForm } from "@/components/admin/lesson-form";
import { db } from "@/lib/db";

type LessonsPageProps = {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
};

export default async function Page({ searchParams }: LessonsPageProps) {
  const [params, categories, lessons] = await Promise.all([
    searchParams,
    db.category.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    db.lesson.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: 25,
    }),
  ]);

  return (
    <ModulePage slug="lessons">
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Lesson management is live.</p>
          <p>Create handbook-style G1, G2, and full G lessons with categories, review status, and learner-facing content.</p>
        </div>
        {params.saved === "lesson" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Lesson saved.</p> : null}
        {params.deleted === "lesson" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Lesson deleted.</p> : null}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Create lesson</h3>
          <LessonForm categories={categories} />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Latest lessons</h3>
          {lessons.length ? (
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <div className="space-y-3 rounded-xl border bg-slate-50 p-4" key={lesson.id}>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-950">{lesson.title}</p>
                    <p className="text-sm text-slate-600">/{lesson.slug} · {lesson.stage} · {lesson.status.replaceAll("_", " ").toLowerCase()} · {lesson.category?.name ?? "No category"} · sort {lesson.sortOrder}</p>
                  </div>
                  <LessonForm categories={categories} lesson={lesson} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border bg-white px-4 py-8 text-center text-sm text-slate-600">No lessons yet.</p>
          )}
        </div>
      </div>
    </ModulePage>
  );
}
