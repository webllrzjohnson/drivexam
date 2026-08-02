"use client";

import type { LicenseStage } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildOfflineAttempt,
  getOfflinePackAssetPaths,
  getOfflineStageQuestionCount,
  parseOfflinePack,
  type OfflineQuestionPack,
  type StoredOfflineAttempt,
} from "@/lib/learner/offline-practice";
import {
  clearOfflinePack,
  deleteOfflineAttempt,
  getOfflineAttempts,
  getOfflinePack,
  putOfflineAttempt,
  putOfflinePack,
  updateOfflineAttemptStatus,
} from "@/lib/learner/offline-storage";
import { buildBalancedPracticeQuestionSet, getOfficialOntarioSourceUrl, type QuizQuestionView } from "@/lib/learner/quiz";
import { cn } from "@/lib/utils";

const STAGES: Array<{ value: LicenseStage; label: string }> = [
  { value: "G1", label: "G1 knowledge" },
  { value: "G2", label: "G2 road test" },
  { value: "G", label: "Full G road test" },
];
const PAGE_SIZE = 20;

type SyncResponse = {
  results: Array<{
    clientAttemptId: string;
    status: "synced" | "duplicate" | "stale";
    skippedQuestionCount: number;
    reason?: "invalid-date" | "retired-questions";
  }>;
};

function isSyncResponse(value: unknown): value is SyncResponse {
  if (!value || typeof value !== "object" || !("results" in value) || !Array.isArray(value.results)) return false;
  return value.results.every((result) => result && typeof result === "object" && typeof result.clientAttemptId === "string");
}

async function cacheOfflineResources(pack: OfflineQuestionPack) {
  if (!("serviceWorker" in navigator)) return { cachedCount: 0, failedCount: 0, available: false };
  const registration = await navigator.serviceWorker.ready;
  const worker = navigator.serviceWorker.controller ?? registration.active;
  if (!worker) return { cachedCount: 0, failedCount: 0, available: false };

  const documentResources = [
    window.location.origin + "/offline-practice",
    ...Array.from(document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>("script[src], link[rel='stylesheet'][href]"))
      .map((element) => element instanceof HTMLScriptElement ? element.src : element.href),
    ...getOfflinePackAssetPaths(pack).map((assetPath) => new URL(assetPath, window.location.origin).href),
  ];
  const urls = Array.from(new Set(documentResources));
  const channel = new MessageChannel();

  return new Promise<{ cachedCount: number; failedCount: number; available: true }>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("Offline resource caching timed out.")), 30_000);
    channel.port1.onmessage = (event: MessageEvent<{ cachedCount?: number; failedCount?: number }>) => {
      window.clearTimeout(timeout);
      resolve({ cachedCount: event.data.cachedCount ?? 0, failedCount: event.data.failedCount ?? 0, available: true });
    };
    worker.postMessage({ type: "CACHE_OFFLINE_RESOURCES", urls }, [channel.port2]);
  });
}

function QuestionAsset({ alt, path }: { alt: string; path: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <Image src={path} alt={alt} width={900} height={520} unoptimized className="h-auto max-h-72 w-full object-contain" />
    </div>
  );
}

function OfflineQuestion({
  question,
  selectedIds,
  submitted,
  onToggle,
}: {
  question: QuizQuestionView;
  selectedIds: string[];
  submitted: boolean;
  onToggle: (choiceId: string, checked: boolean) => void;
}) {
  const multiple = question.type === "MULTI_SELECT";
  const selectedSet = new Set(selectedIds);
  const officialSourceUrl = getOfficialOntarioSourceUrl(question.sourceReference);
  return (
    <fieldset aria-describedby={`offline-question-${question.id}-instructions`} className="space-y-4">
      <legend className="text-xl font-bold text-slate-950">{question.prompt}</legend>
      {question.assets.map((asset) => <QuestionAsset alt="Illustration for this question" key={asset.path} path={asset.path} />)}
      <p className="text-sm text-slate-600" id={`offline-question-${question.id}-instructions`}>{multiple ? "Select all answers that apply." : "Select one answer."}</p>
      <div className="space-y-3">
        {question.choices.map((choice) => {
          const selected = selectedSet.has(choice.id);
          const resultStyle = submitted
            ? choice.isCorrect
              ? "border-green-700 bg-green-50"
              : selected
                ? "border-red-700 bg-red-50"
                : "border-slate-200 bg-white"
            : selected
              ? "border-green-700 bg-green-50"
              : "border-slate-200 bg-white hover:border-green-500";
          return (
            <label key={choice.id} className={cn("flex items-start gap-3 rounded-xl border p-4 transition", submitted ? "cursor-default" : "cursor-pointer", resultStyle)}>
              <input
                aria-disabled={submitted}
                type={multiple ? "checkbox" : "radio"}
                name={`offline-question-${question.id}`}
                checked={selected}
                onChange={(event) => onToggle(choice.id, event.target.checked)}
                className="mt-1 h-4 w-4 accent-green-800"
              />
              <span className="min-w-0 flex-1">
                {choice.text ? <span className="font-medium text-slate-900">{choice.text}</span> : null}
                {choice.asset ? <span className="mt-3 block"><QuestionAsset alt="Illustrated answer option" path={choice.asset.path} /></span> : null}
                {submitted && choice.isCorrect ? <span className="mt-1 block text-sm font-semibold text-green-800">Correct answer</span> : null}
                {submitted && selected && !choice.isCorrect ? <span className="mt-1 block text-sm font-semibold text-red-800">Your answer</span> : null}
              </span>
            </label>
          );
        })}
      </div>
      {submitted ? (
        <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
          <strong>Explanation:</strong> {question.explanation}
          {submitted && officialSourceUrl ? (
            <p className="mt-2">Source: <a className="font-semibold underline" href={officialSourceUrl}>Official Ontario guidance for {question.categoryName ?? `${question.stage} driving`}</a></p>
          ) : null}
        </div>
      ) : null}
    </fieldset>
  );
}

