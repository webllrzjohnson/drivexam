import type { LicenseStage, QuestionType } from "@prisma/client";

export type QuizQuestionInput = {
  id: string;
  prompt: string;
  explanation: string;
  stage: LicenseStage;
  type: QuestionType;
  category: { name: string } | null;
  assets: Array<{ asset: { path: string; title: string | null; filename?: string } }>;
  choices: Array<{
    id: string;
    text: string | null;
    isCorrect: boolean;
    sortOrder: number;
    asset: { path: string; title: string | null; filename?: string } | null;
  }>;
};

export type QuizChoiceView = {
  id: string;
  text: string | null;
  isCorrect: boolean;
  asset: { path: string; title: string } | null;
};

export type QuizQuestionView = {
  id: string;
  prompt: string;
  explanation: string;
  stage: LicenseStage;
  type: QuestionType;
  categoryName: string | null;
  assets: Array<{ path: string; title: string }>;
  choices: QuizChoiceView[];
};

export type QuizScoreResult = {
  correctCount: number;
  totalCount: number;
  percent: number;
  review: Array<{
    questionId: string;
    isCorrect: boolean;
    selectedChoiceIds: string[];
    correctChoiceIds: string[];
  }>;
};

function sortedUnique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function sameChoiceSet(left: string[], right: string[]) {
  const a = sortedUnique(left);
  const b = sortedUnique(right);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function buildQuizQuestionViews(questions: QuizQuestionInput[]): QuizQuestionView[] {
  return questions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    explanation: question.explanation,
    stage: question.stage,
    type: question.type,
    categoryName: question.category?.name ?? null,
    assets: question.assets.map(({ asset }) => ({ path: asset.path, title: asset.title ?? asset.filename ?? "Question image" })),
    choices: [...question.choices]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((choice) => ({
        id: choice.id,
        text: choice.text,
        isCorrect: choice.isCorrect,
        asset: choice.asset ? { path: choice.asset.path, title: choice.asset.title ?? choice.asset.filename ?? "Choice image" } : null,
      })),
  }));
}

export function scoreQuizAnswers(questions: QuizQuestionView[], selectedChoiceIdsByQuestion: Record<string, string[]>): QuizScoreResult {
  const review = questions.map((question) => {
    const selectedChoiceIds = sortedUnique(selectedChoiceIdsByQuestion[question.id] ?? []);
    const correctChoiceIds = sortedUnique(question.choices.filter((choice) => choice.isCorrect).map((choice) => choice.id));
    return {
      questionId: question.id,
      isCorrect: sameChoiceSet(selectedChoiceIds, correctChoiceIds),
      selectedChoiceIds,
      correctChoiceIds,
    };
  });
  const correctCount = review.filter((row) => row.isCorrect).length;
  const totalCount = questions.length;

  return {
    correctCount,
    totalCount,
    percent: totalCount ? Math.round((correctCount / totalCount) * 100) : 0,
    review,
  };
}
