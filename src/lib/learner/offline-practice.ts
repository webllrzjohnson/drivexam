import type { LicenseStage } from "@prisma/client";
import { z } from "zod";

import { scoreQuizAnswers, type QuizQuestionView } from "@/lib/learner/quiz";

const OFFLINE_PACK_SCHEMA_VERSION = 1;
const OFFLINE_ATTEMPT_SCHEMA_VERSION = 1;
const MAX_SYNC_ATTEMPTS = 10;
const MAX_QUESTIONS_PER_ATTEMPT = 50;
const MAX_ATTEMPT_AGE_DAYS = 180;
const MAX_FUTURE_SKEW_DAYS = 1;

const offlineAssetSchema = z.object({
  path: z.string().min(1).max(1_000),
  title: z.string().min(1).max(500),
});

const offlineQuestionSchema = z.object({
  id: z.string().min(1).max(128),
  publicId: z.string().min(1).max(128),
  prompt: z.string().min(1).max(2_000),
  explanation: z.string().min(1).max(5_000),
  stage: z.enum(["G1", "G2", "G"]),
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "MULTI_SELECT"]),
  categoryName: z.string().max(500).nullable(),
  assets: z.array(offlineAssetSchema).max(10),
  choices: z.array(z.object({
    id: z.string().min(1).max(128),
    publicId: z.string().min(1).max(128),
    text: z.string().max(1_000).nullable(),
    isCorrect: z.boolean(),
    asset: offlineAssetSchema.nullable(),
  })).min(2).max(10),
});

const offlinePackSchema = z.object({
  schemaVersion: z.literal(OFFLINE_PACK_SCHEMA_VERSION),
  version: z.string().min(1).max(128),
  generatedAt: z.string().datetime(),
  questions: z.array(offlineQuestionSchema).min(1).max(250),
});

const offlineAnswerSchema = z.object({
  questionId: z.string().min(1).max(128),
  questionPublicId: z.string().min(1).max(128),
  questionPrompt: z.string().min(1).max(2_000),
  selectedChoiceIds: z.array(z.string().min(1).max(128)).max(10),
  selectedChoicePublicIds: z.array(z.string().min(1).max(128)).max(10),
  selectedChoiceTexts: z.array(z.string().min(1).max(1_000)).max(10),
});

const offlineSyncAttemptSchema = z.object({
  schemaVersion: z.literal(OFFLINE_ATTEMPT_SCHEMA_VERSION),
  clientAttemptId: z.string().uuid(),
  createdAt: z.string().datetime(),
  packVersion: z.string().min(1).max(128),
  stage: z.enum(["G1", "G2", "G"]),
  answers: z.array(offlineAnswerSchema).min(1).max(MAX_QUESTIONS_PER_ATTEMPT),
});

const offlineSyncPayloadSchema = z.object({
  attempts: z.array(offlineSyncAttemptSchema).min(1).max(MAX_SYNC_ATTEMPTS, "At most 10 offline attempts can be synchronized at once."),
});

export type OfflineQuestionPack = {
  schemaVersion: typeof OFFLINE_PACK_SCHEMA_VERSION;
  version: string;
  generatedAt: string;
  questions: QuizQuestionView[];
};

export type OfflineSyncAttempt = z.infer<typeof offlineSyncAttemptSchema>;

export type StoredOfflineAttempt = OfflineSyncAttempt & {
  status: "pending" | "synced";
  correctCount: number;
  totalCount: number;
  percent: number;
  syncedAt?: string;
  syncNote?: string;
};

export class OfflineRequestTooLargeError extends Error {
  constructor() {
    super("Offline synchronization request is too large.");
    this.name = "OfflineRequestTooLargeError";
  }
}

export async function readBoundedRequestText(request: Request, maxBytes: number) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) throw new OfflineRequestTooLargeError();
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let byteCount = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteCount += value.byteLength;
      if (byteCount > maxBytes) {
        await reader.cancel();
        throw new OfflineRequestTooLargeError();
      }
      body += decoder.decode(value, { stream: true });
    }
    return body + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function buildOfflinePack({ questions, generatedAt = new Date() }: { questions: QuizQuestionView[]; generatedAt?: Date }): OfflineQuestionPack {
  if (questions.some((question) => !question.publicId || question.choices.some((choice) => !choice.publicId))) {
    throw new Error("Offline packs require durable question and choice identities.");
  }
  const fingerprint = questions.map((question) => ({
    publicId: question.publicId,
    prompt: question.prompt,
    explanation: question.explanation,
    stage: question.stage,
    type: question.type,
    categoryName: question.categoryName,
    assets: question.assets,
    choices: question.choices.map((choice) => ({
      publicId: choice.publicId,
      text: choice.text,
      isCorrect: choice.isCorrect,
      asset: choice.asset,
    })),
  }));

  return {
    schemaVersion: OFFLINE_PACK_SCHEMA_VERSION,
    version: `offline-v${OFFLINE_PACK_SCHEMA_VERSION}-${stableHash(JSON.stringify(fingerprint))}`,
    generatedAt: generatedAt.toISOString(),
    questions,
  };
}

