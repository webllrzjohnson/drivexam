import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { getCurrentUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { synchronizeOfflineAttempts } from "@/lib/learner/offline-sync";
import { OfflineRequestTooLargeError, readBoundedRequestText, type OfflineSyncAttempt } from "@/lib/learner/offline-practice";
import { buildQuizQuestionViews } from "@/lib/learner/quiz";

const MAX_REQUEST_BYTES = 512 * 1_024;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in to synchronize offline attempts." }, { status: 401 });
  if (!user.emailVerified) return Response.json({ error: "Verify your email before synchronizing progress." }, { status: 403 });

  let input: unknown;
  try {
    const body = await readBoundedRequestText(request, MAX_REQUEST_BYTES);
    input = JSON.parse(body);
  } catch (error) {
    if (error instanceof OfflineRequestTooLargeError) {
      return Response.json({ error: "Offline attempt batch is too large." }, { status: 413 });
    }
    return Response.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  try {
    const result = await synchronizeOfflineAttempts(input, {
      hasAttempt: async (clientAttemptId) => Boolean(await db.quizAttempt.findUnique({
        where: { userId_clientAttemptId: { userId: user.id, clientAttemptId } },
        select: { id: true },
      })),
      loadQuestions: async (attempt: OfflineSyncAttempt) => {
        const publicIds = attempt.answers.map((answer) => answer.questionPublicId);
        const questions = await db.question.findMany({
          where: {
            stage: attempt.stage,
            status: "PUBLISHED",
            choices: { some: { isCorrect: true } },
            publicId: { in: publicIds },
          },
          include: {
            category: true,
            assets: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
            choices: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
          },
        });
        return buildQuizQuestionViews(questions);
      },
      saveAttempt: async (attempt) => {
        try {
          await db.quizAttempt.create({
            data: {
              userId: user.id,
              clientAttemptId: attempt.clientAttemptId,
              stage: attempt.stage,
              correctCount: attempt.correctCount,
              totalCount: attempt.totalCount,
              percent: attempt.percent,
              createdAt: attempt.createdAt,
              answers: {
                create: attempt.answers.map((answer) => ({
                  questionId: answer.questionId,
                  categoryName: answer.categoryName,
                  isCorrect: answer.isCorrect,
                  selectedChoiceIds: answer.selectedChoiceIds,
                  correctChoiceIds: answer.correctChoiceIds,
                })),
              },
            },
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return;
          throw error;
        }
      },
    });

    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: "Invalid offline attempt data." }, { status: 422 });
    }
    console.error("Offline attempt synchronization failed.", error);
    return Response.json({ error: "Offline attempts could not be synchronized." }, { status: 500 });
  }
}
