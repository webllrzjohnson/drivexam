import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/permissions";
export default async function DashboardPage() { const user = await getCurrentUser(); if (!user) redirect("/sign-in"); if (!user.emailVerified) return <main className="mx-auto w-full max-w-3xl px-4 py-12"><Alert><AlertTitle>Email verification required</AlertTitle><AlertDescription>Verify your email before accessing saved progress and daily plans.</AlertDescription></Alert><Button asChild className="mt-4"><Link href="/verify-email">Verification help</Link></Button></main>; return <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8"><div><h1 className="text-3xl font-bold">Your drivexam dashboard</h1><p className="text-slate-600">Daily plans, readiness, weak areas, and achievements will appear here.</p></div><DashboardShell /></main>; }
