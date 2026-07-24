import type { AnswerChoice, Category, Question, QuestionAsset, UploadAsset } from "@prisma/client";

import { deleteQuestion, saveQuestion } from "@/app/admin/questions/actions";
import { getContentStatusOptions, getQuestionStageOptions, getQuestionTypeOptions } from "@/lib/admin/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type QuestionWithRelations = Pick<Question, "id" | "type" | "prompt" | "explanation" | "stage" | "categoryId" | "status" | "selectCount" | "sourceReference"> & {
  choices: Array<Pick<AnswerChoice, "text" | "assetId" | "isCorrect" | "sortOrder">>;
  assets: Array<Pick<QuestionAsset, "assetId">>;
};

type QuestionFormProps = {
  question?: QuestionWithRelations;
  categories: Array<Pick<Category, "id" | "name" | "stage">>;
  assets: Array<Pick<UploadAsset, "id" | "title" | "filename" | "type">>;
  returnTo?: string;
};

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function assetLabel(asset: Pick<UploadAsset, "title" | "filename" | "type">) {
  return `${asset.title || asset.filename} · ${asset.type.replaceAll("_", " ").toLowerCase()}`;
}

export function QuestionForm({ question, categories, assets, returnTo = "/admin/questions" }: QuestionFormProps) {
  const formId = question?.id ?? "new";
  const choices = question?.choices?.length ? [...question.choices].sort((a, b) => a.sortOrder - b.sortOrder) : [];
  const choiceRows = Array.from({ length: Math.max(4, choices.length) }, (_, index) => choices[index] ?? null);
  const attachedAssetIds = question?.assets.map((asset) => asset.assetId) ?? [];

  return (
    <form action={saveQuestion} className="space-y-5 rounded-xl border bg-white p-4">
      {question?.id ? <input name="id" type="hidden" value={question.id} /> : null}
      <input name="returnTo" type="hidden" value={returnTo} />

      <div className="grid gap-4 md:grid-cols-3">
        <Field>
          <Label htmlFor={`type-${formId}`}>Type</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={question?.type ?? "MULTIPLE_CHOICE"} id={`type-${formId}`} name="type">
            {getQuestionTypeOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`stage-${formId}`}>Stage</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={question?.stage ?? "G1"} id={`stage-${formId}`} name="stage">
            {getQuestionStageOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`status-${formId}`}>Status</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={question?.status ?? "DRAFT"} id={`status-${formId}`} name="status">
            {getContentStatusOptions().map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
      </div>

      <Field>
        <Label htmlFor={`prompt-${formId}`}>Prompt</Label>
        <textarea className="min-h-24 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-green-700" id={`prompt-${formId}`} name="prompt" required defaultValue={question?.prompt ?? ""} placeholder="What does this sign mean?" />
      </Field>

      <Field>
        <Label htmlFor={`explanation-${formId}`}>Explanation</Label>
        <textarea className="min-h-24 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-green-700" id={`explanation-${formId}`} name="explanation" required defaultValue={question?.explanation ?? ""} placeholder="Explain the handbook rule and why the right answer is correct." />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field>
          <Label htmlFor={`category-${formId}`}>Category</Label>
          <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={question?.categoryId ?? ""} id={`category-${formId}`} name="categoryId">
            <option value="">No category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.stage ? ` · ${category.stage}` : ""}</option>)}
          </select>
        </Field>
        <Field>
          <Label htmlFor={`select-count-${formId}`}>Select count</Label>
          <Input id={`select-count-${formId}`} name="selectCount" type="number" min={1} defaultValue={question?.selectCount ?? 1} />
        </Field>
        <Field>
          <Label htmlFor={`source-${formId}`}>Source reference</Label>
          <Input id={`source-${formId}`} name="sourceReference" defaultValue={question?.sourceReference ?? ""} placeholder="MTO Handbook section" />
        </Field>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold">Answer choices</p>
          <p className="text-xs text-slate-600">Check the correct answer. Multi-select questions may have more than one checked answer.</p>
        </div>
        <div className="grid gap-3">
          {choiceRows.map((choice, index) => (
            <div className="grid gap-3 rounded-lg border bg-slate-50 p-3 md:grid-cols-[auto_1fr_1fr]" key={index}>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input defaultChecked={choice?.isCorrect ?? false} name="correctChoice" type="checkbox" value={index} />
                Correct
              </label>
              <Input name="choiceText" defaultValue={choice?.text ?? ""} placeholder={`Choice ${index + 1}`} />
              <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" defaultValue={choice?.assetId ?? ""} name="choiceAssetId">
                <option value="">No choice image</option>
                {assets.map((asset) => <option key={asset.id} value={asset.id}>{assetLabel(asset)}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <Field>
        <Label htmlFor={`assets-${formId}`}>Question image attachments</Label>
        <select className="min-h-24 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" defaultValue={attachedAssetIds} id={`assets-${formId}`} multiple name="questionAssetId">
          {assets.map((asset) => <option key={asset.id} value={asset.id}>{assetLabel(asset)}</option>)}
        </select>
      </Field>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">{question ? "Save question" : "Create question"}</Button>
        {question ? (
          <Button formAction={deleteQuestion} type="submit" variant="outline">
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
