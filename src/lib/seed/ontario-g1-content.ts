export type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type SeedQuestionChoice = {
  text: string;
  isCorrect: boolean;
};

export type SeedQuestion = {
  sourceReference: string;
  categorySlug: string;
  prompt: string;
  explanation: string;
  choices: SeedQuestionChoice[];
};

export const ontarioG1SourceUrls = {
  signsAndLights: "https://www.ontario.ca/document/official-mto-drivers-handbook/traffic-signs-and-lights",
  intersections: "https://www.ontario.ca/document/official-mto-drivers-handbook/driving-through-intersections",
  sharingRoad: "https://www.ontario.ca/document/official-mto-drivers-handbook/sharing-road-other-road-users",
  safeDriving: "https://www.ontario.ca/document/official-mto-drivers-handbook/safe-and-responsible-driving",
} as const;

export const ontarioG1SeedCategories: SeedCategory[] = [
  {
    slug: "g1-signs-and-lights",
    name: "Signs and traffic lights",
    description: "Regulatory signs, warning signs, lane-use signals, and traffic lights from the Ontario driver handbook.",
    sortOrder: 10,
  },
  {
    slug: "g1-right-of-way",
    name: "Intersections and right-of-way",
    description: "Controlled and uncontrolled intersections, stop signs, yield rules, turns, and pedestrian crossovers.",
    sortOrder: 20,
  },
  {
    slug: "g1-sharing-the-road",
    name: "Sharing the road",
    description: "Pedestrians, cyclists, school buses, emergency vehicles, and other road users.",
    sortOrder: 30,
  },
  {
    slug: "g1-safe-driving",
    name: "Safe driving basics",
    description: "Following distance, signalling, blind spots, seat belts, and responsible driving habits.",
    sortOrder: 40,
  },
  {
    slug: "g1-special-conditions",
    name: "Special conditions",
    description: "Railway crossings, night driving, bad weather, and reduced visibility.",
    sortOrder: 50,
  },
];

