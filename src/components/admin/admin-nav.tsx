import Link from "next/link";
import { adminModules } from "@/lib/admin/cms-config";

export function AdminNav() {
  return (
    <nav className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
      {adminModules.map((module) => (
        <Link className="rounded-lg border bg-white px-3 py-2 font-medium hover:bg-slate-50" href={`/admin/${module.slug}`} key={module.slug}>
          {module.title}
        </Link>
      ))}
    </nav>
  );
}
