import { ModulePage } from "@/components/admin/module-page";
import { CategoryForm } from "@/components/admin/category-form";
import { db } from "@/lib/db";

type CategoriesPageProps = {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
};

export default async function Page({ searchParams }: CategoriesPageProps) {
  const [params, categories] = await Promise.all([
    searchParams,
    db.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <ModulePage slug="categories">
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Category management is live.</p>
          <p>Organize G1, G2, and full G lessons, questions, and road-test content by topic.</p>
        </div>
        {params.saved === "category" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Category saved.</p> : null}
        {params.deleted === "category" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Category deleted.</p> : null}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Create category</h3>
          <CategoryForm />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Existing categories</h3>
          {categories.length ? (
            <div className="grid gap-4">
              {categories.map((category) => (
                <div className="space-y-3 rounded-xl border bg-slate-50 p-4" key={category.id}>
                  <div>
                    <p className="font-semibold text-slate-950">{category.name}</p>
                    <p className="text-sm text-slate-600">/{category.slug} · {category.stage ?? "All stages"} · sort {category.sortOrder} · {category.isActive ? "Active" : "Inactive"}</p>
                  </div>
                  <CategoryForm category={category} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border bg-white px-4 py-8 text-center text-sm text-slate-600">No categories yet.</p>
          )}
        </div>
      </div>
    </ModulePage>
  );
}
