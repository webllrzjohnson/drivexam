import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminModules } from "@/lib/admin/cms-config";

export function AdminModuleGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {adminModules.map((module) => (
        <Link href={`/admin/${module.slug}`} key={module.slug}>
          <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader><CardTitle className="text-lg">{module.title}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>{module.description}</p>
              <p className="font-medium text-green-800">{module.phase}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
