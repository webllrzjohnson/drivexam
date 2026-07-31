import { buildQuizAttemptRows, type QuizAttemptAnswerRow } from "@/lib/learner/progress";
import { scoreQuizAnswers, type QuizQuestionView } from "@/lib/learner/quiz";
import {
  parseOfflineSyncPayload,
  resolveOfflineAttempt,
  validateOfflineAttemptDate,
  type OfflineSyncAttempt,
} from "@/lib/learner/offline-practice";

export type OfflineAttemptSaveInput = {
  clientAttemptId: string;
  stage: OfflineSyncAttempt["stage"];
  createdAt: Date;
  correctCount: number;
  totalCount: number;
  percent: number;
  answers: QuizAttemptAnswerRow[];
};

type OfflineSyncDependencies = {
  now?: Date;
  hasAttempt: (clientAttemptId: string) => Promise<boolean>;
  loadQuestions: (attempt: OfflineSyncAttempt) => Promise<QuizQuestionView[]>;
  saveAttempt: (attempt: OfflineAttemptSaveInput) => Promise<void>;
};

export type OfflineSyncResult = {
  clientAttemptId: string;
  status: "synced" | "duplicate" | "stale";
  skippedQuestionCount: number;
  reason?: "invalid-date" | "retired-questions";
};

export async function synchronizeOfflineAttempts(input: unknown, dependencies: OfflineSyncDependencies) {
  const payload = parseOfflineSyncPayload(input);
  const now = dependencies.now ?? new Date();
  const results: OfflineSyncResult[] = [];

  for (const attempt of payload.attempts) {
    if (await dependencies.hasAttempt(attempt.clientAttemptId)) {
      results.push({ clientAttemptId: attempt.clientAttemptId, status: "duplicate", skippedQuestionCount: 0 });
      continue;
    }

    const createdAt = validateOfflineAttemptDate(attempt.createdAt, now);
    if (!createdAt) {
      results.push({
        clientAttemptId: attempt.clientAttemptId,
        status: "stale",
        skippedQuestionCount: 0,
        reason: "invalid-date",
      });
      continue;
    }

    const currentQuestions = await dependencies.loadQuestions(attempt);
    const resolved = resolveOfflineAttempt(currentQuestions, attempt);
    if (!resolved.questions.length || resolved.skippedQuestionCount > 0) {
      results.push({
        clientAttemptId: attempt.clientAttemptId,
        status: "stale",
        skippedQuestionCount: resolved.skippedQuestionCount || attempt.answers.length,
        reason: "retired-questions",
      });
      continue;
    }

    const score = scoreQuizAnswers(resolved.questions, resolved.selectedChoiceIdsByQuestion);
    await dependencies.saveAttempt({
      clientAttemptId: attempt.clientAttemptId,
      stage: attempt.stage,
      createdAt,
      correctCount: score.correctCount,
      totalCount: score.totalCount,
      percent: score.percent,
      answers: buildQuizAttemptRows(resolved.questions, resolved.selectedChoiceIdsByQuestion),
    });

    results.push({
      clientAttemptId: attempt.clientAttemptId,
      status: "synced",
      skippedQuestionCount: resolved.skippedQuestionCount,
    });
  }

  return { results };
}
