export type MockDriveStage = "G2" | "G";
export type MockDriveRating = 0 | 1 | 2;
export type MockDriveVerdict = "INCOMPLETE" | "NEEDS_PRACTICE" | "NEARLY_READY" | "READY";

export type MockDriveCriterion = {
  id: string;
  label: string;
  description: string;
};

export type MockDriveAssessmentResult = {
  percent: number;
  verdict: MockDriveVerdict;
  summary: string;
  priorities: MockDriveCriterion[];
  strengths: MockDriveCriterion[];
  unratedCount: number;
};

export type MockDriveAssessmentSubmissionResult =
  | {
      ok: true;
      data: {
        stage: MockDriveStage;
        clientAssessmentId: string;
        ratings: Record<string, MockDriveRating>;
        criticalErrorCount: number;
        result: MockDriveAssessmentResult;
      };
    }
  | { ok: false; error: string };

export type MockDriveAssessmentSubmission = Extract<MockDriveAssessmentSubmissionResult, { ok: true }>["data"];

export type PersistedMockDriveAssessmentEvidence = {
  stage: string;
  percent: number;
  verdict: string;
  criticalErrorCount: number;
  ratings: unknown;
  priorityIds: string[];
};

export type SavedMockDriveAssessmentInput = {
  id: string;
  stage: MockDriveStage | "G1";
  percent: number;
  verdict: Exclude<MockDriveVerdict, "INCOMPLETE">;
  criticalErrorCount: number;
  createdAt: Date;
};

const coreCriteria: MockDriveCriterion[] = [
  {
    id: "mirror-checks",
    label: "Mirror checks",
    description: "Checks mirrors regularly and before slowing, turning, or changing position.",
  },
  {
    id: "signals",
    label: "Signals",
    description: "Signals early enough to warn others and cancels the signal after the move.",
  },
  {
    id: "blind-spots",
    label: "Blind-spot checks",
    description: "Uses a clear shoulder check before moving sideways, pulling out, or merging.",
  },
  {
    id: "lane-position",
    label: "Lane position",
    description: "Stays centred, chooses the correct lane, and completes turns into the corresponding lane.",
  },
  {
    id: "speed-control",
    label: "Speed control",
    description: "Uses an appropriate, steady speed for traffic, visibility, curves, and posted limits.",
  },
  {
    id: "following-space",
    label: "Following space",
    description: "Keeps a safe time gap and increases it when traffic or conditions require more room.",
  },
  {
    id: "smooth-control",
    label: "Smooth vehicle control",
    description: "Accelerates, brakes, and steers smoothly without abrupt corrections or hesitation.",
  },
  {
    id: "intersection-scanning",
    label: "Intersection scanning",
    description: "Looks ahead, left, right, and through the intended path for vehicles, cyclists, and pedestrians.",
  },
];

const stageCriteria: Record<MockDriveStage, MockDriveCriterion[]> = {
  G2: [
    {
      id: "turns-right-of-way",
      label: "Turns and right-of-way",
      description: "Judges safe gaps, yields correctly, controls the turn, and finishes in the correct lane.",
    },
    {
      id: "parking-roadside",
      label: "Parking and roadside manoeuvres",
      description: "Completes parking, roadside stops, and three-point turns with full observation and control.",
    },
  ],
  G: [
    {
      id: "freeway-merge-exit",
      label: "Freeway merging and exiting",
      description: "Builds speed, selects a safe gap, merges smoothly, and enters the exit lane before slowing.",
    },
    {
      id: "lane-changes-traffic-flow",
      label: "Lane changes and traffic flow",
      description: "Plans lane changes, avoids blind spots, and preserves safe speed and space around other traffic.",
    },
  ],
};

export function getMockDriveCriteria(stage: MockDriveStage): MockDriveCriterion[] {
  return [...coreCriteria, ...stageCriteria[stage]];
}

export function normalizeMockDriveAssessmentSubmission(formData: FormData): MockDriveAssessmentSubmissionResult {
  const stageValue = String(formData.get("stage") ?? "").trim();
  if (stageValue !== "G2" && stageValue !== "G") return { ok: false, error: "Choose a valid road-test stage." };

  const clientAssessmentId = String(formData.get("clientAssessmentId") ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientAssessmentId)) {
    return { ok: false, error: "Start a new mock-drive assessment before saving." };
  }

  const ratingsValue = String(formData.get("ratings") ?? "");
  if (!ratingsValue || ratingsValue.length > 5_000) return { ok: false, error: "Complete every assessment rating before saving." };

  let rawRatings: unknown;
  try {
    rawRatings = JSON.parse(ratingsValue);
  } catch {
    return { ok: false, error: "Complete every assessment rating before saving." };
  }
  if (!rawRatings || typeof rawRatings !== "object" || Array.isArray(rawRatings)) {
    return { ok: false, error: "Complete every assessment rating before saving." };
  }

  const criteria = getMockDriveCriteria(stageValue);
  const criterionIds = new Set(criteria.map((criterion) => criterion.id));
  const rawRatingsRecord = rawRatings as Record<string, unknown>;
  const entries = Object.entries(rawRatingsRecord);
  if (entries.length !== criteria.length || entries.some(([id, rating]) => !criterionIds.has(id) || (rating !== 0 && rating !== 1 && rating !== 2))) {
    return { ok: false, error: "Complete every assessment rating before saving." };
  }

  const criticalErrorCountValue = String(formData.get("criticalErrorCount") ?? "");
  if (!/^[012]$/.test(criticalErrorCountValue)) {
    return { ok: false, error: "Choose a valid critical safety error count." };
  }
  const criticalErrorCount = Number(criticalErrorCountValue);

  const ratings = Object.fromEntries(criteria.map((criterion) => [criterion.id, rawRatingsRecord[criterion.id]])) as Record<string, MockDriveRating>;
  const result = buildMockDriveAssessment({ stage: stageValue, ratings, criticalErrorCount });
  if (result.verdict === "INCOMPLETE") return { ok: false, error: "Complete every assessment rating before saving." };

  return { ok: true, data: { stage: stageValue, clientAssessmentId, ratings, criticalErrorCount, result } };
}

