import type { LicenseStage, RoadTestChecklistSection } from "@prisma/client";

export type RoadTestSeedCategory = {
  slug: string;
  name: string;
  description: string;
  stage: LicenseStage;
  sortOrder: number;
};

export type RoadTestSeedChoice = {
  text: string;
  isCorrect: boolean;
};

export type RoadTestSeedQuestion = {
  stage: LicenseStage;
  sourceReference: string;
  categorySlug: string;
  prompt: string;
  explanation: string;
  choices: RoadTestSeedChoice[];
};

export type RoadTestSeedChecklistItem = {
  stage: LicenseStage;
  section: RoadTestChecklistSection;
  sourceReference: string;
  categorySlug: string;
  title: string;
  description: string;
  sortOrder: number;
};

export const ontarioRoadTestSourceUrls = {
  newDrivers: "https://www.ontario.ca/page/get-g-drivers-licence-new-drivers",
  levelTwoRoadTest: "https://www.ontario.ca/document/official-mto-drivers-handbook/level-two-road-test",
  freewayDriving: "https://www.ontario.ca/document/official-mto-drivers-handbook/freeway-driving",
  changingDirections: "https://www.ontario.ca/document/official-mto-drivers-handbook/changing-directions",
  parking: "https://www.ontario.ca/document/official-mto-drivers-handbook/parking-along-roadways",
} as const;

export const ontarioRoadTestSeedCategories: RoadTestSeedCategory[] = [
  {
    slug: "g2-observation-and-right-of-way",
    name: "G2 observation and right-of-way",
    description: "G1-exit road-test decisions: scanning, yielding, intersections, signals, and safe traffic gaps.",
    stage: "G2",
    sortOrder: 110,
  },
  {
    slug: "g2-turns-parking-and-control",
    name: "G2 turns, parking, and control",
    description: "G2 road-test fundamentals: turns, lane changes, roadside stops, parking, speed choice, and smooth control.",
    stage: "G2",
    sortOrder: 120,
  },
  {
    slug: "g2-road-test-readiness",
    name: "G2 road-test readiness",
    description: "What to practise before the G2 road test, including legal eligibility, calm decisions, and common serious errors.",
    stage: "G2",
    sortOrder: 130,
  },
  {
    slug: "g-highway-merging-and-exiting",
    name: "Full G highway merging and exiting",
    description: "G road-test freeway skills: acceleration lanes, safe gaps, freeway spacing, exit planning, and ramp speed.",
    stage: "G",
    sortOrder: 210,
  },
  {
    slug: "g-advanced-lane-and-traffic-flow",
    name: "Full G lane changes and traffic flow",
    description: "Advanced full-G decisions: lane discipline, passing, mirrors, blind spots, speed control, and space management.",
    stage: "G",
    sortOrder: 220,
  },
  {
    slug: "g-road-test-readiness",
    name: "Full G road-test readiness",
    description: "Full-G preparation: route planning, highway comfort, adverse conditions, and self-assessment before booking.",
    stage: "G",
    sortOrder: 230,
  },
];

