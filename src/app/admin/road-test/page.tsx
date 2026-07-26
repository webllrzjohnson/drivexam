import { ModulePage } from "@/components/admin/module-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { groupRoadTestChecklistItems, roadTestStageOptions } from "@/lib/learner/road-test";

export default async function Page() {
  const items = await db.roadTestChecklistItem.findMany({
    include: { category: true },
    orderBy: [{ stage: "asc" }, { section: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
  const groupedByStage = roadTestStageOptions.map((stageOption) => ({
    ...stageOption,
    sections: groupRoadTestChecklistItems(items.filter((item) => item.stage === stageOption.value)),
    count: items.filter((item) => item.stage === stageOption.value && item.isActive).length,
  }));

  return (
    <ModulePage slug="road-test">
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Road-test checklist content is live.</p>
          <p>Review seeded G2 and Full G checklist items by stage, section, category, and active state. Create/edit forms can be added in a later CRUD phase.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {groupedByStage.map((stageGroup) => (
            <Card key={stageGroup.value}>
              <CardHeader>
                <CardTitle>{stageGroup.label} checklist</CardTitle>
                <p className="text-sm text-slate-600">{stageGroup.count} active seeded items</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {stageGroup.sections.map((section) => (
                  <section className="space-y-2" key={section.section}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{section.title}</h3>
                    {section.items.length ? (
                      <div className="space-y-2">
                        {section.items.map((item) => (
                          <div className="rounded-lg border bg-slate-50 p-3" key={item.id}>
                            <p className="font-medium text-slate-950">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.categoryName ?? "No category"} · sort {item.sortOrder} · {item.isActive ? "Active" : "Inactive"}</p>
                            <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">{item.description}</p>
                          </div>
                        ))}
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
