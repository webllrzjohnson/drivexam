import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { getOptionalSession } from "@/lib/auth/session";

export async function SiteHeader() {
  const session = await getOptionalSession();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-green-900">drivexam</Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/practice">Practice</Link>
          <Link href="/road-signs">Road signs</Link>
          <Link href="/road-test">Road test</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/news">News</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </nav>
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
          <nav aria-label="Mobile navigation" className="grid border-t px-4 py-2 text-sm text-slate-700">
            <Link className="rounded-md px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700" href="/practice">Practice</Link>
            <Link className="rounded-md px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700" href="/road-signs">Road signs</Link>
            <Link className="rounded-md px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700" href="/road-test">Road test</Link>
            <Link className="rounded-md px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700" href="/blog">Blog</Link>
            <Link className="rounded-md px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700" href="/news">News</Link>
            <Link className="rounded-md px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700" href="/faq">FAQ</Link>
            <Link className="rounded-md px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700" href="/contact">Contact</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
