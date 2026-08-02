"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { saveQuizAttempt } from "@/app/(public)/practice/actions";
import { createQuestionReport } from "@/app/(public)/practice/report-actions";
import { buildQuizNavigationState, getOfficialOntarioSourceUrl, scoreG1MockExam, scoreQuizAnswers, type QuizQuestionView } from "@/lib/learner/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PracticeQuizProps = {
  questions: QuizQuestionView[];
  canSaveProgress: boolean;
  emptyState?: string;
  returnTo: string;
  stage: "G1" | "G2" | "G";
  experience?: "practice" | "g1-mock-exam";
  initialQuestionId?: string;
};

const reportReasonOptions = [
  { value: "INCORRECT_ANSWER", label: "Incorrect answer" },
  { value: "CONFUSING_EXPLANATION", label: "Confusing explanation" },
  { value: "TYPO_GRAMMAR", label: "Typo / grammar" },
  { value: "OUTDATED_RULE", label: "Outdated rule" },
  { value: "IMAGE_SIGN_ISSUE", label: "Image / sign issue" },
  { value: "OTHER", label: "Other" },
];

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

export function PracticeQuiz({ canSaveProgress, emptyState, experience = "practice", initialQuestionId, questions, returnTo, stage }: PracticeQuizProps) {
  const [selection, setSelection] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, questions.findIndex((candidate) => candidate.id === initialQuestionId)));
  const hasMounted = useRef(false);
  const result = useMemo(() => scoreQuizAnswers(questions, selection), [questions, selection]);
  const mockResult = useMemo(
    () => experience === "g1-mock-exam" ? scoreG1MockExam(questions, selection) : null,
    [experience, questions, selection],
  );
  const reviewByQuestion = new Map(result.review.map((row) => [row.questionId, row]));
  const navigation = buildQuizNavigationState(questions.length, activeIndex);
  const question = questions[navigation.activeIndex];
  const answeredCount = questions.filter((candidate) => (selection[candidate.id]?.length ?? 0) > 0).length;
  const isMockExam = experience === "g1-mock-exam";
  const unansweredIndexes = questions.flatMap((candidate, index) => (selection[candidate.id]?.length ?? 0) > 0 ? [] : [index]);
  const canSubmitMockExam = answeredCount === questions.length;

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    document.getElementById(`question-${question?.id}-heading`)?.focus();
  }, [question?.id]);

  useEffect(() => {
    if (submitted) document.getElementById("quiz-result-heading")?.focus();
  }, [submitted]);

  if (!questions.length) {
    return (
      <Card>
        <CardContent className="space-y-3 p-8 text-center text-slate-600">
          <p>{emptyState ?? "No published practice questions yet. Add and publish questions from Admin → Questions."}</p>
          <Button asChild variant="outline"><Link href="/admin/questions">Add questions</Link></Button>
        </CardContent>
      </Card>
    );
  }

  const isMulti = question.type === "MULTI_SELECT";
  const review = reviewByQuestion.get(question.id);
  const officialSourceUrl = getOfficialOntarioSourceUrl(question.sourceReference);

  return (
    <div className="space-y-6">
      {submitted ? (
        <Card aria-live="polite" className={mockResult?.passed === false ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"} role="status">
          <CardHeader>
            <CardTitle as="h2" className="outline-none" id="quiz-result-heading" tabIndex={-1}>
              {mockResult ? (mockResult.passed ? "Mock exam passed" : "Keep practising") : "Practice complete"}: {result.correctCount}/{result.totalCount} ({result.percent}%)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-900">
            {mockResult ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <p className="rounded-lg bg-white p-3 font-semibold">Signs: {mockResult.sections.signs.correctCount}/20 · {mockResult.sections.signs.passed ? "Pass" : "Needs 16"}</p>
                <p className="rounded-lg bg-white p-3 font-semibold">Rules: {mockResult.sections.rules.correctCount}/20 · {mockResult.sections.rules.passed ? "Pass" : "Needs 16"}</p>
              </div>
            ) : null}
            <p>Review each explanation one question at a time, then save progress or try again.</p>
            {canSaveProgress ? (
              <form action={saveQuizAttempt}>
                <input name="stage" type="hidden" value={stage} />
                <input name="questionIds" type="hidden" value={JSON.stringify(questions.map((candidate) => candidate.id))} />
                <input name="selectedChoiceIdsByQuestion" type="hidden" value={JSON.stringify(selection)} />
                <Button type="submit">Save progress</Button>
              </form>
            ) : (
              <Button asChild variant="outline"><Link href="/sign-in">Sign in to save progress</Link></Button>
            )}
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-xl border bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-700">
          <span>Question {navigation.questionNumber} of {questions.length}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div aria-label={`Quiz progress: question ${navigation.questionNumber} of ${questions.length}`} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuemax={questions.length} aria-valuemin={1} aria-valuenow={navigation.questionNumber}>
          <div className="h-full rounded-full bg-green-700 transition-all" style={{ width: `${(navigation.questionNumber / questions.length) * 100}%` }} />
        </div>
      </div>

      {isMockExam ? (
        <nav aria-label="Question navigation" className="rounded-xl border bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">Jump to a question</p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {questions.map((candidate, index) => {
              const isAnswered = (selection[candidate.id]?.length ?? 0) > 0;
              return (
                <button
                  aria-current={index === navigation.activeIndex ? "step" : undefined}
                  aria-label={`Question ${index + 1}: ${isAnswered ? "answered" : "unanswered"}`}
                  className={`min-h-10 rounded-lg border text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 ${index === navigation.activeIndex ? "border-green-800 bg-green-800 text-white" : isAnswered ? "border-green-300 bg-green-50 text-green-950" : "border-slate-300 bg-white text-slate-700"}`}
                  key={candidate.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </nav>
      ) : null}

      <Card key={question.id}>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-800">
            {isMockExam ? `Section ${navigation.questionNumber <= 20 ? "1 of 2 · Signs" : "2 of 2 · Rules"} · ` : ""}Question {navigation.questionNumber} · {question.stage}{question.categoryName ? ` · ${question.categoryName}` : ""}
          </p>
          <h2 className="text-xl font-semibold leading-7 tracking-tight outline-none" id={`question-${question.id}-heading`} tabIndex={-1}>{question.prompt}</h2>
          {isMulti ? <p className="text-sm text-slate-600">Select all correct answers.</p> : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {question.assets.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {question.assets.map((asset) => (
                <Image alt="Illustration for this question" className="max-h-72 rounded-xl border bg-white object-contain p-3" height={288} key={asset.path} priority src={asset.path} width={480} />
              ))}
            </div>
          ) : null}

          <fieldset className="space-y-3">
            <legend className="sr-only">{question.prompt}</legend>
            {question.choices.map((choice) => {
              const checked = hasChoice(selection, question.id, choice.id);
              const isCorrectChoice = submitted && choice.isCorrect;
              const isWrongSelected = submitted && checked && !choice.isCorrect;
              const choiceStatus = isCorrectChoice ? "Correct answer" : isWrongSelected ? "Your incorrect answer" : null;
              return (
                <label className={`flex gap-3 rounded-xl border p-3 text-sm ${submitted ? "cursor-default" : "cursor-pointer"} ${isCorrectChoice ? "border-green-300 bg-green-50" : "bg-white"} ${isWrongSelected ? "border-red-300 bg-red-50" : ""}`} key={choice.id}>
                  <input
                    aria-describedby={choiceStatus ? `choice-${choice.id}-status` : undefined}
                    aria-disabled={submitted}
                    checked={checked}
                    name={`question-${question.id}`}
                    onChange={() => {
                      if (submitted) return;
                      setSelection((current) => isMulti ? toggleMultiChoice(current, question.id, choice.id) : setSingleChoice(current, question.id, choice.id));
                    }}
                    type={isMulti ? "checkbox" : "radio"}
                  />
                  <span className="space-y-2">
                    {choice.text ? <span className="block">{choice.text}</span> : null}
                    {choice.asset ? <Image alt="Illustrated answer option" className="max-h-32 rounded-lg border bg-white object-contain p-2" height={128} src={choice.asset.path} width={220} /> : null}
                    {choiceStatus ? <span className={`block font-semibold ${isWrongSelected ? "text-red-800" : "text-green-800"}`} id={`choice-${choice.id}-status`}>{choiceStatus}</span> : null}
                  </span>
                </label>
              );
            })}
          </fieldset>

          {submitted && review ? (
            <div className="space-y-3">
              <div className={`rounded-xl border p-4 text-sm ${review.isCorrect ? "border-green-200 bg-green-50 text-green-950" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
                <p className="font-semibold">{review.isCorrect ? "Correct" : "Review this one"}</p>
                <p>{question.explanation}</p>
                {submitted && officialSourceUrl ? (
                  <p className="mt-2">
                    Source: <a className="font-semibold underline" href={officialSourceUrl}>Official Ontario guidance for {question.categoryName ?? `${question.stage} driving`}</a>
                  </p>
                ) : null}
              </div>
              <details className="rounded-xl border bg-slate-50 p-4 text-sm">
                <summary className="cursor-pointer font-semibold text-slate-900">Report this question</summary>
                <form action={createQuestionReport} className="mt-4 grid gap-3">
                  <input name="questionId" type="hidden" value={question.id} />
                  <input name="returnTo" type="hidden" value={returnTo} />
                  <label className="space-y-1">
                    <span className="font-medium">Reason</span>
                    <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" name="reason" required>
                      {reportReasonOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="font-medium">Comment</span>
                    <textarea className="min-h-20 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" name="comment" placeholder="Tell us what looks wrong or confusing." />
                  </label>
                  {!canSaveProgress ? (
                    <label className="space-y-1">
                      <span className="font-medium">Email <span className="font-normal text-slate-500">(optional)</span></span>
                      <input className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm" name="reporterEmail" type="email" />
                    </label>
                  ) : null}
                  <Button type="submit" variant="outline">Send report</Button>
                </form>
              </details>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {isMockExam && !submitted ? (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-amber-950">
            {canSubmitMockExam ? "All 40 questions are answered. You can submit now." : `Answer all 40 questions before submitting. ${unansweredIndexes.length} unanswered.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {unansweredIndexes.length ? <Button onClick={() => setActiveIndex(unansweredIndexes[0])} type="button" variant="outline">Review unanswered</Button> : null}
            <Button disabled={!canSubmitMockExam} onClick={() => { setSubmitted(true); setActiveIndex(0); }} type="button">Submit mock exam</Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button disabled={navigation.isFirst} onClick={() => setActiveIndex(navigation.previousIndex)} type="button" variant="outline">Previous</Button>
        <div className="flex flex-wrap gap-3">
          {submitted ? <Button onClick={() => {
            setSelection({});
            setSubmitted(false);
            setActiveIndex(0);
            requestAnimationFrame(() => document.getElementById(`question-${questions[0].id}-heading`)?.focus());
          }} type="button" variant="outline">Try again</Button> : null}
          {!navigation.isLast ? (
            <Button onClick={() => setActiveIndex(navigation.nextIndex)} type="button">Next question</Button>
          ) : !submitted && !isMockExam ? (
            <Button onClick={() => { setSubmitted(true); setActiveIndex(0); }} type="button">Check answers</Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
