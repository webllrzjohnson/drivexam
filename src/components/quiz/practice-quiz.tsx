"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { scoreQuizAnswers, type QuizQuestionView } from "@/lib/learner/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PracticeQuizProps = {
  questions: QuizQuestionView[];
};

function hasChoice(selection: Record<string, string[]>, questionId: string, choiceId: string) {
  return selection[questionId]?.includes(choiceId) ?? false;
}

function setSingleChoice(selection: Record<string, string[]>, questionId: string, choiceId: string) {
  return { ...selection, [questionId]: [choiceId] };
}

function toggleMultiChoice(selection: Record<string, string[]>, questionId: string, choiceId: string) {
  const current = selection[questionId] ?? [];
  const next = current.includes(choiceId) ? current.filter((id) => id !== choiceId) : [...current, choiceId];
  return { ...selection, [questionId]: next };
}

export function PracticeQuiz({ questions }: PracticeQuizProps) {
  const [selection, setSelection] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const result = useMemo(() => scoreQuizAnswers(questions, selection), [questions, selection]);
  const reviewByQuestion = new Map(result.review.map((row) => [row.questionId, row]));

  if (!questions.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-slate-600">
          No published practice questions yet. Add and publish questions from Admin → Questions.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {submitted ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle>Score: {result.correctCount}/{result.totalCount} ({result.percent}%)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-950">
            Review each explanation below, then try again when ready.
          </CardContent>
        </Card>
      ) : null}

      {questions.map((question, index) => {
        const isMulti = question.type === "MULTI_SELECT";
        const review = reviewByQuestion.get(question.id);
        return (
          <Card key={question.id}>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-800">
                Question {index + 1} · {question.stage}{question.categoryName ? ` · ${question.categoryName}` : ""}
              </p>
              <CardTitle className="text-xl leading-7">{question.prompt}</CardTitle>
              {isMulti ? <p className="text-sm text-slate-600">Select all correct answers.</p> : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {question.assets.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.assets.map((asset) => (
                    <Image alt={asset.title} className="max-h-56 rounded-xl border bg-white object-contain p-3" height={224} key={asset.path} src={asset.path} width={360} />
                  ))}
                </div>
              ) : null}

              <div className="space-y-3">
                {question.choices.map((choice) => {
                  const checked = hasChoice(selection, question.id, choice.id);
                  const isCorrectChoice = submitted && choice.isCorrect;
                  const isWrongSelected = submitted && checked && !choice.isCorrect;
                  return (
                    <label className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${isCorrectChoice ? "border-green-300 bg-green-50" : "bg-white"} ${isWrongSelected ? "border-red-300 bg-red-50" : ""}`} key={choice.id}>
                      <input
                        checked={checked}
                        name={`question-${question.id}`}
                        onChange={() => setSelection((current) => isMulti ? toggleMultiChoice(current, question.id, choice.id) : setSingleChoice(current, question.id, choice.id))}
                        type={isMulti ? "checkbox" : "radio"}
                      />
                      <span className="space-y-2">
                        {choice.text ? <span className="block">{choice.text}</span> : null}
                        {choice.asset ? <Image alt={choice.asset.title} className="max-h-32 rounded-lg border bg-white object-contain p-2" height={128} src={choice.asset.path} width={220} /> : null}
                      </span>
                    </label>
                  );
                })}
              </div>

              {submitted && review ? (
                <div className={`rounded-xl border p-4 text-sm ${review.isCorrect ? "border-green-200 bg-green-50 text-green-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
                  <p className="font-semibold">{review.isCorrect ? "Correct" : "Review this one"}</p>
                  <p>{question.explanation}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setSubmitted(true)} type="button">Check answers</Button>
        <Button onClick={() => { setSelection({}); setSubmitted(false); }} type="button" variant="outline">Try again</Button>
      </div>
    </div>
  );
}
