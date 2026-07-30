import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-12">
      <section className="w-full space-y-5 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">drivexam</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">You’re offline</h1>
        <p className="leading-7 text-slate-600">
          Reconnect to load practice questions, save progress, or access your account. Previously loaded static images may still be available.
        </p>
        <Link className="inline-flex rounded-lg bg-green-800 px-4 py-2 font-semibold text-white hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2" href="/">
          Try again
        </Link>
      </section>
    </main>
  );
}