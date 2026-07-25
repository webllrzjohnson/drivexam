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

type ProgressSummary = ReturnType<typeof summarizeQuizProgress>;

type DailyStudyPlanInput = {
  currentStage: LicenseStage | null;
  targetTestDate: Date | null;
  today?: Date;
  summary: ProgressSummary;
};

export type DailyStudyPlanAction = {
  title: string;
  detail: string;
  href: string;
};

export type DailyStudyPlan = {
  stageLabel: string;
  daysUntilTest: number | null;
  focusArea: string;
  readinessTone: "starter" | "steady" | "urgent" | "strong";
  actions: DailyStudyPlanAction[];
};

const stageLabels: Record<LicenseStage, string> = {
  G1: "G1 knowledge test",
  G2: "G2 road test",
  G: "Full G road test",
};

function daysUntil(targetTestDate: Date | null, today: Date) {
  if (!targetTestDate) return null;
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((targetTestDate.getTime() - today.getTime()) / millisecondsPerDay));
}

function getReadinessTone(summary: ProgressSummary, daysUntilTest: number | null): DailyStudyPlan["readinessTone"] {
  if (summary.attemptCount === 0) return "starter";
  if ((daysUntilTest !== null && daysUntilTest <= 7 && summary.latestPercent < 80) || summary.averagePercent < 60) return "urgent";
  if (summary.bestPercent >= 90 && summary.latestPercent >= 80 && summary.averagePercent >= 80) return "strong";
  return "steady";
}

export function buildDailyStudyPlan({ currentStage, targetTestDate, today = new Date(), summary }: DailyStudyPlanInput): DailyStudyPlan {
  const stage = currentStage ?? "G1";
  const stageLabel = stageLabels[stage];
  const days = daysUntil(targetTestDate, today);
  const focusArea = summary.weakAreas[0]?.categoryName ?? "Road signs and rules";

  if (summary.attemptCount === 0) {
    return {
      stageLabel,
      daysUntilTest: days,
      focusArea,
      readinessTone: "starter",
      actions: [
        { title: "Start with road signs and rules", detail: "Build the base before timing yourself.", href: "/practice" },
        { title: "Take a 10-question G1 practice quiz", detail: "Save the result so drivexam can find weak areas.", href: "/practice" },
        { title: "Save your result to unlock weak-area review", detail: "Signed-in, verified learners get a personalized plan.", href: "/dashboard" },
      ],
    };
  }

  const quizSize = stage === "G1" ? "20-question G1" : `${stage} readiness`;
  return {
    stageLabel,
    daysUntilTest: days,
    focusArea,
    readinessTone: getReadinessTone(summary, days),
    actions: [
      { title: `Review ${focusArea}`, detail: "Spend 10 minutes on the most-missed category before another quiz.", href: "/practice" },
      { title: `Take a ${quizSize} practice quiz`, detail: "Aim to beat your latest saved score.", href: "/practice" },
      { title: `Read one ${stage} knowledge lesson`, detail: "Use the lesson notes to close gaps before the next attempt.", href: "/blog" },
    ],
  };
}
