import Link from "next/link";
export function AdminNav() { const items = ["Users", "Questions", "Lessons", "Assets", "Blog", "Reports", "Settings"]; return <nav className="flex flex-wrap gap-2 text-sm">{items.map((item) => <Link className="rounded-lg border px-3 py-2" href="/admin" key={item}>{item}</Link>)}</nav>; }