export const ontarioG1SeedQuestions: SeedQuestion[] = [
  {
    sourceReference: `${ontarioG1SourceUrls.intersections}#controlled-intersections`,
    categorySlug: "g1-right-of-way",
    prompt: "At a stop sign, what must you do before entering the intersection?",
    explanation: "Ontario's handbook treats stop signs as controlled intersections. You must come to a complete stop, check for pedestrians and traffic, yield the right-of-way where required, and proceed only when it is safe.",
    choices: [
      { text: "Come to a complete stop, yield where required, and proceed only when safe", isCorrect: true },
      { text: "Slow down only if another vehicle is already in the intersection", isCorrect: false },
      { text: "Stop only when turning left", isCorrect: false },
      { text: "Honk and continue if you arrived first", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.intersections}#controlled-intersections`,
    categorySlug: "g1-right-of-way",
    prompt: "When two vehicles arrive at an all-way stop at the same time, who should go first?",
    explanation: "When vehicles reach an all-way stop at the same time, the driver on the left should yield to the driver on the right. You should still make sure the way is clear before moving.",
    choices: [
      { text: "The driver on the right", isCorrect: true },
      { text: "The driver turning left", isCorrect: false },
      { text: "The faster vehicle", isCorrect: false },
      { text: "The driver who honks first", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.intersections}#controlled-intersections`,
    categorySlug: "g1-right-of-way",
    prompt: "What does a yield sign require you to do?",
    explanation: "A yield sign means you must slow down or stop if necessary and give the right-of-way to traffic and pedestrians before proceeding.",
    choices: [
      { text: "Slow or stop if needed and give the right-of-way before proceeding", isCorrect: true },
      { text: "Speed up to merge ahead of other traffic", isCorrect: false },
      { text: "Stop for exactly three seconds every time", isCorrect: false },
      { text: "Only yield to vehicles, not pedestrians", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.intersections}#controlled-intersections`,
    categorySlug: "g1-right-of-way",
    prompt: "At an uncontrolled intersection, what should you do?",
    explanation: "At uncontrolled intersections, slow down, look carefully for pedestrians, cyclists and vehicles, and be ready to yield. If another vehicle arrives at the same time, yield to the vehicle on your right.",
    choices: [
      { text: "Slow down, scan all directions, and yield where required", isCorrect: true },
      { text: "Assume traffic on the larger road always stops", isCorrect: false },
      { text: "Drive through without slowing if there are no signs", isCorrect: false },
      { text: "Only look left before entering", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.intersections}#pedestrian-crossovers`,
    categorySlug: "g1-right-of-way",
    prompt: "At a pedestrian crossover, when may you proceed?",
    explanation: "Ontario's handbook says drivers must yield and wait for pedestrians to completely cross the road at pedestrian crossovers and school crossings with crossing guards before proceeding.",
    choices: [
      { text: "After pedestrians have completely crossed the road", isCorrect: true },
      { text: "As soon as pedestrians pass your lane", isCorrect: false },
      { text: "After waving pedestrians to hurry", isCorrect: false },
      { text: "Whenever the vehicle behind you honks", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.signsAndLights}#traffic-lights`,
    categorySlug: "g1-signs-and-lights",
    prompt: "What should you do at a steady red traffic light?",
    explanation: "A steady red light means stop. Stop before the stop line, crosswalk or intersection, and remain stopped until the signal changes and the way is clear.",
    choices: [
      { text: "Stop before the stop line, crosswalk or intersection", isCorrect: true },
      { text: "Continue if no police officer is present", isCorrect: false },
      { text: "Slow down and continue if the road looks empty", isCorrect: false },
      { text: "Stop only if turning left", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.signsAndLights}#traffic-lights`,
    categorySlug: "g1-signs-and-lights",
    prompt: "What does a flashing red traffic light mean?",
    explanation: "A flashing red light should be treated like a stop sign: stop completely, yield the right-of-way, and proceed only when safe.",
    choices: [
      { text: "Stop completely, yield, and proceed only when safe", isCorrect: true },
      { text: "Drive through because cross traffic has a flashing yellow", isCorrect: false },
      { text: "Slow down but do not stop", isCorrect: false },
      { text: "Stop only if another vehicle is visible", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.signsAndLights}#traffic-lights`,
    categorySlug: "g1-signs-and-lights",
    prompt: "What does a flashing yellow traffic light tell you?",
    explanation: "A flashing yellow light warns you to slow down, drive with caution, and be prepared to stop if necessary.",
    choices: [
      { text: "Slow down and proceed with caution", isCorrect: true },
      { text: "Stop and wait until it turns green", isCorrect: false },
      { text: "Speed up to clear the intersection", isCorrect: false },
      { text: "Treat it as a four-way stop every time", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.signsAndLights}#regulatory-signs`,
    categorySlug: "g1-signs-and-lights",
    prompt: "What is the purpose of regulatory signs such as stop, yield, and speed-limit signs?",
    explanation: "Regulatory signs tell drivers about traffic laws and must be obeyed. They are not just suggestions or warnings.",
    choices: [
      { text: "They tell drivers about rules that must be obeyed", isCorrect: true },
      { text: "They only give optional route advice", isCorrect: false },
      { text: "They apply only during rush hour", isCorrect: false },
      { text: "They are used only on highways", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.signsAndLights}#warning-signs`,
    categorySlug: "g1-signs-and-lights",
    prompt: "What do warning signs generally tell you?",
    explanation: "Warning signs alert drivers to hazards or changes ahead, such as curves, crossings, merging traffic, or road conditions, so drivers can adjust speed and position early.",
    choices: [
      { text: "A hazard or road condition is ahead", isCorrect: true },
      { text: "You must always stop immediately", isCorrect: false },
      { text: "The road is closed to all traffic", isCorrect: false },
      { text: "The sign applies only to trucks", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.sharingRoad}#sharing-the-road-with-school-buses`,
    categorySlug: "g1-sharing-the-road",
    prompt: "When a school bus has overhead amber lights flashing, what should nearby drivers do?",
    explanation: "The Ontario handbook says flashing amber lights mean the bus is preparing to stop to pick up or drop off passengers. Drivers should slow down and prepare to stop.",
    choices: [
      { text: "Slow down and prepare to stop", isCorrect: true },
      { text: "Pass quickly before the bus stops", isCorrect: false },
      { text: "Ignore the bus unless the stop arm is out", isCorrect: false },
      { text: "Stop only if you are directly behind the bus", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.sharingRoad}#sharing-the-road-with-school-buses`,
    categorySlug: "g1-sharing-the-road",
    prompt: "When a school bus is stopped with red lights flashing, what must drivers approaching from either direction generally do?",
    explanation: "Drivers must stop for a school bus with red lights flashing when approaching from the front or rear, unless they are on the opposite side of a road divided by a median strip.",
    choices: [
      { text: "Stop and remain stopped until the bus lights stop flashing or the bus moves", isCorrect: true },
      { text: "Pass slowly if no children are visible", isCorrect: false },
      { text: "Stop only behind the bus, never when approaching from the front", isCorrect: false },
      { text: "Honk before passing", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.sharingRoad}#emergency-vehicles`,
    categorySlug: "g1-sharing-the-road",
    prompt: "What should you do when an emergency vehicle approaches with siren or flashing lights?",
    explanation: "Move safely to the right and stop to let emergency vehicles pass. Do not block intersections, and check that the way is clear before moving again.",
    choices: [
      { text: "Move safely to the right and stop", isCorrect: true },
      { text: "Speed up to stay ahead of it", isCorrect: false },
      { text: "Stop in the middle of an intersection", isCorrect: false },
      { text: "Follow closely behind it through traffic", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.sharingRoad}#sharing-the-road-with-cyclists`,
    categorySlug: "g1-sharing-the-road",
    prompt: "Why should drivers check blind spots before turning or changing lanes near cyclists?",
    explanation: "Cyclists can be hard to see and may be beside or behind a vehicle. Checking mirrors and blind spots helps prevent cutting off or striking a cyclist.",
    choices: [
      { text: "Cyclists may be beside the vehicle where mirrors do not show them clearly", isCorrect: true },
      { text: "Cyclists always have to stop when cars turn", isCorrect: false },
      { text: "Blind spots matter only on expressways", isCorrect: false },
      { text: "Cyclists are required to ride only on sidewalks", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.safeDriving}#space`,
    categorySlug: "g1-safe-driving",
    prompt: "What is the two-second rule used for?",
    explanation: "The two-second rule is a simple way to check that you are leaving enough following distance from the vehicle ahead in normal conditions. More space is needed in poor weather or low visibility.",
    choices: [
      { text: "Checking a safe following distance", isCorrect: true },
      { text: "Timing how long to stop at every stop sign", isCorrect: false },
      { text: "Measuring how long to signal before every turn", isCorrect: false },
      { text: "Deciding when to shift gears", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.safeDriving}#signalling`,
    categorySlug: "g1-safe-driving",
    prompt: "Why should you signal well before turning or changing lanes?",
    explanation: "Signals tell other road users what you intend to do. Signalling early gives drivers, cyclists, and pedestrians time to react, but it does not give you the right-of-way by itself.",
    choices: [
      { text: "To warn other road users of your intentions before you move", isCorrect: true },
      { text: "Because signalling automatically gives you the right-of-way", isCorrect: false },
      { text: "Only to warn police officers", isCorrect: false },
      { text: "Only when another vehicle is directly behind you", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.safeDriving}#seatbelts`,
    categorySlug: "g1-safe-driving",
    prompt: "Who must wear a seat belt in a vehicle where seat belts are provided?",
    explanation: "Seat belts save lives and are required where provided. Drivers are responsible for making sure passengers under 16 are properly secured.",
    choices: [
      { text: "The driver and passengers where seat belts are provided", isCorrect: true },
      { text: "Only the driver", isCorrect: false },
      { text: "Only front-seat passengers", isCorrect: false },
      { text: "Only passengers under 16", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.safeDriving}#blind-spots`,
    categorySlug: "g1-safe-driving",
    prompt: "Before changing lanes, what should you do in addition to checking your mirrors?",
    explanation: "Mirrors do not show every area around your vehicle. Check your blind spot by looking over your shoulder before changing lanes.",
    choices: [
      { text: "Check your blind spot over your shoulder", isCorrect: true },
      { text: "Assume your mirrors show everything", isCorrect: false },
      { text: "Change lanes first, then signal", isCorrect: false },
      { text: "Rely only on other drivers to make room", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.safeDriving}#railway-crossings`,
    categorySlug: "g1-special-conditions",
    prompt: "At a railway crossing with flashing lights or a lowered gate, what must you do?",
    explanation: "Stop before the railway crossing when warning lights are flashing, gates are lowered, or a train is approaching. Proceed only when the signals stop and it is safe.",
    choices: [
      { text: "Stop and wait until it is safe to cross", isCorrect: true },
      { text: "Drive around the gate if the train looks far away", isCorrect: false },
      { text: "Stop on the tracks to get a better view", isCorrect: false },
      { text: "Cross quickly before the gate fully lowers", isCorrect: false },
    ],
  },
  {
    sourceReference: `${ontarioG1SourceUrls.safeDriving}#bad-weather`,
    categorySlug: "g1-special-conditions",
    prompt: "How should you adjust your driving in rain, snow, fog, or other poor conditions?",
    explanation: "Poor weather and reduced visibility require slower speeds, more following distance, smoother braking and steering, and lights when needed so you can see and be seen.",
    choices: [
      { text: "Slow down and leave more space", isCorrect: true },
      { text: "Follow closer so you can see the vehicle ahead", isCorrect: false },
      { text: "Use high beams in thick fog", isCorrect: false },
      { text: "Brake hard whenever traction is low", isCorrect: false },
    ],
  },
];

export function getOntarioG1SeedSummary() {
  return {
    categoryCount: ontarioG1SeedCategories.length,
    questionCount: ontarioG1SeedQuestions.length,
    sourceCount: Object.keys(ontarioG1SourceUrls).length,
  };
}