export function OfflinePractice() {
  const [pack, setPack] = useState<OfflineQuestionPack | null>(null);
  const [attempts, setAttempts] = useState<StoredOfflineAttempt[]>([]);
  const [stage, setStage] = useState<LicenseStage>("G1");
  const [requestedSet, setRequestedSet] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState<"download" | "sync" | "save" | null>(null);
  const [notice, setNotice] = useState("Loading offline storage…");
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const refreshAttempts = useCallback(async () => setAttempts(await getOfflineAttempts()), []);

  useEffect(() => {
    let active = true;
    Promise.all([getOfflinePack(), getOfflineAttempts()])
      .then(([storedPack, storedAttempts]) => {
        if (!active) return;
        setPack(storedPack);
        setAttempts(storedAttempts);
        setNotice(storedPack ? "Offline pack ready on this device." : "Download a pack while connected before practising offline.");
      })
      .catch(() => active && setError("This browser could not open offline storage."));
    return () => { active = false; };
  }, []);

  const stageQuestions = useMemo(() => pack?.questions.filter((question) => question.stage === stage) ?? [], [pack, stage]);
  const practiceSet = useMemo(
    () => buildBalancedPracticeQuestionSet(stageQuestions, { pageSize: PAGE_SIZE, requestedSet, seed: `${pack?.version ?? "none"}:${stage}` }),
    [pack?.version, requestedSet, stage, stageQuestions],
  );
  const questions = practiceSet.questions;
  const currentQuestion = questions[currentIndex] ?? null;
  const pendingAttempts = attempts.filter((attempt) => attempt.status === "pending");

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedChoiceIds({});
    setSubmitted(false);
  }, []);

  useEffect(() => {
    resetQuiz();
  }, [requestedSet, resetQuiz, stage]);

  async function downloadPack() {
    setBusy("download");
    setError(null);
    setAuthRequired(false);
    try {
      const response = await fetch("/api/offline-pack", { cache: "no-store" });
      if (!response.ok) throw new Error("The question pack could not be downloaded.");
      const nextPack = parseOfflinePack(await response.json());
      await putOfflinePack(nextPack);
      setPack(nextPack);
      setRequestedSet(1);
      resetQuiz();

      let persisted = false;
      if (navigator.storage?.persist) persisted = await navigator.storage.persist();
      const cacheResult = await cacheOfflineResources(nextPack);
      const cacheNote = cacheResult.available
        ? `${cacheResult.cachedCount} app resources cached${cacheResult.failedCount ? `; ${cacheResult.failedCount} could not be cached` : ""}.`
        : "Install the production PWA to cache the full app shell.";
      setNotice(`Downloaded ${nextPack.questions.length} questions. ${cacheNote}${persisted ? " Storage protection was granted." : ""}`);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "The offline pack could not be downloaded.");
    } finally {
      setBusy(null);
    }
  }

  async function removePack() {
    await clearOfflinePack();
    setPack(null);
    resetQuiz();
    setNotice("Downloaded questions removed. Saved attempt history remains on this device.");
  }

  const syncPendingAttempts = useCallback(async (sourceAttempts = attempts) => {
    if (!navigator.onLine || busy === "sync") return;
    const pending = sourceAttempts.filter((attempt) => attempt.status === "pending");
    if (!pending.length) return;

    setBusy("sync");
    setError(null);
    setAuthRequired(false);
    try {
      let synchronizedCount = 0;
      let staleCount = 0;
      for (let start = 0; start < pending.length; start += 10) {
        const batch = pending.slice(start, start + 10);
        const response = await fetch("/api/offline-attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attempts: batch }),
        });
        if (response.status === 401) {
          setAuthRequired(true);
          setNotice("Pending sync: sign in while connected to add local results to your dashboard.");
          return;
        }
        if (response.status === 403) throw new Error("Verify your email before synchronizing offline progress.");
        if (!response.ok) throw new Error("The connection is available, but synchronization did not complete.");
        const result: unknown = await response.json();
        if (!isSyncResponse(result)) throw new Error("The synchronization response was invalid.");

        for (const item of result.results) {
          if (item.status === "synced" || item.status === "duplicate") {
            const note = item.skippedQuestionCount
              ? `${item.skippedQuestionCount} retired question${item.skippedQuestionCount === 1 ? " was" : "s were"} omitted during sync.`
              : undefined;
            await updateOfflineAttemptStatus(item.clientAttemptId, "synced", { syncedAt: new Date().toISOString(), syncNote: note });
            synchronizedCount += 1;
          } else {
            const note = item.reason === "invalid-date"
              ? "This result's completion date is outside the supported sync window and cannot be synchronized. Remove it after reviewing."
              : "This result uses retired questions and cannot be synchronized. Remove it after reviewing.";
            await updateOfflineAttemptStatus(item.clientAttemptId, "pending", { syncNote: note });
            staleCount += 1;
          }
        }
      }
      await refreshAttempts();
      setNotice(`${synchronizedCount} local result${synchronizedCount === 1 ? "" : "s"} synchronized.${staleCount ? ` ${staleCount} stale result${staleCount === 1 ? " needs" : "s need"} review.` : ""}`);
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Offline results could not be synchronized.");
    } finally {
      setBusy(null);
    }
  }, [attempts, busy, refreshAttempts]);

  useEffect(() => {
    const handleOnline = () => { void syncPendingAttempts(); };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncPendingAttempts]);

  function toggleChoice(choiceId: string, checked: boolean) {
    if (!currentQuestion || submitted) return;
    setSelectedChoiceIds((current) => {
      const existing = current[currentQuestion.id] ?? [];
      const next = currentQuestion.type === "MULTI_SELECT"
        ? checked ? Array.from(new Set([...existing, choiceId])) : existing.filter((id) => id !== choiceId)
        : checked ? [choiceId] : [];
      return { ...current, [currentQuestion.id]: next };
    });
  }

  async function finishAndSave() {
    if (!questions.length) return;
    setBusy("save");
    setError(null);
    try {
      const attempt = buildOfflineAttempt({
        clientAttemptId: crypto.randomUUID(),
        packVersion: pack?.version ?? "unknown",
        questions,
        selectedChoiceIdsByQuestion: selectedChoiceIds,
      });
      await putOfflineAttempt(attempt);
      const nextAttempts = [attempt, ...attempts];
      setAttempts(nextAttempts);
      setSubmitted(true);
      setCurrentIndex(0);
      setNotice(`Saved on this device: ${attempt.correctCount}/${attempt.totalCount} (${attempt.percent}%).`);
      window.setTimeout(() => resultHeadingRef.current?.focus(), 0);
      if (navigator.onLine) void syncPendingAttempts(nextAttempts);
    } catch {
      setError("The result could not be saved on this device.");
    } finally {
      setBusy(null);
    }
  }

  async function removeAttempt(clientAttemptId: string) {
    await deleteOfflineAttempt(clientAttemptId);
    await refreshAttempts();
    setNotice("Local result removed from this device.");
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="offline-pack-title" className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle as="h2" id="offline-pack-title">Offline question pack</CardTitle>
            <CardDescription>Download public practice content once, then study without a connection. Account pages and admin tools remain online-only.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pack ? (
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                {STAGES.map((item) => <div key={item.value} className="rounded-lg bg-slate-100 p-3"><strong>{item.label}</strong><br />{getOfflineStageQuestionCount(pack, item.value)} questions</div>)}
              </div>
            ) : <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-950">No offline pack is stored on this device.</p>}
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={downloadPack} disabled={busy !== null}>{busy === "download" ? "Downloading…" : pack ? "Check for pack update" : "Download offline pack"}</Button>
              {pack ? <Button type="button" variant="outline" onClick={removePack} disabled={busy !== null}>Remove downloaded pack</Button> : null}
            </div>
            <p className="text-xs text-slate-500">The pack contains public questions and answers only. Sign-in credentials are never stored in the offline database.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle as="h2">Local progress</CardTitle><CardDescription>Results stay on this device until a verified account synchronizes them.</CardDescription></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><strong>{pendingAttempts.length}</strong> Pending sync</p>
            <p><strong>{attempts.filter((attempt) => attempt.status === "synced").length}</strong> Synchronized</p>
            <Button type="button" variant="outline" onClick={() => void syncPendingAttempts()} disabled={!pendingAttempts.length || busy !== null}>{busy === "sync" ? "Synchronizing…" : "Sync pending results"}</Button>
            {authRequired ? <p><Link href="/sign-in?callbackUrl=/offline-practice" className="font-semibold text-green-800 underline">Sign in</Link> while connected, then return here to sync.</p> : null}
          </CardContent>
        </Card>
      </section>

      <div aria-live="polite" role="status" className="rounded-lg border bg-white px-4 py-3 text-sm text-slate-700">{notice}</div>
      {error ? <div aria-live="assertive" role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div> : null}

      {pack ? (
        <section aria-labelledby="offline-quiz-title" className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-800">Downloaded practice</p>
            <h2 id="offline-quiz-title" className="mt-2 text-3xl font-bold text-slate-950">Practice on this device</h2>
          </div>
          <div className="grid gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-800">Licence stage
              <select value={stage} onChange={(event) => { setStage(event.target.value as LicenseStage); setRequestedSet(1); }} className="mt-2 block w-full rounded-lg border px-3 py-2 font-normal">
                {STAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-800">Question set
              <select value={practiceSet.activeSet} onChange={(event) => setRequestedSet(Number(event.target.value))} className="mt-2 block w-full rounded-lg border px-3 py-2 font-normal">
                {Array.from({ length: practiceSet.totalSets }, (_, index) => <option key={index + 1} value={index + 1}>Set {index + 1} of {practiceSet.totalSets}</option>)}
              </select>
            </label>
          </div>

          {submitted ? (
            <Card>
              <CardHeader>
                <h2 ref={resultHeadingRef} tabIndex={-1} className="text-2xl font-semibold leading-none tracking-tight">Saved on this device</h2>
                <CardDescription>Review each answer below. Pending results synchronize only after sign-in and a successful connection.</CardDescription>
              </CardHeader>
              <CardContent><Button type="button" variant="outline" onClick={resetQuiz}>Start this set again</Button></CardContent>
            </Card>
          ) : null}

          {currentQuestion ? (
            <Card>
              <CardHeader>
                <CardDescription>Question {currentIndex + 1} of {questions.length} · {currentQuestion.categoryName ?? "General"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <OfflineQuestion question={currentQuestion} selectedIds={selectedChoiceIds[currentQuestion.id] ?? []} submitted={submitted} onToggle={toggleChoice} />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                  <Button type="button" variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}>Previous</Button>
                  <span className="text-sm text-slate-500">{Object.keys(selectedChoiceIds).filter((questionId) => (selectedChoiceIds[questionId]?.length ?? 0) > 0).length} of {questions.length} answered</span>
                  {currentIndex < questions.length - 1 ? (
                    <Button type="button" onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}>Next</Button>
                  ) : submitted ? (
                    <Button type="button" variant="outline" onClick={() => setCurrentIndex(0)}>Review from start</Button>
                  ) : (
                    <Button type="button" onClick={finishAndSave} disabled={busy !== null}>{busy === "save" ? "Saving…" : "Finish and save locally"}</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : <p>No questions are available for this stage in the downloaded pack.</p>}
        </section>
      ) : null}

      {attempts.length ? (
        <section aria-labelledby="local-history-title" className="space-y-4">
          <h2 id="local-history-title" className="text-2xl font-bold text-slate-950">Results on this device</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {attempts.map((attempt) => (
              <article key={attempt.clientAttemptId} className="rounded-xl border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="font-bold text-slate-950">{attempt.stage} · {attempt.percent}%</h3><p className="text-sm text-slate-600">{attempt.correctCount}/{attempt.totalCount} · {new Date(attempt.createdAt).toLocaleString()}</p></div>
                  <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", attempt.status === "synced" ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-950")}>{attempt.status === "synced" ? "Synchronized" : "Pending sync"}</span>
                </div>
                {attempt.syncNote ? <p className="mt-3 text-sm text-slate-700">{attempt.syncNote}</p> : null}
                <Button type="button" variant="ghost" className="mt-2 px-0 text-red-800" onClick={() => void removeAttempt(attempt.clientAttemptId)}>Remove local record</Button>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
