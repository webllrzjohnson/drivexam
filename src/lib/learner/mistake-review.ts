import type { LicenseStage } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import type { MistakeHistoryAnswer } from "@/lib/learner/progress";

type MistakeHistoryRow = {
  answerId: string;
  questionId: string;
  categoryName: string;
  stage: string;
  isCorrect: boolean;
  createdAt: Date;
  attemptCreatedAt: Date;
  missedCount: number;
};

export async function getMistakeReviewHistory(userId: string): Promise<MistakeHistoryAnswer[]> {
  const rows = await db.$queryRaw<MistakeHistoryRow[]>(Prisma.sql`
    WITH ranked AS (
      SELECT
        answer.id AS "answerId",
        answer."questionId" AS "questionId",
        COALESCE(category.name, answer."categoryName", 'Uncategorized') AS "categoryName",
        question.stage::text AS stage,
        answer."isCorrect" AS "isCorrect",
        answer."createdAt" AS "createdAt",
        attempt."createdAt" AS "attemptCreatedAt",
        (COUNT(*) FILTER (WHERE NOT answer."isCorrect") OVER (
          PARTITION BY answer."questionId"
        ))::int AS "missedCount",
        ROW_NUMBER() OVER (
          PARTITION BY answer."questionId"
          ORDER BY attempt."createdAt" DESC, answer."createdAt" DESC, answer.id DESC
        ) AS "answerRank"
      FROM "QuizAttemptAnswer" answer
      INNER JOIN "QuizAttempt" attempt ON attempt.id = answer."attemptId"
      INNER JOIN "Question" question ON question.id = answer."questionId"
      LEFT JOIN "Category" category ON category.id = question."categoryId"
      WHERE attempt."userId" = ${userId}
        AND question.status = 'PUBLISHED'
    )
    SELECT
      ranked."answerId",
      ranked."questionId",
      ranked."categoryName",
      ranked.stage,
      ranked."isCorrect",
      ranked."createdAt",
      ranked."attemptCreatedAt",
      ranked."missedCount"
    FROM ranked
    WHERE ranked."answerRank" <= 2
      AND ranked."missedCount" > 0
    ORDER BY ranked."attemptCreatedAt" ASC, ranked."createdAt" ASC, ranked."answerId" ASC
  `);

  return rows.map((row) => ({
    answerId: row.answerId,
    questionId: row.questionId,
    categoryName: row.categoryName,
    stage: row.stage as LicenseStage,
    isCorrect: row.isCorrect,
    createdAt: row.createdAt,
    attemptCreatedAt: row.attemptCreatedAt,
    missedCount: row.missedCount,
  }));
}
