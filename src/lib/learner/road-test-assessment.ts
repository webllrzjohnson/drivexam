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
