import Link from "next/link";

import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-green-900">drivexam</Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/blog">Blog</Link>
          <Link href="/news">News</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}
