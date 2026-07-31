import type { Metadata } from "next";
import Link from "next/link";

import { OfflinePractice } from "@/components/pwa/offline-practice";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Offline practice",
  description: "Download Ontario G1, G2, and Full G practice content and study without a connection.",
};

export default function OfflinePracticePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-green-900">drivexam</Link>
          <nav aria-label="Offline practice navigation" className="flex items-center gap-4 text-sm font-semibold text-slate-700">
            <Link href="/practice">Online practice</Link>
            <Link href="/">Home</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Installable study mode</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Offline practice</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Download a versioned public question pack, complete quizzes without a connection, and synchronize results later from a verified account.</p>
        </div>
        <OfflinePractice />
      </div>
    </main>
  );
}
