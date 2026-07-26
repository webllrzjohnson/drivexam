import type { Category, RoadTestChecklistItem } from "@prisma/client";

import { deleteRoadTestChecklistItem, saveRoadTestChecklistItem } from "@/app/admin/road-test/actions";
import { getRoadTestChecklistSectionOptions, getRoadTestStageOptions } from "@/lib/admin/road-test";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RoadTestChecklistFormProps = {
  item?: Pick<RoadTestChecklistItem, "id" | "stage" | "section" | "title" | "description" | "categoryId" | "sortOrder" | "isActive">;
  categories: Array<Pick<Category, "id" | "name" | "stage">>;
  returnTo?: string;
};

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function RoadTestChecklistForm({ item, categories, returnTo = "/admin/road-test" }: RoadTestChecklistFormProps) {
  const formId = item?.id ?? "new";
  const roadTestCategories = categories.filter((category) => category.stage === "G2" || category.stage === "G" || category.stage === null);

  return (
    <form action={saveRoadTestChecklistItem} className="space-y-4 rounded-xl border bg-white p-4">
      {item?.id ? <input name="id" type="hidden" value={item.id} /> : null}
      <input name="returnTo" type="hidden" value={returnTo} />

      <div className="grid gap-4 md:grid-cols-3">
        <Field>
          <Label htmlFor={`stage-${formId}`}>Stage</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={item?.stage ?? "G2"} id={`stage-${formId}`} name="stage">
            {getRoadTestStageOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`section-${formId}`}>Section</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={item?.section ?? "BEFORE_TEST"} id={`section-${formId}`} name="section">
            {getRoadTestChecklistSectionOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`sort-${formId}`}>Sort order</Label>
          <Input id={`sort-${formId}`} name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <Field>
          <Label htmlFor={`title-${formId}`}>Title</Label>
          <Input id={`title-${formId}`} name="title" required defaultValue={item?.title ?? ""} placeholder="Practise highway comfort before booking" />
        </Field>
        <Field>
          <Label htmlFor={`category-${formId}`}>Category</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={item?.categoryId ?? ""} id={`category-${formId}`} name="categoryId">
            <option value="">No category</option>
            {roadTestCategories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.stage ? ` · ${category.stage}` : ""}</option>)}
          </select>
        </Field>
      </div>

      <Field>
        <Label htmlFor={`description-${formId}`}>Description</Label>
        <textarea className="min-h-24 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-green-700" id={`description-${formId}`} name="description" defaultValue={item?.description ?? ""} placeholder="What should the learner do, and why does it matter on the road test?" />
      </Field>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input defaultChecked={item?.isActive ?? true} name="isActive" type="checkbox" />
        Active
      </label>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">{item ? "Save checklist item" : "Create checklist item"}</Button>
        {item ? (
          <Button formAction={deleteRoadTestChecklistItem} type="submit" variant="outline">
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
