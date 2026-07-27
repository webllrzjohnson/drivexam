"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { RoadSignFlashcardGroup } from "@/lib/learner/quiz";

type RoadSignFlashcardsProps = {
  groups: RoadSignFlashcardGroup[];
};

export function RoadSignFlashcards({ groups }: RoadSignFlashcardsProps) {
  const [activeGroupKey, setActiveGroupKey] = useState(groups[0]?.key ?? "all");
  const [flippedPaths, setFlippedPaths] = useState<string[]>([]);
  const [knownPaths, setKnownPaths] = useState<string[]>([]);
  const [reviewPaths, setReviewPaths] = useState<string[]>([]);

  const activeGroup = groups.find((group) => group.key === activeGroupKey) ?? groups[0];
  const cards = activeGroup?.cards ?? [];
  const progress = useMemo(() => ({ known: knownPaths.length, review: reviewPaths.length }), [knownPaths, reviewPaths]);

  function toggleFlip(path: string) {
    setFlippedPaths((current) => current.includes(path) ? current.filter((currentPath) => currentPath !== path) : [...current, path]);
  }

  function markKnown(path: string) {
    setKnownPaths((current) => current.includes(path) ? current : [...current, path]);
    setReviewPaths((current) => current.filter((currentPath) => currentPath !== path));
  }

  function markReview(path: string) {
    setReviewPaths((current) => current.includes(path) ? current : [...current, path]);
    setKnownPaths((current) => current.filter((currentPath) => currentPath !== path));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <button
            aria-pressed={activeGroupKey === group.key}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              activeGroupKey === group.key ? "border-green-700 bg-green-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-green-300"
            }`}
            key={group.key}
            onClick={() => setActiveGroupKey(group.key)}
            type="button"
          >
            {group.label} <span className="opacity-75">({group.cards.length})</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
        <strong className="text-slate-950">Self-check:</strong> {progress.known} known · {progress.review} need review. Flip a card to reveal the meaning, then mark how confident you are.
      </div>

      {cards.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const isFlipped = flippedPaths.includes(card.path);
            const status = knownPaths.includes(card.path) ? "Known" : reviewPaths.includes(card.path) ? "Need review" : null;
            return (
              <Card className="overflow-hidden" key={card.path}>
                <CardContent className="space-y-3 p-4">
                  <button
                    aria-label={isFlipped ? `Hide meaning for ${card.title}` : `Reveal meaning for ${card.title}`}
                    className="flex h-44 w-full items-center justify-center rounded-xl border bg-white p-4 text-left transition hover:border-green-300"
                    data-flipped={isFlipped ? "true" : "false"}
                    data-road-sign-card={card.path}
                    onClick={() => toggleFlip(card.path)}
                    type="button"
                  >
                    {isFlipped ? (
                      <span className="space-y-2 text-center">
                        <span className="block text-lg font-bold text-slate-950">{card.title}</span>
                        <span className="block text-sm leading-6 text-slate-600">{card.description ?? "Review this Ontario road sign and practise its meaning in the signs quiz."}</span>
                      </span>
                    ) : (
                      <Image alt={card.title} className="max-h-36 w-auto object-contain" height={150} src={card.path} width={150} />
                    )}
                  </button>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{isFlipped ? "Meaning shown" : "Tap to reveal"}</span>
                    {status ? <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">{status}</span> : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button data-self-check="known" onClick={() => markKnown(card.path)} type="button" variant={knownPaths.includes(card.path) ? "default" : "outline"}>I knew it</Button>
                    <Button data-self-check="review" onClick={() => markReview(card.path)} type="button" variant={reviewPaths.includes(card.path) ? "default" : "outline"}>Need review</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">No signs match this filter yet.</CardContent>
        </Card>
      )}
    </div>
  );
}
