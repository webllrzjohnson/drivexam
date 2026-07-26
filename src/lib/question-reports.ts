import { QuestionReportReason, type QuestionReport } from "@prisma/client";

const reasonLabels: Record<QuestionReportReason, string> = {
  INCORRECT_ANSWER: "Incorrect answer",
  CONFUSING_EXPLANATION: "Confusing explanation",
  TYPO_GRAMMAR: "Typo / grammar",
  OUTDATED_RULE: "Outdated rule",
  IMAGE_SIGN_ISSUE: "Image / sign issue",
  OTHER: "Other",
};

const reasons = [
  QuestionReportReason.INCORRECT_ANSWER,
  QuestionReportReason.CONFUSING_EXPLANATION,
  QuestionReportReason.TYPO_GRAMMAR,
  QuestionReportReason.OUTDATED_RULE,
  QuestionReportReason.IMAGE_SIGN_ISSUE,
  QuestionReportReason.OTHER,
] as const;

type QuestionReportForm = {
  questionId: string;
  reason: QuestionReportReason;
  comment: string | null;
  reporterEmail: string | null;
};

type SummaryReport = Pick<QuestionReport, "id" | "reason" | "resolvedAt" | "createdAt">;

function optionalTrim(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function getQuestionReportReasonOptions() {
  return reasons.map((reason) => ({ value: reason, label: reasonLabels[reason] }));
}

export function getQuestionReportReasonLabel(reason: QuestionReportReason) {
  return reasonLabels[reason];
}

export function parseQuestionReportForm(formData: FormData): QuestionReportForm {
  const questionId = optionalTrim(formData.get("questionId"));
  if (!questionId) throw new Error("Choose a question to report.");

  const reason = optionalTrim(formData.get("reason"));
  if (!reason || !reasons.includes(reason as QuestionReportReason)) throw new Error("Choose a valid report reason.");

  const comment = optionalTrim(formData.get("comment"));
  if (reason === QuestionReportReason.OTHER && (!comment || comment.length < 8)) throw new Error("Add a short comment for other reports.");

  const reporterEmail = optionalTrim(formData.get("reporterEmail"))?.toLowerCase() ?? null;

  return {
    questionId,
    reason: reason as QuestionReportReason,
    comment,
    reporterEmail,
  };
}

export function buildQuestionReportSummary(reports: SummaryReport[]) {
  const reasonCountMap = new Map<QuestionReportReason, number>();
  for (const report of reports) reasonCountMap.set(report.reason, (reasonCountMap.get(report.reason) ?? 0) + 1);

  return {
    openCount: reports.filter((report) => !report.resolvedAt).length,
    resolvedCount: reports.filter((report) => report.resolvedAt).length,
    reasonCounts: Array.from(reasonCountMap.entries())
      .map(([reason, count]) => ({ reason, label: reasonLabels[reason], count }))
      .sort((a, b) => b.count - a.count || reasons.indexOf(a.reason) - reasons.indexOf(b.reason)),
  };
}
