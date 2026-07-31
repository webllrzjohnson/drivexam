import { db } from "@/lib/db";
import { buildQuizQuestionViews } from "@/lib/learner/quiz";
import { createOfflinePackResponse } from "@/lib/learner/offline-practice";

export const dynamic = "force-dynamic";

export async function GET() {
  return createOfflinePackResponse(async () => {
    const questions = await db.question.findMany({
      where: {
        status: "PUBLISHED",
        choices: { some: { isCorrect: true } },
      },
      include: {
        category: true,
        assets: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
        choices: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
      },
      orderBy: [{ stage: "asc" }, { updatedAt: "desc" }],
      take: 250,
    });

    return buildQuizQuestionViews(questions);
  });
}
