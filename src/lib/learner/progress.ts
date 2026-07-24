import type { LicenseStage } from "@prisma/client";

import { scoreQuizAnswers, type QuizQuestionView } from "@/lib/learner/quiz";

export type ProgressAttemptAnswerInput = {
  isCorrect: boolean;
  categoryName: string | null;
};

export type ProgressAttemptInput = {
  id: string;
  stage: LicenseStage;
  correctCount: number;
  totalCount: number;
  percent: number;
  createdAt: Date;
  answers: ProgressAttemptAnswerInput[];
};

export type QuizAttemptAnswerRow = {
  questionId: string;
  categoryName: string | null;
  isCorrect: boolean;
  selectedChoiceIds: string[];
  correctChoiceIds: string[];
};

export function buildQuizAttemptRows(questions: QuizQuestionView[], selectedChoiceIdsByQuestion: Record<string, string[]>): QuizAttemptAnswerRow[] {
  const score = scoreQuizAnswers(questions, selectedChoiceIdsByQuestion);
  const questionById = new Map(questions.map((question) => [question.id, question]));

  return score.review.map((row) => ({
    questionId: row.questionId,
    categoryName: questionById.get(row.questionId)?.categoryName ?? null,
    isCorrect: row.isCorrect,
    selectedChoiceIds: row.selectedChoiceIds,
    correctChoiceIds: row.correctChoiceIds,
  }));
}

export function summarizeQuizProgress(attempts: ProgressAttemptInput[]) {
  const attemptCount = attempts.length;
  const totalQuestionsAnswered = attempts.reduce((sum, attempt) => sum + attempt.totalCount, 0);
  const averagePercent = attemptCount ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percent, 0) / attemptCount) : 0;
  const bestPercent = attemptCount ? Math.max(...attempts.map((attempt) => attempt.percent)) : 0;
  const latest = [...attempts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  const missedByCategory = new Map<string, number>();

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      if (answer.isCorrect) continue;
      const categoryName = answer.categoryName ?? "Uncategorized";
      missedByCategory.set(categoryName, (missedByCategory.get(categoryName) ?? 0) + 1);
    }
  }

  const weakAreas = Array.from(missedByCategory.entries())
    .map(([categoryName, missedCount]) => ({ categoryName, missedCount }))
    .sort((a, b) => b.missedCount - a.missedCount || a.categoryName.localeCompare(b.categoryName))
    .slice(0, 5);

  return {
    attemptCount,
    averagePercent,
    bestPercent,
    latestPercent: latest?.percent ?? 0,
    totalQuestionsAnswered,
    weakAreas,
  };
}
