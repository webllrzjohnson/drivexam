import { deleteContactSubmission, reopenContactSubmission, resolveContactSubmission } from "@/app/admin/contact/actions";
import { ModulePage } from "@/components/admin/module-page";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { buildContactSubmissionSummary } from "@/lib/contact-submissions";

type ContactAdminPageProps = {
  searchParams: Promise<{ resolved?: string; reopened?: string; deleted?: string }>;
};

type ContactSubmissionRow = Awaited<ReturnType<typeof getSubmissions>>[number];

async function getSubmissions() {
  return db.contactSubmission.findMany({
    include: { user: { select: { email: true, name: true } } },
    orderBy: [{ resolvedAt: "asc" }, { createdAt: "desc" }],
    take: 100,
  });
}

function formatDate(date: Date | null) {
  return date ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short" }).format(date) : "Open";
}

function SubmissionCard({ submission }: { submission: ContactSubmissionRow }) {
  const isResolved = Boolean(submission.resolvedAt);

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-800">{submission.user.name ?? submission.user.email}</p>
          <h3 className="text-lg font-semibold text-slate-950">{submission.subject}</h3>
          <p className="text-sm text-slate-600">{submission.user.email} · {formatDate(submission.createdAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isResolved ? "bg-slate-100 text-slate-700" : "bg-amber-100 text-amber-900"}`}>
          {isResolved ? "Resolved" : "Open"}
        </span>
      </div>

      <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{submission.message}</p>
      <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Resolved:</span> {formatDate(submission.resolvedAt)}</p>

      <div className="flex flex-wrap gap-2">
        <form action={isResolved ? reopenContactSubmission : resolveContactSubmission}>
          <input name="id" type="hidden" value={submission.id} />
          <Button type="submit" variant={isResolved ? "outline" : "default"}>{isResolved ? "Reopen" : "Mark resolved"}</Button>
        </form>
        <form action={deleteContactSubmission}>
          <input name="id" type="hidden" value={submission.id} />
          <Button type="submit" variant="outline">Delete</Button>
        </form>
      </div>
    </div>
  );
}

export default async function Page({ searchParams }: ContactAdminPageProps) {
  const [params, submissions] = await Promise.all([searchParams, getSubmissions()]);
  const summary = buildContactSubmissionSummary(submissions);
  const openSubmissions = submissions.filter((submission) => !submission.resolvedAt);
  const resolvedSubmissions = submissions.filter((submission) => submission.resolvedAt);

  return (
    <ModulePage slug="contact">
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Contact submission triage is live.</p>
          <p>Review verified-user support messages, mark resolved, reopen if follow-up is needed, or delete temporary/test submissions.</p>
        </div>
        {params.resolved === "submission" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Submission resolved.</p> : null}
        {params.reopened === "submission" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Submission reopened.</p> : null}
        {params.deleted === "submission" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Submission deleted.</p> : null}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-600">Open submissions</p>
            <p className="text-3xl font-bold text-amber-800">{summary.openCount}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-600">Resolved submissions</p>
            <p className="text-3xl font-bold text-green-900">{summary.resolvedCount}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-600">Latest message</p>
            <p className="text-lg font-semibold text-slate-950">{formatDate(summary.latestCreatedAt)}</p>
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Open queue</h3>
          {openSubmissions.length ? <div className="grid gap-4">{openSubmissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)}</div> : <p className="rounded-xl border bg-white px-4 py-8 text-center text-sm text-slate-600">No open contact submissions.</p>}
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Resolved submissions</h3>
          {resolvedSubmissions.length ? <div className="grid gap-4">{resolvedSubmissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)}</div> : <p className="rounded-xl border bg-white px-4 py-8 text-center text-sm text-slate-600">No resolved submissions yet.</p>}
        </section>
      </div>
    </ModulePage>
  );
}
