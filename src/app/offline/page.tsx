import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-12">
      <section className="w-full space-y-5 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">drivexam</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">You’re offline</h1>
        <p className="leading-7 text-slate-600">
          Reconnect to access account features. If you downloaded an offline question pack earlier, you can continue practising on this device.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link className="inline-flex rounded-lg bg-green-800 px-4 py-2 font-semibold text-white hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2" href="/offline-practice">
            Open downloaded practice
          </Link>
          <Link className="inline-flex rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2" href="/">
            Try again
          </Link>
        </div>
      </section>
    </main>
  );
}