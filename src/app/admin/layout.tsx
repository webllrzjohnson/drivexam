import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { getCurrentUser, isAdmin } from "@/lib/auth/permissions";
export default async function AdminLayout({ children }: { children: React.ReactNode }) { const user = await getCurrentUser(); if (!user) redirect("/sign-in"); if (!user.emailVerified || !isAdmin(user)) redirect("/dashboard"); return <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8"><div><h1 className="text-3xl font-bold">Admin</h1><p className="text-slate-600">drivexam content and settings.</p></div><AdminNav />{children}</main>; }
