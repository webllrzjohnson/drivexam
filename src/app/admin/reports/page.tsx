import { ModulePage } from "@/components/admin/module-page";
import { deleteQuestionReport, reopenQuestionReport, resolveQuestionReport } from "@/app/admin/reports/actions";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { buildQuestionReportSummary, getQuestionReportReasonLabel } from "@/lib/question-reports";

type ReportsPageProps = {
  searchParams: Promise<{ resolved?: string; reopened?: string; deleted?: string }>;
};

type ReportRow = Awaited<ReturnType<typeof getReports>>[number];

async function getReports() {
  return db.questionReport.findMany({
    include: {
      question: { include: { category: true } },
    },
    orderBy: [{ resolvedAt: "asc" }, { createdAt: "desc" }],
    take: 100,
  });
}

function formatDate(date: Date | null) {
  return date ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short" }).format(date) : "Open";
}

function ReportCard({ report }: { report: ReportRow }) {
  const isResolved = Boolean(report.resolvedAt);
  return (
    <div className="space-y-4 rounded-xl border bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-800">{getQuestionReportReasonLabel(report.reason)}</p>
          <h3 className="text-lg font-semibold text-slate-950">{report.question.prompt}</h3>
          <p className="text-sm text-slate-600">
            {report.question.stage} · {report.question.category?.name ?? "Uncategorized"} · {formatDate(report.createdAt)}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isResolved ? "bg-slate-100 text-slate-700" : "bg-amber-100 text-amber-900"}`}>
          {isResolved ? "Resolved" : "Open"}
        </span>
      </div>

      {report.comment ? <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{report.comment}</p> : null}
      <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <p><span className="font-medium text-slate-900">Reporter:</span> {report.reporterEmail ?? "Anonymous"}</p>
        <p><span className="font-medium text-slate-900">Resolved:</span> {formatDate(report.resolvedAt)}</p>
      </div>
      <details className="rounded-lg border bg-slate-50 p-3 text-sm">
        <summary className="cursor-pointer font-medium text-slate-900">Question explanation</summary>
        <p className="mt-2 text-slate-700">{report.question.explanation}</p>
      </details>

      <div className="flex flex-wrap gap-2">
        <form action={isResolved ? reopenQuestionReport : resolveQuestionReport}>
          <input name="id" type="hidden" value={report.id} />
          <Button type="submit" variant={isResolved ? "outline" : "default"}>{isResolved ? "Reopen" : "Mark resolved"}</Button>
        </form>
        <form action={deleteQuestionReport}>
          <input name="id" type="hidden" value={report.id} />
          <Button type="submit" variant="outline">Delete</Button>
        </form>
      </div>
    </div>
  );
}

export default async function Page({ searchParams }: ReportsPageProps) {
  const [params, reports] = await Promise.all([searchParams, getReports()]);
  const summary = buildQuestionReportSummary(reports);
  const openReports = reports.filter((report) => !report.resolvedAt);
  const resolvedReports = reports.filter((report) => report.resolvedAt);

  return (
    <ModulePage slug="reports">
      <div className="space-y-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <p className="font-semibold">Question report triage is live.</p>
          <p>Review learner reports for incorrect answers, confusing explanations, typos, outdated rules, and image issues.</p>
        </div>
        {params.resolved === "report" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Report resolved.</p> : null}
        {params.reopened === "report" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Report reopened.</p> : null}
        {params.deleted === "report" ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">Report deleted.</p> : null}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-600">Open reports</p>
            <p className="text-3xl font-bold text-amber-800">{summary.openCount}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-600">Resolved reports</p>
            <p className="text-3xl font-bold text-green-900">{summary.resolvedCount}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-600">Top reason</p>
            <p className="text-lg font-semibold text-slate-950">{summary.reasonCounts[0]?.label ?? "No reports"}</p>
          </div>
        </div>

        {summary.reasonCounts.length ? (
          <div className="flex flex-wrap gap-2 text-sm">
            {summary.reasonCounts.map((item) => <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700" key={item.reason}>{item.label}: {item.count}</span>)}
          </div>
        ) : null}

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Open queue</h3>
          {openReports.length ? <div className="grid gap-4">{openReports.map((report) => <ReportCard key={report.id} report={report} />)}</div> : <p className="rounded-xl border bg-white px-4 py-8 text-center text-sm text-slate-600">No open reports.</p>}
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Resolved reports</h3>
          {resolvedReports.length ? <div className="grid gap-4">{resolvedReports.map((report) => <ReportCard key={report.id} report={report} />)}</div> : <p className="rounded-xl border bg-white px-4 py-8 text-center text-sm text-slate-600">No resolved reports yet.</p>}
        </section>
      </div>
    </ModulePage>
  );
}
