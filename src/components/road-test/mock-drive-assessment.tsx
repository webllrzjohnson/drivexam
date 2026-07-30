"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  buildMockDriveAssessment,
  getMockDriveCriteria,
  type MockDriveRating,
  type MockDriveStage,
} from "@/lib/learner/road-test-assessment";

type MockDriveAssessmentProps = {
  stage: MockDriveStage;
};

const ratingOptions: Array<{ value: MockDriveRating; label: string; description: string }> = [
  { value: 0, label: "Needs work", description: "Missed, unsafe, or needed a reminder" },
  { value: 1, label: "Sometimes", description: "Usually shown, but not yet consistent" },
  { value: 2, label: "Consistent", description: "Safe, timely, and visible without reminders" },
];

const verdictLabels = {
  INCOMPLETE: "Assessment incomplete",
  NEEDS_PRACTICE: "Needs more practice",
  NEARLY_READY: "Nearly ready",
  READY: "Ready for another full mock route",
} as const;

export function MockDriveAssessment({ stage }: MockDriveAssessmentProps) {
  const criteria = useMemo(() => getMockDriveCriteria(stage), [stage]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [criticalErrorCount, setCriticalErrorCount] = useState(0);
  const [hasAssessed, setHasAssessed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const result = buildMockDriveAssessment({ stage, ratings, criticalErrorCount });

  useEffect(() => {
    setRatings({});
    setCriticalErrorCount(0);
    setHasAssessed(false);
    setIsOpen(false);
  }, [stage]);

  useEffect(() => {
    if (hasAssessed) resultHeadingRef.current?.focus();
  }, [hasAssessed]);

  function resetAssessment() {
    setRatings({});
    setCriticalErrorCount(0);
    setHasAssessed(false);
    setIsOpen(false);
  }

  return (
    <section aria-labelledby="mock-drive-heading" className="scroll-mt-24" id="mock-drive-assessment">
      <Card>
        <CardHeader className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Practice-route assessment</p>
          <h2 className="text-2xl font-semibold leading-none tracking-tight" id="mock-drive-heading">Score a mock drive</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            After the vehicle is safely parked, ask a supervising driver to rate what they actually observed. This is a practice tool, not an official DriveTest score sheet.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isOpen ? (
            <Button onClick={() => setIsOpen(true)} type="button">Start mock-drive assessment</Button>
          ) : (
          <>
          <div className="grid gap-4 lg:grid-cols-2">
            {criteria.map((criterion, index) => (
              <fieldset className="min-w-0 rounded-xl border bg-slate-50 p-4" key={criterion.id}>
                <legend className="px-1 font-semibold text-slate-950">{index + 1}. {criterion.label}</legend>
                <p className="mb-4 mt-1 text-sm leading-6 text-slate-600" id={`${criterion.id}-description`}>{criterion.description}</p>
                <div aria-describedby={`${criterion.id}-description`} className="grid gap-2 sm:grid-cols-3">
                  {ratingOptions.map((option) => (
                    <label className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-green-700 focus-within:ring-offset-2 ${ratings[criterion.id] === option.value ? "border-green-700 bg-green-50" : "bg-white"}`} key={option.value}>
                      <span className="flex items-center gap-2 font-medium text-slate-950">
                        <input
                          checked={ratings[criterion.id] === option.value}
                          name={`rating-${criterion.id}`}
                          onChange={() => {
                            setRatings((current) => ({ ...current, [criterion.id]: option.value }));
                            setHasAssessed(false);
                          }}
                          type="radio"
                          value={option.value}
                        />
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{option.description}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <fieldset className="rounded-xl border border-red-200 bg-red-50 p-4">
            <legend className="px-1 font-semibold text-red-950">Critical safety errors</legend>
            <p className="mb-3 mt-1 text-sm leading-6 text-red-900" id="critical-errors-description">
              Count any instructor intervention, dangerous action, traffic-law violation, or situation that forced another road user to avoid you.
            </p>
            <div aria-describedby="critical-errors-description" className="flex flex-wrap gap-2">
              {[0, 1, 2].map((count) => (
                <label className={`cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium focus-within:ring-2 focus-within:ring-red-700 focus-within:ring-offset-2 ${criticalErrorCount === count ? "border-red-700 bg-white text-red-950" : "border-red-200 bg-red-50 text-red-900"}`} key={count}>
                  <input
                    checked={criticalErrorCount === count}
                    className="mr-2"
                    name="critical-error-count"
                    onChange={() => {
                      setCriticalErrorCount(count);
                      setHasAssessed(false);
                    }}
                    type="radio"
                    value={count}
                  />
                  {count === 2 ? "2 or more" : count}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setHasAssessed(true)} type="button">Score this mock drive</Button>
            <Button onClick={resetAssessment} type="button" variant="outline">Reset assessment</Button>
          </div>

          {hasAssessed ? (
            <div aria-live="polite" className={`rounded-xl border p-5 ${result.verdict === "READY" ? "border-green-300 bg-green-50" : result.verdict === "NEARLY_READY" ? "border-blue-300 bg-blue-50" : "border-amber-300 bg-amber-50"}`}>
              <h3 className="text-xl font-bold text-slate-950 outline-none" ref={resultHeadingRef} tabIndex={-1}>{verdictLabels[result.verdict]} · {result.percent}%</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{result.summary}</p>
              {result.priorities.length ? (
                <div className="mt-4">
                  <p className="font-semibold text-slate-950">Next practice priorities</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
                    {result.priorities.map((priority) => <li key={priority.id}>{priority.label}</li>)}
                  </ol>
                </div>
              ) : null}
              {result.verdict === "READY" ? <p className="mt-4 text-sm font-medium text-green-950">Repeat this result on at least two different routes and in normal traffic before booking.</p> : null}
            </div>
          ) : null}
          </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