export const ontarioRoadTestSeedQuestions: RoadTestSeedQuestion[] = [
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#g2-road-test-g1-exit-test`,
    categorySlug: "g2-road-test-readiness",
    prompt: "What is the G2 road test mainly checking after the G1 stage?",
    explanation: "Ontario describes the G2 road test as the G1 exit test. It checks whether a new driver can safely handle basic road-test tasks and make responsible decisions in traffic.",
    choices: [
      { text: "Whether you can safely handle basic driving tasks in traffic", isCorrect: true },
      { text: "Whether you can drive on freeways without supervision", isCorrect: false },
      { text: "Whether you know every mechanical part of the vehicle", isCorrect: false },
      { text: "Whether you can park without ever using mirrors", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#turning-a-corner`,
    categorySlug: "g2-turns-parking-and-control",
    prompt: "Before a road-test turn, what should you do before entering the turn?",
    explanation: "The Ontario handbook tells drivers to signal, look side to side, check blind spots, slow before the turn, and enter only when the path is clear.",
    choices: [
      { text: "Signal, scan, check blind spots, slow, and turn only when clear", isCorrect: true },
      { text: "Enter the turn first, then check mirrors", isCorrect: false },
      { text: "Accelerate to finish the turn quickly", isCorrect: false },
      { text: "Watch only the vehicle directly ahead", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#right-turn-on-a-red-light`,
    categorySlug: "g2-observation-and-right-of-way",
    prompt: "What is required before turning right on a red light where it is permitted?",
    explanation: "A right turn on red requires a complete stop first. You must yield to pedestrians and traffic and proceed only if the way is clear and no sign prohibits the turn.",
    choices: [
      { text: "Stop completely, yield, and turn only when clear and allowed", isCorrect: true },
      { text: "Roll through slowly if cross traffic is light", isCorrect: false },
      { text: "Turn only after the driver behind you honks", isCorrect: false },
      { text: "Ignore pedestrians once they pass your lane", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#changing-lanes`,
    categorySlug: "g2-observation-and-right-of-way",
    prompt: "What observation habit should be clear during a G2 lane change?",
    explanation: "A safe lane change requires checking traffic, signalling, using mirrors, checking blind spots, and moving only when there is a safe gap.",
    choices: [
      { text: "Mirror check, signal, blind-spot check, then move into a safe gap", isCorrect: true },
      { text: "Signal after entering the next lane", isCorrect: false },
      { text: "Use mirrors only because blind spots are optional", isCorrect: false },
      { text: "Move first so other drivers can react", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.parking}#roadside-stop`,
    categorySlug: "g2-turns-parking-and-control",
    prompt: "What should you remember during a roadside stop on a road test?",
    explanation: "Roadside stops require choosing a safe place, signalling, checking traffic, stopping close and parallel to the curb or road edge, and checking before opening a door or pulling out.",
    choices: [
      { text: "Signal, choose a safe place, stop close to the edge, and check before moving", isCorrect: true },
      { text: "Stop wherever the examiner asks, even if it blocks traffic", isCorrect: false },
      { text: "Open the door immediately to show you are parked", isCorrect: false },
      { text: "Pull out without signalling if traffic looks far away", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.parking}#parallel-parking`,
    categorySlug: "g2-turns-parking-and-control",
    prompt: "What is the safest approach to parallel parking on a road test?",
    explanation: "Parallel parking should be controlled and observant: signal, check around the vehicle, reverse slowly, use reference points, and stop without hitting the curb or creating a hazard.",
    choices: [
      { text: "Signal, check around, reverse slowly, and maintain control", isCorrect: true },
      { text: "Reverse quickly so traffic is delayed for less time", isCorrect: false },
      { text: "Ignore vehicles behind once reverse lights are on", isCorrect: false },
      { text: "Mount the curb if it helps straighten the vehicle", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#left-turns`,
    categorySlug: "g2-observation-and-right-of-way",
    prompt: "When turning left, what should you do before crossing oncoming traffic?",
    explanation: "A left turn must be made from the proper lane after signalling and checking. Yield to oncoming traffic and pedestrians, and turn only when there is a safe gap.",
    choices: [
      { text: "Yield to oncoming traffic and pedestrians until there is a safe gap", isCorrect: true },
      { text: "Assume oncoming traffic will slow for you", isCorrect: false },
      { text: "Begin turning before checking pedestrians", isCorrect: false },
      { text: "Turn wide into any lane that is open", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#booking-a-road-test`,
    categorySlug: "g2-road-test-readiness",
    prompt: "Before booking a G2 road test, what should your practice show?",
    explanation: "A learner should be consistently safe before booking: smooth control, legal stops, proper observation, signalling, yielding, and calm corrections without examiner intervention.",
    choices: [
      { text: "Consistent safe decisions without needing reminders or intervention", isCorrect: true },
      { text: "One lucky perfect route with no traffic", isCorrect: false },
      { text: "Only parking practice, because moving traffic is not tested", isCorrect: false },
      { text: "Confidence even if rules are still uncertain", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#driving-through-roundabouts`,
    categorySlug: "g2-observation-and-right-of-way",
    prompt: "What should you do when approaching a roundabout?",
    explanation: "At a roundabout, slow down, choose the correct lane, yield to traffic already in the roundabout and to pedestrians, then signal and exit safely.",
    choices: [
      { text: "Slow, choose the correct lane, yield, and exit with care", isCorrect: true },
      { text: "Enter quickly because traffic inside must stop", isCorrect: false },
      { text: "Stop inside the roundabout to decide your exit", isCorrect: false },
      { text: "Change lanes inside without checking", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.parking}#parking-on-a-hill`,
    categorySlug: "g2-turns-parking-and-control",
    prompt: "Why do hill-parking wheel positions matter on a road test?",
    explanation: "Correct wheel position reduces the chance of a parked vehicle rolling into traffic if the brakes fail. Ontario distinguishes downhill, uphill with a curb, and uphill without a curb.",
    choices: [
      { text: "They help prevent the vehicle from rolling into traffic", isCorrect: true },
      { text: "They make it easier to leave without checking", isCorrect: false },
      { text: "They are only needed for manual transmission vehicles", isCorrect: false },
      { text: "They replace the need for a parking brake", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#what-happens-if-i-fail-a-g1-or-g2-road-test`,
    categorySlug: "g2-road-test-readiness",
    prompt: "What mindset is safest if you make a minor mistake during the G2 test?",
    explanation: "A minor error should be corrected calmly and safely. Do not rush, panic, or make a second unsafe move; continue applying observation, speed control, and right-of-way rules.",
    choices: [
      { text: "Correct calmly and continue making safe legal decisions", isCorrect: true },
      { text: "Speed up to make up lost time", isCorrect: false },
      { text: "Argue with the examiner while driving", isCorrect: false },
      { text: "Ignore mirrors until you feel settled again", isCorrect: false },
    ],
  },
  {
    stage: "G2",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#passing`,
    categorySlug: "g2-observation-and-right-of-way",
    prompt: "When passing on a two-way road, what must be true before you move out?",
    explanation: "Passing requires a legal passing zone, a clear view, enough distance from oncoming traffic, and enough space to return without cutting off the vehicle passed.",
    choices: [
      { text: "It is legal, clear, and there is enough space to return safely", isCorrect: true },
      { text: "The vehicle ahead is slower than you prefer", isCorrect: false },
      { text: "You can see only partway over a hill", isCorrect: false },
      { text: "You plan to return immediately in front of the other vehicle", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.levelTwoRoadTest}#freeway`,
    categorySlug: "g-highway-merging-and-exiting",
    prompt: "What is the G road test looking for when you enter a freeway?",
    explanation: "The Level Two road test includes freeway driving. Entering safely means using the acceleration lane, matching traffic speed where safe, signalling, checking mirrors and blind spots, and merging into a safe gap.",
    choices: [
      { text: "Build speed, signal, check mirrors and blind spots, and merge into a safe gap", isCorrect: true },
      { text: "Stop at the end of the acceleration lane every time", isCorrect: false },
      { text: "Merge slowly so freeway traffic can easily see you", isCorrect: false },
      { text: "Enter first, then check for vehicles around you", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.freewayDriving}#driving-along-a-freeway`,
    categorySlug: "g-advanced-lane-and-traffic-flow",
    prompt: "Why should full-G candidates keep a large space cushion on freeways?",
    explanation: "Freeway speeds reduce reaction time. Keeping space ahead, behind, and beside your vehicle gives you time to respond and avoids cutting off other vehicles during lane changes or merges.",
    choices: [
      { text: "Higher speeds need more reaction time and room for safe decisions", isCorrect: true },
      { text: "It lets you ignore the speed limit", isCorrect: false },
      { text: "It means mirror checks are no longer needed", isCorrect: false },
      { text: "It is needed only when roads are empty", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.levelTwoRoadTest}#lane-change`,
    categorySlug: "g-advanced-lane-and-traffic-flow",
    prompt: "During a full-G lane change, what should the examiner clearly see?",
    explanation: "The Level Two road test includes lane changes. The examiner should see planning, mirror checks, signalling, blind-spot checks, speed control, and a smooth move into a safe gap.",
    choices: [
      { text: "Plan, mirror check, signal, blind-spot check, and move smoothly", isCorrect: true },
      { text: "A fast move before signalling so traffic cannot block you", isCorrect: false },
      { text: "A lane change based only on the rear-view mirror", isCorrect: false },
      { text: "A sudden brake before every lane change", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.levelTwoRoadTest}#freeway`,
    categorySlug: "g-highway-merging-and-exiting",
    prompt: "How should you leave a freeway during the G test?",
    explanation: "Leaving a freeway safely means planning ahead, signalling, moving to the exit lane early, maintaining control, and reducing speed on the deceleration lane or ramp rather than surprising through traffic.",
    choices: [
      { text: "Plan early, signal, enter the exit lane safely, and slow on the ramp", isCorrect: true },
      { text: "Brake hard in the through lane as soon as you see the exit", isCorrect: false },
      { text: "Cross several lanes at the last second", isCorrect: false },
      { text: "Reverse on the shoulder if you miss the exit", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.freewayDriving}#driving-along-a-freeway`,
    categorySlug: "g-advanced-lane-and-traffic-flow",
    prompt: "Which lane should slower traffic generally use on a multi-lane freeway?",
    explanation: "Ontario's freeway-driving guidance directs slower traffic to keep right. The left lane is generally for passing or faster traffic where permitted by signs and conditions.",
    choices: [
      { text: "The right lane", isCorrect: true },
      { text: "The far-left lane at all times", isCorrect: false },
      { text: "The shoulder", isCorrect: false },
      { text: "Whichever lane has the most traffic", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.levelTwoRoadTest}#business-section`,
    categorySlug: "g-road-test-readiness",
    prompt: "Why does the full-G test include business and residential sections?",
    explanation: "The Level Two road test includes different traffic environments so the examiner can see speed choice, scanning, lane position, yielding, and hazard response in real-world conditions.",
    choices: [
      { text: "To check safe decisions across different traffic environments", isCorrect: true },
      { text: "To avoid testing freeway skills", isCorrect: false },
      { text: "To test only parking-lot steering", isCorrect: false },
      { text: "To let drivers choose any speed that feels comfortable", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#passing`,
    categorySlug: "g-advanced-lane-and-traffic-flow",
    prompt: "What makes a pass or lane change unsafe on a higher-speed road?",
    explanation: "It is unsafe to cut off another vehicle, move without a clear gap, fail to signal or check blind spots, or pass when the view and legal markings do not allow it.",
    choices: [
      { text: "Moving without a legal clear gap and proper observation", isCorrect: true },
      { text: "Waiting for a larger space cushion", isCorrect: false },
      { text: "Cancelling a lane change when conditions change", isCorrect: false },
      { text: "Keeping right when not passing", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#g-road-test-g2-exit-test`,
    categorySlug: "g-road-test-readiness",
    prompt: "What should a G2 driver be comfortable with before booking the full G road test?",
    explanation: "Ontario's full G road test is the G2 exit test and includes more advanced driving, including freeway skills where available. Candidates should be comfortable with city and highway decisions before booking.",
    choices: [
      { text: "Consistent city and highway decisions without unsafe prompts", isCorrect: true },
      { text: "Only quiet residential routes", isCorrect: false },
      { text: "Freeway merging for the first time during the test", isCorrect: false },
      { text: "Relying on the examiner to announce every hazard", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.freewayDriving}#leaving-a-freeway`,
    categorySlug: "g-highway-merging-and-exiting",
    prompt: "Why is planning ahead for a freeway exit important?",
    explanation: "Planning early gives you time to signal, check mirrors and blind spots, move to the correct lane, and reduce speed on the ramp without surprising drivers behind you.",
    choices: [
      { text: "It prevents sudden lane changes or braking near the exit", isCorrect: true },
      { text: "It lets you ignore ramp advisory speeds", isCorrect: false },
      { text: "It means you can cross multiple lanes at the gore", isCorrect: false },
      { text: "It removes the need to signal", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.levelTwoRoadTest}#roadside-stop`,
    categorySlug: "g-road-test-readiness",
    prompt: "What does a roadside stop show on the Level Two road test?",
    explanation: "A roadside stop checks observation, signalling, safe positioning, smooth stopping, and safe re-entry into traffic. It is not just a parking task.",
    choices: [
      { text: "Observation, signalling, safe position, control, and re-entry", isCorrect: true },
      { text: "Only whether the wheels touch the curb", isCorrect: false },
      { text: "How quickly you can stop without checking", isCorrect: false },
      { text: "Whether you can block a lane briefly", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.freewayDriving}#entering-a-freeway`,
    categorySlug: "g-highway-merging-and-exiting",
    prompt: "If freeway traffic is heavy, what should you do while merging?",
    explanation: "Use the acceleration lane to look for a safe gap, signal, adjust speed smoothly, and merge without forcing another driver to brake sharply or swerve.",
    choices: [
      { text: "Signal, adjust speed smoothly, and merge into a safe gap", isCorrect: true },
      { text: "Force your way in because ramp traffic has priority", isCorrect: false },
      { text: "Stop suddenly in the live lane", isCorrect: false },
      { text: "Drive on the shoulder until traffic clears", isCorrect: false },
    ],
  },
  {
    stage: "G",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#what-happens-if-i-fail-a-g1-or-g2-road-test`,
    categorySlug: "g-road-test-readiness",
    prompt: "What is the safest response if you miss an instruction or exit during the full G test?",
    explanation: "Stay calm and legal. Do not make a sudden unsafe lane change, stop, or reverse; continue safely and follow the examiner's next instruction.",
    choices: [
      { text: "Continue safely and wait for the next legal instruction", isCorrect: true },
      { text: "Cut across lanes immediately to recover", isCorrect: false },
      { text: "Stop on the freeway shoulder to ask what to do", isCorrect: false },
      { text: "Reverse if you have just passed the exit", isCorrect: false },
    ],
  },
];

export const ontarioRoadTestChecklistItems: RoadTestSeedChecklistItem[] = [
  {
    stage: "G2",
    section: "BEFORE_TEST",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#booking-a-road-test`,
    categorySlug: "g2-road-test-readiness",
    title: "Practise full observation routines",
    description: "Before booking, make mirror checks, blind-spot checks, signals, and left-right scans automatic at every turn, lane change, stop, and parking move.",
    sortOrder: 10,
  },
  {
    stage: "G2",
    section: "BEFORE_TEST",
    sourceReference: `${ontarioRoadTestSourceUrls.parking}#parallel-parking`,
    categorySlug: "g2-turns-parking-and-control",
    title: "Rehearse parking and roadside stops",
    description: "Practise parallel parking, hill parking, roadside stops, and safe pull-outs until you can do them slowly with full traffic checks.",
    sortOrder: 20,
  },
  {
    stage: "G2",
    section: "DURING_TEST",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#turning-a-corner`,
    categorySlug: "g2-observation-and-right-of-way",
    title: "Slow before every turn",
    description: "Finish braking before the turn, scan for pedestrians and traffic, check blind spots where needed, then accelerate only after the vehicle is straight and safe.",
    sortOrder: 30,
  },
  {
    stage: "G2",
    section: "DURING_TEST",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#changing-lanes`,
    categorySlug: "g2-observation-and-right-of-way",
    title: "Make lane changes obvious and calm",
    description: "The examiner should see a mirror check, signal, blind-spot check, safe gap selection, smooth steering, and stable speed before and during each lane change.",
    sortOrder: 40,
  },
  {
    stage: "G2",
    section: "COMMON_FAIL_REASONS",
    sourceReference: `${ontarioRoadTestSourceUrls.changingDirections}#left-turns`,
    categorySlug: "g2-observation-and-right-of-way",
    title: "Do not force left turns",
    description: "A left turn becomes unsafe when you rush across oncoming traffic, miss pedestrians, turn wide, or move before the path is clearly open.",
    sortOrder: 50,
  },
  {
    stage: "G2",
    section: "COMMON_FAIL_REASONS",
    sourceReference: `${ontarioRoadTestSourceUrls.parking}#roadside-stop`,
    categorySlug: "g2-turns-parking-and-control",
    title: "Avoid unsafe pull-outs",
    description: "Pulling away from the curb without signalling, mirror checks, blind-spot checks, and a safe traffic gap can create an immediate road-test safety problem.",
    sortOrder: 60,
  },
  {
    stage: "G2",
    section: "SELF_ASSESSMENT",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#g2-road-test-g1-exit-test`,
    categorySlug: "g2-road-test-readiness",
    title: "Pass three mock G2 routes",
    description: "Before booking, complete at least three mock routes with no rolling stops, missed blind spots, rushed turns, curb hits, or instructor safety interventions.",
    sortOrder: 70,
  },
  {
    stage: "G2",
    section: "SELF_ASSESSMENT",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#what-happens-if-i-fail-a-g1-or-g2-road-test`,
    categorySlug: "g2-road-test-readiness",
    title: "Recover calmly from mistakes",
    description: "A ready driver can correct a small positioning or timing mistake without panic, argument, speeding, or making a second unsafe move.",
    sortOrder: 80,
  },
  {
    stage: "G",
    section: "BEFORE_TEST",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#g-road-test-g2-exit-test`,
    categorySlug: "g-road-test-readiness",
    title: "Practise highway comfort before booking",
    description: "Book the full G only when freeway merging, lane changes, following distance, and exits feel routine in normal traffic, not brand new.",
    sortOrder: 110,
  },
  {
    stage: "G",
    section: "BEFORE_TEST",
    sourceReference: `${ontarioRoadTestSourceUrls.levelTwoRoadTest}#freeway`,
    categorySlug: "g-highway-merging-and-exiting",
    title: "Rehearse merge and exit sequences",
    description: "Practise acceleration-lane speed matching, signalling, blind-spot checks, safe gap selection, exit planning, and ramp-speed control as one repeatable sequence.",
    sortOrder: 120,
  },
  {
    stage: "G",
    section: "DURING_TEST",
    sourceReference: `${ontarioRoadTestSourceUrls.freewayDriving}#entering-a-freeway`,
    categorySlug: "g-highway-merging-and-exiting",
    title: "Use the acceleration lane fully",
    description: "On the test, build appropriate speed, keep checking mirrors and blind spots, and merge only into a safe gap without surprising freeway traffic.",
    sortOrder: 130,
  },
  {
    stage: "G",
    section: "DURING_TEST",
    sourceReference: `${ontarioRoadTestSourceUrls.levelTwoRoadTest}#lane-change`,
    categorySlug: "g-advanced-lane-and-traffic-flow",
    title: "Keep lane changes smooth",
    description: "A full-G lane change should show planning, signal timing, mirror and shoulder checks, stable speed, and a smooth move into open space.",
    sortOrder: 140,
  },
  {
    stage: "G",
    section: "COMMON_FAIL_REASONS",
    sourceReference: `${ontarioRoadTestSourceUrls.freewayDriving}#leaving-a-freeway`,
    categorySlug: "g-highway-merging-and-exiting",
    title: "Do not make last-second exits",
    description: "Crossing lanes late, braking suddenly in through traffic, or trying to recover a missed exit can be more dangerous than simply continuing safely.",
    sortOrder: 150,
  },
  {
    stage: "G",
    section: "COMMON_FAIL_REASONS",
    sourceReference: `${ontarioRoadTestSourceUrls.freewayDriving}#driving-along-a-freeway`,
    categorySlug: "g-advanced-lane-and-traffic-flow",
    title: "Avoid cutting off traffic",
    description: "At freeway speeds, small gaps disappear quickly. Do not merge, pass, or change lanes unless another driver can maintain speed and space safely.",
    sortOrder: 160,
  },
  {
    stage: "G",
    section: "SELF_ASSESSMENT",
    sourceReference: `${ontarioRoadTestSourceUrls.levelTwoRoadTest}#freeway`,
    categorySlug: "g-road-test-readiness",
    title: "Complete three highway mock drives",
    description: "Before booking, complete at least three practice drives with safe merges, lane changes, exits, spacing, and speed control without instructor intervention.",
    sortOrder: 170,
  },
  {
    stage: "G",
    section: "SELF_ASSESSMENT",
    sourceReference: `${ontarioRoadTestSourceUrls.newDrivers}#what-happens-if-i-fail-a-g1-or-g2-road-test`,
    categorySlug: "g-road-test-readiness",
    title: "Missed exit recovery is safe",
    description: "A ready full-G driver can miss a turn or exit and continue legally without abrupt braking, shoulder use, reversing, or unsafe multi-lane moves.",
    sortOrder: 180,
  },
];

export function getOntarioRoadTestSeedSummary() {
  const questionCountsByStage = ontarioRoadTestSeedQuestions.reduce<Record<LicenseStage, number>>((acc, question) => {
    acc[question.stage] += 1;
    return acc;
  }, { G1: 0, G2: 0, G: 0 });
  const checklistCountsByStage = ontarioRoadTestChecklistItems.reduce<Record<LicenseStage, number>>((acc, item) => {
    acc[item.stage] += 1;
    return acc;
  }, { G1: 0, G2: 0, G: 0 });

  return {
    categoryCount: ontarioRoadTestSeedCategories.length,
    questionCount: ontarioRoadTestSeedQuestions.length,
    checklistCount: ontarioRoadTestChecklistItems.length,
    sourceCount: Object.keys(ontarioRoadTestSourceUrls).length,
    questionCountsByStage,
    checklistCountsByStage,
  };
}