export function doesSavedMockDriveAssessmentMatchSubmission(
  existing: PersistedMockDriveAssessmentEvidence,
  submission: MockDriveAssessmentSubmission,
) {
  if (
    existing.stage !== submission.stage
    || existing.percent !== submission.result.percent
    || existing.verdict !== submission.result.verdict
    || existing.criticalErrorCount !== submission.criticalErrorCount
  ) return false;
  if (!existing.ratings || typeof existing.ratings !== "object" || Array.isArray(existing.ratings)) return false;

  const criteria = getMockDriveCriteria(submission.stage);
  const existingRatings = existing.ratings as Record<string, unknown>;
  if (Object.keys(existingRatings).length !== criteria.length) return false;
  if (criteria.some((criterion) => existingRatings[criterion.id] !== submission.ratings[criterion.id])) return false;

  const priorityIds = submission.result.priorities.map((priority) => priority.id);
  return existing.priorityIds.length === priorityIds.length
    && existing.priorityIds.every((priorityId, index) => priorityId === priorityIds[index]);
}

export function buildRoadTestAssessmentProgressSummary({
  stage,
  assessments,
  assessmentCount,
  bestPercent,
}: {
  stage: MockDriveStage;
  assessments: SavedMockDriveAssessmentInput[];
  assessmentCount?: number;
  bestPercent?: number;
}) {
  const stageAssessments = assessments
    .filter((assessment) => assessment.stage === stage)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id));
  const latest = stageAssessments[0] ?? null;
  const previous = stageAssessments[1] ?? null;
  const recentBestPercent = stageAssessments.reduce((best, assessment) => Math.max(best, assessment.percent), 0);

  let nextAction = "Score a supervised mock drive after your next practice route.";
  if (latest?.criticalErrorCount) nextAction = "Repeat the unsafe situation with your supervising driver before another full route.";
  else if (latest?.verdict === "READY") nextAction = "Repeat the result on a different route and in normal traffic.";
  else if (latest?.verdict === "NEARLY_READY") nextAction = "Strengthen the lowest-rated habits, then score another full route.";
  else if (latest) nextAction = "Practise the weakest habits before scoring another full route.";

  return {
    stage,
    assessmentCount: assessmentCount ?? stageAssessments.length,
    latestPercent: latest?.percent ?? 0,
    latestVerdict: latest?.verdict ?? null,
    bestPercent: bestPercent ?? recentBestPercent,
    trendPoints: latest && previous ? latest.percent - previous.percent : null,
    nextAction,
  };
}

export function buildMockDriveAssessment({
  stage,
  ratings,
  criticalErrorCount,
}: {
  stage: MockDriveStage;
  ratings: Record<string, number>;
  criticalErrorCount: number;
}): MockDriveAssessmentResult {
  const criteria = getMockDriveCriteria(stage);
  const ratedCriteria = criteria.filter((criterion) => ratings[criterion.id] === 0 || ratings[criterion.id] === 1 || ratings[criterion.id] === 2);
  const unratedCount = criteria.length - ratedCriteria.length;
  const earnedPoints = ratedCriteria.reduce((total, criterion) => total + ratings[criterion.id], 0);
  const percent = ratedCriteria.length ? Math.round((earnedPoints / (criteria.length * 2)) * 100) : 0;
  const priorities = ratedCriteria
    .filter((criterion) => ratings[criterion.id] < 2)
    .sort((a, b) => ratings[a.id] - ratings[b.id] || criteria.indexOf(a) - criteria.indexOf(b))
    .slice(0, 3);
  const strengths = ratedCriteria.filter((criterion) => ratings[criterion.id] === 2);

  if (unratedCount > 0) {
    return {
      percent,
      verdict: "INCOMPLETE",
      summary: `Rate all ${criteria.length} habits to get a readiness result.`,
      priorities,
      strengths,
      unratedCount,
    };
  }

  if (criticalErrorCount > 0) {
    return {
      percent,
      verdict: "NEEDS_PRACTICE",
      summary: `${criticalErrorCount} critical safety error${criticalErrorCount === 1 ? "" : "s"} occurred. Practise the unsafe situation again before booking.`,
      priorities,
      strengths,
      unratedCount,
    };
  }

  if (ratedCriteria.some((criterion) => ratings[criterion.id] === 0)) {
    return {
      percent,
      verdict: "NEEDS_PRACTICE",
      summary: "At least one safety habit was completely missed. Practise the weakest habits before attempting another full mock drive.",
      priorities,
      strengths,
      unratedCount,
    };
  }

  if (percent >= 85) {
    return {
      percent,
      verdict: "READY",
      summary: "This mock drive showed consistent, examiner-visible safe habits. Repeat the result on different routes before booking.",
      priorities,
      strengths,
      unratedCount,
    };
  }

  if (percent >= 75) {
    return {
      percent,
      verdict: "NEARLY_READY",
      summary: "The drive is close, but the weakest habits should become consistent without reminders before booking.",
      priorities,
      strengths,
      unratedCount,
    };
  }

  return {
    percent,
    verdict: "NEEDS_PRACTICE",
    summary: "Repeat a shorter practice route focused on the weakest habits before attempting another full mock drive.",
    priorities,
    strengths,
    unratedCount,
  };
}
