import { z } from "zod";

const contactSubmissionSchema = z.object({
  subject: z.preprocess(
    (value) => (value == null ? "" : value),
    z.string().trim().min(1, "Enter a subject.").min(5, "Subject must be at least 5 characters.").max(120, "Subject must be 120 characters or less."),
  ),
  message: z.preprocess(
    (value) => (value == null ? "" : value),
    z.string().trim().min(1, "Enter a message.").min(20, "Message must be at least 20 characters.").max(3000, "Message must be 3000 characters or less."),
  ),
});

export type ParsedContactSubmission = z.infer<typeof contactSubmissionSchema>;

type ContactSubmissionSummaryInput = {
  resolvedAt: Date | null;
  createdAt: Date;
};

export function parseContactSubmissionForm(formData: FormData): ParsedContactSubmission {
  const parsed = contactSubmissionSchema.safeParse({
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join(" "));
  }

  return parsed.data;
}

export function buildContactSubmissionSummary(submissions: ContactSubmissionSummaryInput[]) {
  return {
    totalCount: submissions.length,
    openCount: submissions.filter((submission) => !submission.resolvedAt).length,
    resolvedCount: submissions.filter((submission) => submission.resolvedAt).length,
    latestCreatedAt: submissions.reduce<Date | null>((latest, submission) => {
      if (!latest || submission.createdAt > latest) return submission.createdAt;
      return latest;
    }, null),
  };
}
