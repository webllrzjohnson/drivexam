import { ModulePage } from "@/components/admin/module-page";
import { RoadTestChecklistForm } from "@/components/admin/road-test-checklist-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { groupRoadTestChecklistItems, roadTestStageOptions } from "@/lib/learner/road-test";

type RoadTestAdminPageProps = {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
};

export default async function Page({ searchParams }: RoadTestAdminPageProps) {
  const [params, categories, items] = await Promise.all([
    searchParams,
    db.category.findMany({ where: { isActive: true, OR: [{ stage: "G2" }, { stage: "G" }, { stage: null }] }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    db.roadTestChecklistItem.findMany({
      include: { category: true },
      orderBy: [{ stage: "asc" }, { section: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
    }),
  ]);
  const itemById = new Map(items.map((item) => [item.id, item]));
  const groupedByStage = roadTestStageOptions.map((stageOption) => ({
    ...stageOption,
    sections: groupRoadTestChecklistItems(items.filter((item) => item.stage === stageOption.value)),
    count: items.filter((item) => item.stage === stageOption.value && item.isActive).length,
  }));

  return (
    <ModulePage slug="road-test">
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Road-test checklist management is live.</p>
          <p>Create, edit, deactivate, or delete G2 and Full G checklist items. Active items appear on the learner Road Test page.</p>
        </div>
        {params.saved === "road-test" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Road-test checklist item saved.</p> : null}
        {params.deleted === "road-test" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Road-test checklist item deleted.</p> : null}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Create checklist item</h3>
          <RoadTestChecklistForm categories={categories} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {groupedByStage.map((stageGroup) => (
            <Card key={stageGroup.value}>
              <CardHeader>
                <CardTitle>{stageGroup.label} checklist</CardTitle>
                <p className="text-sm text-slate-600">{stageGroup.count} active items</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {stageGroup.sections.map((section) => (
                  <section className="space-y-2" key={section.section}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{section.title}</h3>
                    {section.items.length ? (
                      <div className="space-y-3">
                        {section.items.map((item) => {
                          const checklistItem = itemById.get(item.id);
                          if (!checklistItem) return null;
                          return (
                            <div className="space-y-3 rounded-lg border bg-slate-50 p-3" key={item.id}>
                              <div>
                                <p className="font-medium text-slate-950">{item.title}</p>
                                <p className="text-xs text-slate-500">{item.categoryName ?? "No category"} · sort {item.sortOrder} · {item.isActive ? "Active" : "Inactive"}</p>
                                <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">{item.description}</p>
                              </div>
                              <RoadTestChecklistForm categories={categories} item={checklistItem} />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="rounded-lg border bg-white p-3 text-sm text-slate-600">{section.emptyState}</p>
                    )}
                  </section>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ModulePage>
  );
}
