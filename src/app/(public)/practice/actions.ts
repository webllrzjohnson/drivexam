"use server";

import { redirect } from "next/navigation";

import { requireVerifiedUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { buildQuizQuestionViews, scoreQuizAnswers } from "@/lib/learner/quiz";
import { buildQuizAttemptRows } from "@/lib/learner/progress";

function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseStage(value: FormDataEntryValue | null) {
  return value === "G2" || value === "G" ? value : "G1";
}

export async function saveQuizAttempt(formData: FormData) {
  const user = await requireVerifiedUser();
  const stage = parseStage(formData.get("stage"));
  const questionIds = parseJson<string[]>(formData.get("questionIds"), []);
  const selectedChoiceIdsByQuestion = parseJson<Record<string, string[]>>(formData.get("selectedChoiceIdsByQuestion"), {});
  const safeQuestionIds = Array.from(new Set(questionIds.filter(Boolean))).slice(0, 50);

  if (!safeQuestionIds.length) throw new Error("No quiz questions to save.");

  const questions = await db.question.findMany({
    where: {
      id: { in: safeQuestionIds },
      stage,
      status: "PUBLISHED",
      choices: { some: { isCorrect: true } },
    },
    include: {
      category: true,
      assets: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
      choices: { include: { asset: true }, orderBy: { sortOrder: "asc" } },
    },
  });
  const quizQuestions = buildQuizQuestionViews(questions);
  const score = scoreQuizAnswers(quizQuestions, selectedChoiceIdsByQuestion);
  const rows = buildQuizAttemptRows(quizQuestions, selectedChoiceIdsByQuestion);

  await db.quizAttempt.create({
    data: {
      userId: user.id,
      stage,
      correctCount: score.correctCount,
      totalCount: score.totalCount,
      percent: score.percent,
      answers: {
        create: rows.map((row) => ({
          questionId: row.questionId,
          categoryName: row.categoryName,
          isCorrect: row.isCorrect,
          selectedChoiceIds: row.selectedChoiceIds,
          correctChoiceIds: row.correctChoiceIds,
        })),
      },
    },
  });

  redirect("/dashboard?saved=quiz");
}