export async function createOfflinePackResponse(loadQuestions: () => Promise<QuizQuestionView[]>, generatedAt = new Date()) {
  const questions = await loadQuestions();
  return Response.json(buildOfflinePack({ questions, generatedAt }), {
    headers: { "Cache-Control": "no-store" },
  });
}

export function parseOfflinePack(input: unknown): OfflineQuestionPack {
  const result = offlinePackSchema.safeParse(input);
  if (!result.success) throw new Error("Invalid offline question pack.");
  return result.data;
}

export function buildOfflineAttempt({
  clientAttemptId,
  createdAt = new Date(),
  packVersion,
  questions,
  selectedChoiceIdsByQuestion,
}: {
  clientAttemptId: string;
  createdAt?: Date;
  packVersion: string;
  questions: QuizQuestionView[];
  selectedChoiceIdsByQuestion: Record<string, string[]>;
}): StoredOfflineAttempt {
  if (!questions.length) throw new Error("An offline attempt needs at least one question.");
  const stage = questions[0].stage;
  if (questions.some((question) => question.stage !== stage)) throw new Error("An offline attempt cannot mix licence stages.");

  const score = scoreQuizAnswers(questions, selectedChoiceIdsByQuestion);
  return {
    schemaVersion: OFFLINE_ATTEMPT_SCHEMA_VERSION,
    clientAttemptId,
    createdAt: createdAt.toISOString(),
    packVersion,
    stage,
    answers: questions.map((question) => {
      const selectedChoiceIds = Array.from(new Set(selectedChoiceIdsByQuestion[question.id] ?? []));
      const selectedIdSet = new Set(selectedChoiceIds);
      return {
        questionId: question.id,
        questionPublicId: question.publicId as string,
        questionPrompt: question.prompt,
        selectedChoiceIds,
        selectedChoicePublicIds: question.choices
          .filter((choice) => selectedIdSet.has(choice.id))
          .map((choice) => choice.publicId as string),
        selectedChoiceTexts: question.choices
          .filter((choice) => selectedIdSet.has(choice.id) && choice.text)
          .map((choice) => choice.text as string),
      };
    }),
    status: "pending",
    correctCount: score.correctCount,
    totalCount: score.totalCount,
    percent: score.percent,
  };
}

export function parseOfflineSyncPayload(input: unknown) {
  return offlineSyncPayloadSchema.parse(input);
}

export function resolveOfflineAttempt(questions: QuizQuestionView[], attempt: OfflineSyncAttempt) {
  const questionByPublicId = new Map(questions.flatMap((question) => question.publicId ? [[question.publicId, question] as const] : []));
  const resolvedQuestions: QuizQuestionView[] = [];
  const selectedChoiceIdsByQuestion: Record<string, string[]> = {};
  let skippedQuestionCount = 0;

  for (const answer of attempt.answers) {
    const question = questionByPublicId.get(answer.questionPublicId);
    if (!question || question.stage !== attempt.stage || resolvedQuestions.some((candidate) => candidate.id === question.id)) {
      skippedQuestionCount += 1;
      continue;
    }

    const selectedIdSet = new Set(answer.selectedChoiceIds);
    const selectedPublicIdSet = new Set(answer.selectedChoicePublicIds);
    const resolvedChoiceIds = question.choices
      .filter((choice) => choice.publicId && selectedPublicIdSet.has(choice.publicId))
      .map((choice) => choice.id);
    const expectedChoiceCount = selectedPublicIdSet.size;
    if (
      selectedPublicIdSet.size !== answer.selectedChoicePublicIds.length
      || selectedIdSet.size !== answer.selectedChoiceIds.length
      || selectedIdSet.size !== expectedChoiceCount
      || resolvedChoiceIds.length !== expectedChoiceCount
    ) {
      skippedQuestionCount += 1;
      continue;
    }
    selectedChoiceIdsByQuestion[question.id] = resolvedChoiceIds;
    resolvedQuestions.push(question);
  }

  return { questions: resolvedQuestions, selectedChoiceIdsByQuestion, skippedQuestionCount };
}

export function validateOfflineAttemptDate(value: string, now = new Date()) {
  const candidate = new Date(value);
  const minimum = now.getTime() - MAX_ATTEMPT_AGE_DAYS * 24 * 60 * 60 * 1_000;
  const maximum = now.getTime() + MAX_FUTURE_SKEW_DAYS * 24 * 60 * 60 * 1_000;
  return Number.isFinite(candidate.getTime()) && candidate.getTime() >= minimum && candidate.getTime() <= maximum ? candidate : null;
}

export function getOfflinePackAssetPaths(pack: OfflineQuestionPack) {
  return Array.from(new Set(pack.questions.flatMap((question) => [
    ...question.assets.map((asset) => asset.path),
    ...question.choices.flatMap((choice) => choice.asset?.path ? [choice.asset.path] : []),
  ])));
}

export function getOfflineStageQuestionCount(pack: OfflineQuestionPack, stage: LicenseStage) {
  return pack.questions.filter((question) => question.stage === stage).length;
}
