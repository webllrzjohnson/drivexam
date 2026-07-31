import type { LicenseStage, QuestionType } from "@prisma/client";

export type QuizQuestionInput = {
  id: string;
  publicId?: string;
  prompt: string;
  explanation: string;
  stage: LicenseStage;
  type: QuestionType;
  category: { name: string } | null;
  assets: Array<{ asset: { path: string; title: string | null; filename?: string } }>;
  choices: Array<{
    id: string;
    publicId?: string;
    text: string | null;
    isCorrect: boolean;
    sortOrder: number;
    asset: { path: string; title: string | null; filename?: string } | null;
  }>;
};

export type QuizChoiceView = {
  id: string;
  publicId?: string;
  text: string | null;
  isCorrect: boolean;
  asset: { path: string; title: string } | null;
};

export type QuizQuestionView = {
  id: string;
  publicId?: string;
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

export type PracticeStageGuide = {
  title: string;
  description: string;
  questionTargetLabel: string;
  readinessTarget: string;
  emptyState: string;
  milestones: Array<{ title: string; detail: string }>;
};

export type RoadSignPracticeGuide = {
  title: string;
  description: string;
  assetLabel: string;
  questionLabel: string;
  actions: Array<{ label: string; href: string }>;
};

export type RoadSignFlashcard = {
  title: string;
  path: string;
  description: string | null;
};

export type RoadSignFlashcardGroup = {
  key: "all" | "regulatory" | "warning" | "construction" | "parking" | "bicycle-pedestrian";
  label: string;
  cards: RoadSignFlashcard[];
};

type PracticeStageGuideInput = {
  stage: LicenseStage;
  categoryCount: number;
  questionCount: number;
};

export type PracticeQuestionSet<T> = {
  questions: T[];
  activeSet: number;
  totalSets: number;
  totalCount: number;
  pageSize: number;
};

export type QuizNavigationState = {
  activeIndex: number;
  questionNumber: number;
  isFirst: boolean;
  isLast: boolean;
  previousIndex: number;
  nextIndex: number;
};

type PracticeQuestionSetInput = {
  requestedSet?: number;
  pageSize?: number;
};

type BalancedPracticeQuestionSetInput = PracticeQuestionSetInput & {
  seed: string;
};

function sortedUnique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function sameChoiceSet(left: string[], right: string[]) {
  const a = sortedUnique(left);
  const b = sortedUnique(right);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function stableHash(value: string) {
  let hash = 0;
  for (const character of value) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  return Math.abs(hash);
}

function rotateByStableSeed<T>(items: T[], seed: string) {
  if (items.length < 2) return items;
  const offset = stableHash(seed) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

export function buildQuizNavigationState(totalCount: number, requestedIndex: number): QuizNavigationState {
  const lastIndex = Math.max(0, totalCount - 1);
  const activeIndex = Math.min(Math.max(0, Math.floor(requestedIndex) || 0), lastIndex);
  return {
    activeIndex,
    questionNumber: totalCount ? activeIndex + 1 : 0,
    isFirst: activeIndex === 0,
    isLast: activeIndex === lastIndex,
    previousIndex: Math.max(0, activeIndex - 1),
    nextIndex: Math.min(lastIndex, activeIndex + 1),
  };
}

export function buildQuizQuestionViews(questions: QuizQuestionInput[]): QuizQuestionView[] {
  return questions.map((question) => ({
    id: question.id,
    ...(question.publicId ? { publicId: question.publicId } : {}),
    prompt: question.prompt,
    explanation: question.explanation,
    stage: question.stage,
    type: question.type,
    categoryName: question.category?.name ?? null,
    assets: question.assets.map(({ asset }) => ({ path: asset.path, title: asset.title ?? asset.filename ?? "Question image" })),
    choices: rotateByStableSeed([...question.choices].sort((a, b) => a.sortOrder - b.sortOrder), question.id)
      .map((choice) => ({
        id: choice.id,
        ...(choice.publicId ? { publicId: choice.publicId } : {}),
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

export function buildPracticeQuestionSet<T>(questions: T[], { pageSize = 20, requestedSet = 1 }: PracticeQuestionSetInput): PracticeQuestionSet<T> {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalCount = questions.length;
  const totalSets = Math.max(1, Math.ceil(totalCount / safePageSize));
  const activeSet = Math.min(Math.max(1, Math.floor(requestedSet) || 1), totalSets);
  const start = (activeSet - 1) * safePageSize;

  return {
    questions: questions.slice(start, start + safePageSize),
    activeSet,
    totalSets,
    totalCount,
    pageSize: safePageSize,
  };
}

export function buildBalancedPracticeQuestionSet<T extends { categoryName: string | null }>(
  questions: T[],
  { pageSize = 20, requestedSet = 1, seed }: BalancedPracticeQuestionSetInput,
): PracticeQuestionSet<T> {
  const groups = new Map<string, T[]>();
  for (const question of questions) {
    const key = question.categoryName ?? "Other";
    groups.set(key, [...(groups.get(key) ?? []), question]);
  }

  const queues = [...groups.entries()].map(([category, items]) => rotateByStableSeed(items, `${seed}:${category}`));
  const balanced: T[] = [];
  for (let index = 0; balanced.length < questions.length; index += 1) {
    for (const queue of queues) {
      const question = queue[index];
      if (question) balanced.push(question);
    }
  }

  return buildPracticeQuestionSet(balanced, { pageSize, requestedSet });
}

const stageGuideCopy: Record<LicenseStage, Pick<PracticeStageGuide, "title" | "description" | "readinessTarget">> = {
  G1: {
    title: "G1 knowledge test practice",
    description: "Build confidence with Ontario road signs, right-of-way rules, penalties, and safe-driving basics before the written test.",
    readinessTarget: "Aim for 80%+ twice before booking",
  },
  G2: {
    title: "G2 road test prep",
    description: "Practice the decisions examiners watch for: observation, lane position, turns, parking, speed control, and calm hazard response.",
    readinessTarget: "Aim for consistent safe choices before your road test",
  },
  G: {
    title: "Full G road test prep",
    description: "Use road-test preparation scenarios to practise highway readiness, observation, lane changes, merging, spacing, and route decisions. These are learning scenarios, not an official written test.",
    readinessTarget: "Aim for strong highway and city-driving consistency",
  },
};

export function buildPracticeStageGuide({ stage, categoryCount, questionCount }: PracticeStageGuideInput): PracticeStageGuide {
  const copy = stageGuideCopy[stage];
  return {
    ...copy,
    questionTargetLabel: questionCount > 0 ? `${questionCount}-question set loaded` : `No published ${stage} questions yet`,
    emptyState: `No published ${stage} practice questions yet. Add and publish questions from Admin → Questions to make this practice set useful.`,
    milestones: [
      { title: "Learn the rule", detail: categoryCount > 0 ? `Choose from ${categoryCount} active topic areas or practice everything together.` : "Start with core topics, then publish stage-specific categories." },
      { title: "Answer with feedback", detail: "Check answers only after you commit, then read the plain-English explanation." },
      { title: "Save and fix weak areas", detail: "Verified learners can save results so the dashboard recommends the next focus area." },
    ],
  };
}

export function buildRoadSignPracticeGuide({ assetCount, questionCount }: { assetCount: number; questionCount: number }): RoadSignPracticeGuide {
  return {
    title: "Ontario road signs only",
    description: "Review Ontario road signs as flashcards, then jump straight into image-recognition practice questions.",
    assetLabel: `${assetCount} Ontario sign image${assetCount === 1 ? "" : "s"}`,
    questionLabel: `${questionCount} image question${questionCount === 1 ? "" : "s"}`,
    actions: [
      { label: "Start signs quiz", href: "/practice?stage=G1" },
      { label: "Review G1 practice", href: "/practice?stage=G1" },
    ],
  };
}

const roadSignGroupDefinitions: Array<Omit<RoadSignFlashcardGroup, "cards"> & { matches: string[] }> = [
  { key: "regulatory", label: "Regulatory", matches: ["stop", "yield", "maximum", "one way", "do not enter", "keep right", "turn"] },
  { key: "warning", label: "Warning", matches: ["ahead", "slippery", "curve", "merge", "winding", "two-way", "railway", "roundabout"] },
  { key: "construction", label: "Construction", matches: ["construction", "road work", "detour"] },
  { key: "parking", label: "Parking", matches: ["parking", "stopping", "accessible"] },
  { key: "bicycle-pedestrian", label: "Bicycle / pedestrian", matches: ["bicycle", "pedestrian", "school crossing", "crossover"] },
];

function cardSearchText(card: RoadSignFlashcard) {
  return `${card.title} ${card.path} ${card.description ?? ""}`.toLowerCase();
}

export function buildRoadSignFlashcardGroups(cards: RoadSignFlashcard[]): RoadSignFlashcardGroup[] {
  return [
    { key: "all", label: "All signs", cards },
    ...roadSignGroupDefinitions.map(({ key, label, matches }) => ({
      key,
      label,
      cards: cards.filter((card) => matches.some((match) => cardSearchText(card).includes(match))),
    })),
  ];
}
