import type { Category } from "@prisma/client";

import { deleteCategory, saveCategory } from "@/app/admin/categories/actions";
import { getCategoryStageOptions } from "@/lib/admin/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CategoryFormProps = {
  category?: Pick<Category, "id" | "name" | "slug" | "description" | "stage" | "sortOrder" | "isActive">;
  returnTo?: string;
};

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function CategoryForm({ category, returnTo = "/admin/categories" }: CategoryFormProps) {
  const formId = category?.id ?? "new";

  return (
    <form action={saveCategory} className="space-y-4 rounded-xl border bg-white p-4">
      {category?.id ? <input name="id" type="hidden" value={category.id} /> : null}
      <input name="returnTo" type="hidden" value={returnTo} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor={`name-${formId}`}>Name</Label>
          <Input id={`name-${formId}`} name="name" required defaultValue={category?.name ?? ""} placeholder="Road signs" />
        </Field>
        <Field>
          <Label htmlFor={`slug-${formId}`}>Slug</Label>
          <Input id={`slug-${formId}`} name="slug" defaultValue={category?.slug ?? ""} placeholder="Auto-generated when blank" />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor={`stage-${formId}`}>Licence stage</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={category?.stage ?? "ALL"} id={`stage-${formId}`} name="stage">
            {getCategoryStageOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`sort-${formId}`}>Sort order</Label>
          <Input id={`sort-${formId}`} name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
        </Field>
      </div>
      <Field>
        <Label htmlFor={`description-${formId}`}>Description</Label>
        <textarea className="min-h-20 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-green-700" id={`description-${formId}`} name="description" defaultValue={category?.description ?? ""} placeholder="What belongs in this category?" />
      </Field>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input defaultChecked={category?.isActive ?? true} name="isActive" type="checkbox" />
        Active
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">{category ? "Save category" : "Create category"}</Button>
        {category ? (
          <Button formAction={deleteCategory} type="submit" variant="outline">
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
