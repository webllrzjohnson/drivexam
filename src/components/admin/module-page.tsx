import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminModule } from "@/lib/admin/cms-config";

type ModulePageProps = {
  slug: string;
  children?: React.ReactNode;
};

export function ModulePage({ slug, children }: ModulePageProps) {
  const adminModule = getAdminModule(slug);
  if (!adminModule) notFound();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-green-800">{adminModule.phase}</p>
        <h2 className="text-2xl font-bold">{adminModule.title}</h2>
        <p className="max-w-3xl text-slate-600">{adminModule.description}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Management workspace</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          {children ?? <p>This CMS workspace is ready for CRUD forms, tables, filters, and review queues.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
