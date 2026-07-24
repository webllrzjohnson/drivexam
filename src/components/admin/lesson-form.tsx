import type { Category, Lesson } from "@prisma/client";

import { deleteLesson, saveLesson } from "@/app/admin/lessons/actions";
import { getLessonStageOptions, getLessonStatusOptions } from "@/lib/admin/lessons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LessonFormProps = {
  lesson?: Pick<Lesson, "id" | "title" | "slug" | "summary" | "body" | "stage" | "categoryId" | "status" | "sortOrder">;
  categories: Array<Pick<Category, "id" | "name" | "stage">>;
  returnTo?: string;
};

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function LessonForm({ lesson, categories, returnTo = "/admin/lessons" }: LessonFormProps) {
  const formId = lesson?.id ?? "new";

  return (
    <form action={saveLesson} className="space-y-5 rounded-xl border bg-white p-4">
      {lesson?.id ? <input name="id" type="hidden" value={lesson.id} /> : null}
      <input name="returnTo" type="hidden" value={returnTo} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor={`title-${formId}`}>Title</Label>
          <Input id={`title-${formId}`} name="title" required defaultValue={lesson?.title ?? ""} placeholder="Understanding stop signs" />
        </Field>
        <Field>
          <Label htmlFor={`slug-${formId}`}>Slug</Label>
          <Input id={`slug-${formId}`} name="slug" defaultValue={lesson?.slug ?? ""} placeholder="Auto-generated when blank" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Field>
          <Label htmlFor={`stage-${formId}`}>Stage</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={lesson?.stage ?? "G1"} id={`stage-${formId}`} name="stage">
            {getLessonStageOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`status-${formId}`}>Status</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={lesson?.status ?? "DRAFT"} id={`status-${formId}`} name="status">
            {getLessonStatusOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`category-${formId}`}>Category</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={lesson?.categoryId ?? ""} id={`category-${formId}`} name="categoryId">
            <option value="">No category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.stage ? ` · ${category.stage}` : ""}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`sort-${formId}`}>Sort order</Label>
          <Input id={`sort-${formId}`} name="sortOrder" type="number" defaultValue={lesson?.sortOrder ?? 0} />
        </Field>
      </div>

      <Field>
        <Label htmlFor={`summary-${formId}`}>Summary</Label>
        <textarea className="min-h-20 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-green-700" id={`summary-${formId}`} name="summary" defaultValue={lesson?.summary ?? ""} placeholder="Short learner-facing summary." />
      </Field>

      <Field>
        <Label htmlFor={`body-${formId}`}>Body</Label>
        <textarea className="min-h-56 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-green-700" id={`body-${formId}`} name="body" required defaultValue={lesson?.body ?? ""} placeholder="Write the handbook-style lesson content here." />
      </Field>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">{lesson ? "Save lesson" : "Create lesson"}</Button>
        {lesson ? (
          <Button formAction={deleteLesson} type="submit" variant="outline">
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
