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

export type MistakeHistoryAnswer = {
  answerId?: string;
  questionId: string | null;
  categoryName: string | null;
  stage: LicenseStage | null;
  isCorrect: boolean;
  createdAt: Date;
  attemptCreatedAt?: Date;
  missedCount?: number;
};

export type MistakeReviewItem = {
  questionId: string;
  categoryName: string;
  stage: LicenseStage | null;
  missedCount: number;
  correctStreak: number;
  lastAnsweredAt: Date;
};

export function buildMistakeReviewQueue(history: MistakeHistoryAnswer[]) {
  const byQuestion = new Map<string, MistakeHistoryAnswer[]>();
  for (const answer of history) {
    if (!answer.questionId) continue;
    const answers = byQuestion.get(answer.questionId);
    if (answers) answers.push(answer);
    else byQuestion.set(answer.questionId, [answer]);
  }

  const items: MistakeReviewItem[] = Array.from(byQuestion.entries()).flatMap(([questionId, answers]) => {
    const newestFirst = answers.sort((a, b) => {
      const attemptDifference = (b.attemptCreatedAt ?? b.createdAt).getTime() - (a.attemptCreatedAt ?? a.createdAt).getTime();
      if (attemptDifference) return attemptDifference;
      const answerDifference = b.createdAt.getTime() - a.createdAt.getTime();
      return answerDifference || (b.answerId ?? "").localeCompare(a.answerId ?? "");
    });
    const missedCount = Math.max(...newestFirst.map((answer) => answer.missedCount ?? 0), newestFirst.filter((answer) => !answer.isCorrect).length);
    let correctStreak = 0;
    for (const answer of newestFirst) {
      if (!answer.isCorrect) break;
      correctStreak += 1;
    }
    if (!missedCount || correctStreak >= 2) return [];
    const latest = newestFirst[0];
    return [{
      questionId,
      categoryName: latest.categoryName ?? "Uncategorized",
      stage: latest.stage,
      missedCount,
      correctStreak,
      lastAnsweredAt: latest.attemptCreatedAt ?? latest.createdAt,
    }];
  }).sort((a, b) => b.missedCount - a.missedCount || b.lastAnsweredAt.getTime() - a.lastAnsweredAt.getTime());

  const categoryCounts = new Map<string, number>();
  for (const item of items) categoryCounts.set(item.categoryName, (categoryCounts.get(item.categoryName) ?? 0) + 1);

  return {
    activeCount: items.length,
    items,
    byCategory: Array.from(categoryCounts.entries())
      .map(([categoryName, activeCount]) => ({ categoryName, activeCount }))
      .sort((a, b) => b.activeCount - a.activeCount || a.categoryName.localeCompare(b.categoryName)),
  };
}

export function filterMistakeReviewItems(
  items: MistakeReviewItem[],
  options: { stage: LicenseStage | null; categoryName: string | null; limit?: number },
) {
  return items
    .filter((item) => !options.stage || item.stage === options.stage)
    .filter((item) => !options.categoryName || item.categoryName === options.categoryName)
    .slice(0, options.limit ?? 20);
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
  mistakeReview?: ReturnType<typeof buildMistakeReviewQueue>;
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

export function buildDailyStudyPlan({ currentStage, mistakeReview, targetTestDate, today = new Date(), summary }: DailyStudyPlanInput): DailyStudyPlan {
  const stage = currentStage ?? "G1";
  const stageLabel = stageLabels[stage];
  const days = daysUntil(targetTestDate, today);
  const stageMistakes = mistakeReview?.items.filter((item) => item.stage === stage) ?? [];
  const activeByCategory = new Map<string, number>();
  for (const item of stageMistakes) activeByCategory.set(item.categoryName, (activeByCategory.get(item.categoryName) ?? 0) + 1);
  const activeFocusArea = Array.from(activeByCategory.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
  const focusArea = mistakeReview ? activeFocusArea ?? "Road signs and rules" : summary.weakAreas[0]?.categoryName ?? "Road signs and rules";

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
  const actions: DailyStudyPlanAction[] = activeFocusArea ? [
    { title: `Review ${activeFocusArea}`, detail: "Retry your most-missed category before another quiz.", href: `/mistake-review?stage=${stage}&category=${encodeURIComponent(activeFocusArea)}` },
    { title: `Take a ${quizSize} practice quiz`, detail: "Aim to beat your latest saved score.", href: `/practice?stage=${stage}` },
    { title: `Read one ${stage} knowledge lesson`, detail: "Use the lesson notes to close gaps before the next attempt.", href: "/blog" },
  ] : [
    { title: `Take a ${quizSize} practice quiz`, detail: "Keep your knowledge fresh and find the next area to improve.", href: `/practice?stage=${stage}` },
    stage === "G1"
      ? { title: "Take a realistic G1 mock exam", detail: "Check both signs and rules readiness under exam conditions.", href: "/g1-mock-exam" }
      : { title: `Review ${stage} road-test readiness`, detail: "Strengthen practical habits and checklist progress.", href: `/road-test?stage=${stage}` },
    { title: `Read one ${stage} knowledge lesson`, detail: "Use the lesson notes to reinforce safe decisions.", href: "/blog" },
  ];
  return {
    stageLabel,
    daysUntilTest: days,
    focusArea,
    readinessTone: getReadinessTone(summary, days),
    actions,
  };
}
