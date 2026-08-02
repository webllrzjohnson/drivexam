import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { Button } from "@/components/ui/button";
import { getOptionalSession } from "@/lib/auth/session";

export async function SiteHeader() {
  const session = await getOptionalSession();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-green-900">drivexam</Link>
        <SiteNavigation />
        <div className="flex flex-wrap items-center justify-end gap-2">
          {session?.user ? (
            <>
              {isAdmin ? <Button asChild variant="ghost"><Link href="/admin">Admin</Link></Button> : null}
              <Button asChild variant="ghost"><Link href="/dashboard">Dashboard</Link></Button>
              <SignOutButton compact />
            </>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/sign-in">Sign in</Link></Button>
              <Button asChild><Link href="/sign-up">Start free</Link></Button>
            </>
          )}
        </div>
        <details className="group w-full rounded-lg border bg-white md:hidden">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2">
            <span className="flex items-center justify-between">Menu <span aria-hidden="true" className="group-open:rotate-180">⌄</span></span>
          </summary>
          <SiteNavigation mobile />
        </details>
      </div>
    </header>
  );
}
