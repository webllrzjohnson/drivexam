// Explicit immutable identities for bundled Ontario questions and choices.
// Update the associated text keys deliberately; never reuse a public ID for different content.

type SeedIdentity = {
  publicId: string;
  choices: Readonly<Record<string, string>>;
};

export const ontarioG1SeedIdentities: Readonly<Record<string, SeedIdentity>> = {
  "At a stop sign, what must you do before entering the intersection?": {
    "publicId": "ontario-g1-001",
    "choices": {
      "Come to a complete stop, yield where required, and proceed only when safe": "ontario-g1-001-choice-1",
      "Slow down only if another vehicle is already in the intersection": "ontario-g1-001-choice-2",
      "Stop only when turning left": "ontario-g1-001-choice-3",
      "Honk and continue if you arrived first": "ontario-g1-001-choice-4"
    }
  },
  "When two vehicles arrive at an all-way stop at the same time, who should go first?": {
    "publicId": "ontario-g1-002",
    "choices": {
      "The driver on the right": "ontario-g1-002-choice-1",
      "The driver turning left": "ontario-g1-002-choice-2",
      "The faster vehicle": "ontario-g1-002-choice-3",
      "The driver who honks first": "ontario-g1-002-choice-4"
    }
  },
  "What does a yield sign require you to do?": {
    "publicId": "ontario-g1-003",
    "choices": {
      "Slow or stop if needed and give the right-of-way before proceeding": "ontario-g1-003-choice-1",
      "Speed up to merge ahead of other traffic": "ontario-g1-003-choice-2",
      "Stop for exactly three seconds every time": "ontario-g1-003-choice-3",
      "Only yield to vehicles, not pedestrians": "ontario-g1-003-choice-4"
    }
  },
  "At an uncontrolled intersection, what should you do?": {
    "publicId": "ontario-g1-004",
    "choices": {
      "Slow down, scan all directions, and yield where required": "ontario-g1-004-choice-1",
      "Assume traffic on the larger road always stops": "ontario-g1-004-choice-2",
      "Drive through without slowing if there are no signs": "ontario-g1-004-choice-3",
      "Only look left before entering": "ontario-g1-004-choice-4"
    }
  },
  "At a pedestrian crossover, when may you proceed?": {
    "publicId": "ontario-g1-005",
    "choices": {
      "After pedestrians have completely crossed the road": "ontario-g1-005-choice-1",
      "As soon as pedestrians pass your lane": "ontario-g1-005-choice-2",
      "After waving pedestrians to hurry": "ontario-g1-005-choice-3",
      "Whenever the vehicle behind you honks": "ontario-g1-005-choice-4"
    }
  },
  "What should you do at a steady red traffic light?": {
    "publicId": "ontario-g1-006",
    "choices": {
      "Stop before the stop line, crosswalk or intersection": "ontario-g1-006-choice-1",
      "Continue if no police officer is present": "ontario-g1-006-choice-2",
      "Slow down and continue if the road looks empty": "ontario-g1-006-choice-3",
      "Stop only if turning left": "ontario-g1-006-choice-4"
    }
  },
  "What does a flashing red traffic light mean?": {
    "publicId": "ontario-g1-007",
    "choices": {
      "Stop completely, yield, and proceed only when safe": "ontario-g1-007-choice-1",
      "Drive through because cross traffic has a flashing yellow": "ontario-g1-007-choice-2",
      "Slow down but do not stop": "ontario-g1-007-choice-3",
      "Stop only if another vehicle is visible": "ontario-g1-007-choice-4"
    }
  },
  "What does a flashing yellow traffic light tell you?": {
    "publicId": "ontario-g1-008",
    "choices": {
      "Slow down and proceed with caution": "ontario-g1-008-choice-1",
      "Stop and wait until it turns green": "ontario-g1-008-choice-2",
      "Speed up to clear the intersection": "ontario-g1-008-choice-3",
      "Treat it as a four-way stop every time": "ontario-g1-008-choice-4"
    }
  },
  "What is the purpose of regulatory signs such as stop, yield, and speed-limit signs?": {
    "publicId": "ontario-g1-009",
    "choices": {
      "They tell drivers about rules that must be obeyed": "ontario-g1-009-choice-1",
      "They only give optional route advice": "ontario-g1-009-choice-2",
      "They apply only during rush hour": "ontario-g1-009-choice-3",
      "They are used only on highways": "ontario-g1-009-choice-4"
    }
  },
  "What do warning signs generally tell you?": {
    "publicId": "ontario-g1-010",
    "choices": {
      "A hazard or road condition is ahead": "ontario-g1-010-choice-1",
      "You must always stop immediately": "ontario-g1-010-choice-2",
      "The road is closed to all traffic": "ontario-g1-010-choice-3",
      "The sign applies only to trucks": "ontario-g1-010-choice-4"
    }
  },
  "When a school bus has overhead amber lights flashing, what should nearby drivers do?": {
    "publicId": "ontario-g1-011",
    "choices": {
      "Slow down and prepare to stop": "ontario-g1-011-choice-1",
      "Pass quickly before the bus stops": "ontario-g1-011-choice-2",
      "Ignore the bus unless the stop arm is out": "ontario-g1-011-choice-3",
      "Stop only if you are directly behind the bus": "ontario-g1-011-choice-4"
    }
  },
  "When a school bus is stopped with red lights flashing, what must drivers approaching from either direction generally do?": {
    "publicId": "ontario-g1-012",
    "choices": {
      "Stop and remain stopped until the bus lights stop flashing or the bus moves": "ontario-g1-012-choice-1",
      "Pass slowly if no children are visible": "ontario-g1-012-choice-2",
      "Stop only behind the bus, never when approaching from the front": "ontario-g1-012-choice-3",
      "Honk before passing": "ontario-g1-012-choice-4"
    }
  },
  "What should you do when an emergency vehicle approaches with siren or flashing lights?": {
    "publicId": "ontario-g1-013",
    "choices": {
      "Move safely to the right and stop": "ontario-g1-013-choice-1",
      "Speed up to stay ahead of it": "ontario-g1-013-choice-2",
      "Stop in the middle of an intersection": "ontario-g1-013-choice-3",
      "Follow closely behind it through traffic": "ontario-g1-013-choice-4"
    }
  },
  "Why should drivers check blind spots before turning or changing lanes near cyclists?": {
    "publicId": "ontario-g1-014",
    "choices": {
      "Cyclists may be beside the vehicle where mirrors do not show them clearly": "ontario-g1-014-choice-1",
      "Cyclists always have to stop when cars turn": "ontario-g1-014-choice-2",
      "Blind spots matter only on expressways": "ontario-g1-014-choice-3",
      "Cyclists are required to ride only on sidewalks": "ontario-g1-014-choice-4"
    }
  },
  "What is the two-second rule used for?": {
    "publicId": "ontario-g1-015",
    "choices": {
      "Checking a safe following distance": "ontario-g1-015-choice-1",
      "Timing how long to stop at every stop sign": "ontario-g1-015-choice-2",
      "Measuring how long to signal before every turn": "ontario-g1-015-choice-3",
      "Deciding when to shift gears": "ontario-g1-015-choice-4"
    }
  },
  "Why should you signal well before turning or changing lanes?": {
    "publicId": "ontario-g1-016",
    "choices": {
      "To warn other road users of your intentions before you move": "ontario-g1-016-choice-1",
      "Because signalling automatically gives you the right-of-way": "ontario-g1-016-choice-2",
      "Only to warn police officers": "ontario-g1-016-choice-3",
      "Only when another vehicle is directly behind you": "ontario-g1-016-choice-4"
    }
  },
  "Who must wear a seat belt in a vehicle where seat belts are provided?": {
    "publicId": "ontario-g1-017",
    "choices": {
      "The driver and passengers where seat belts are provided": "ontario-g1-017-choice-1",
      "Only the driver": "ontario-g1-017-choice-2",
      "Only front-seat passengers": "ontario-g1-017-choice-3",
      "Only passengers under 16": "ontario-g1-017-choice-4"
    }
  },
  "Before changing lanes, what should you do in addition to checking your mirrors?": {
    "publicId": "ontario-g1-018",
    "choices": {
      "Check your blind spot over your shoulder": "ontario-g1-018-choice-1",
      "Assume your mirrors show everything": "ontario-g1-018-choice-2",
      "Change lanes first, then signal": "ontario-g1-018-choice-3",
      "Rely only on other drivers to make room": "ontario-g1-018-choice-4"
    }
  },
  "At a railway crossing with flashing lights or a lowered gate, what must you do?": {
    "publicId": "ontario-g1-019",
    "choices": {
      "Stop and wait until it is safe to cross": "ontario-g1-019-choice-1",
      "Drive around the gate if the train looks far away": "ontario-g1-019-choice-2",
      "Stop on the tracks to get a better view": "ontario-g1-019-choice-3",
      "Cross quickly before the gate fully lowers": "ontario-g1-019-choice-4"
    }
  },
  "How should you adjust your driving in rain, snow, fog, or other poor conditions?": {
    "publicId": "ontario-g1-020",
    "choices": {
      "Slow down and leave more space": "ontario-g1-020-choice-1",
      "Follow closer so you can see the vehicle ahead": "ontario-g1-020-choice-2",
      "Use high beams in thick fog": "ontario-g1-020-choice-3",
      "Brake hard whenever traction is low": "ontario-g1-020-choice-4"
    }
  },
  "Before turning a corner, what checks should you make?": {
    "publicId": "ontario-g1-021",
    "choices": {
      "Signal, scan the intersection, check blind spots, and turn only when clear": "ontario-g1-021-choice-1",
      "Turn first, then signal if another vehicle appears": "ontario-g1-021-choice-2",
      "Check only the mirror on the side you are turning toward": "ontario-g1-021-choice-3",
      "Speed up so the turn takes less time": "ontario-g1-021-choice-4"
    }
  },
  "Why should you slow down before entering a turn?": {
    "publicId": "ontario-g1-022",
    "choices": {
      "To keep control and finish braking before steering through the turn": "ontario-g1-022-choice-1",
      "Because vehicles must stop during every turn": "ontario-g1-022-choice-2",
      "So traffic behind you can pass on either side": "ontario-g1-022-choice-3",
      "Because signalling is not needed at low speed": "ontario-g1-022-choice-4"
    }
  },
  "From which lane should you normally make a right turn?": {
    "publicId": "ontario-g1-023",
    "choices": {
      "From the far right lane in your direction of travel": "ontario-g1-023-choice-1",
      "From the far left lane whenever traffic is light": "ontario-g1-023-choice-2",
      "From any lane if you signal after starting the turn": "ontario-g1-023-choice-3",
      "From the oncoming lane to make the turn wider": "ontario-g1-023-choice-4"
    }
  },
  "What must you do before turning right on a red light where it is allowed?": {
    "publicId": "ontario-g1-024",
    "choices": {
      "Stop first, yield to pedestrians and traffic, then turn only if clear": "ontario-g1-024-choice-1",
      "Slow down but keep moving if no car is directly in front": "ontario-g1-024-choice-2",
      "Turn right on red even when a sign prohibits it": "ontario-g1-024-choice-3",
      "Honk before turning so pedestrians know to stop": "ontario-g1-024-choice-4"
    }
  },
  "What is the safe sequence before changing lanes?": {
    "publicId": "ontario-g1-025",
    "choices": {
      "Check traffic, signal, check mirrors and blind spots, then move when safe": "ontario-g1-025-choice-1",
      "Signal only after your vehicle is halfway into the new lane": "ontario-g1-025-choice-2",
      "Rely on other drivers to brake and create a gap": "ontario-g1-025-choice-3",
      "Change lanes quickly without checking if your speed is higher": "ontario-g1-025-choice-4"
    }
  },
  "When passing another vehicle, what should guide your decision?": {
    "publicId": "ontario-g1-026",
    "choices": {
      "Pass only when legal, clear, and there is enough space to return safely": "ontario-g1-026-choice-1",
      "Pass whenever the vehicle ahead is below the speed limit": "ontario-g1-026-choice-2",
      "Pass on hills because oncoming drivers can see you sooner": "ontario-g1-026-choice-3",
      "Return to the lane immediately in front of the vehicle you passed": "ontario-g1-026-choice-4"
    }
  },
  "What should you do on a freeway acceleration lane?": {
    "publicId": "ontario-g1-027",
    "choices": {
      "Build speed, signal, check for a safe gap, and merge smoothly": "ontario-g1-027-choice-1",
      "Stop at the end of the lane unless traffic is completely empty": "ontario-g1-027-choice-2",
      "Merge immediately at low speed to get out of the lane": "ontario-g1-027-choice-3",
      "Expect freeway traffic to move aside automatically": "ontario-g1-027-choice-4"
    }
  },
  "On a freeway, why is a safe following distance especially important?": {
    "publicId": "ontario-g1-028",
    "choices": {
      "Higher speeds require more time and space to react safely": "ontario-g1-028-choice-1",
      "It lets you drive above the speed limit safely": "ontario-g1-028-choice-2",
      "It means you do not need to check mirrors": "ontario-g1-028-choice-3",
      "It is only needed when driving in the far left lane": "ontario-g1-028-choice-4"
    }
  },
  "Which lane should slower traffic generally use on a multi-lane freeway?": {
    "publicId": "ontario-g1-029",
    "choices": {
      "The right lane": "ontario-g1-029-choice-1",
      "The far left lane at all times": "ontario-g1-029-choice-2",
      "The shoulder": "ontario-g1-029-choice-3",
      "Whichever lane has the most vehicles": "ontario-g1-029-choice-4"
    }
  },
  "How should you leave a freeway safely?": {
    "publicId": "ontario-g1-030",
    "choices": {
      "Plan ahead, signal, move safely to the exit lane, and slow on the ramp": "ontario-g1-030-choice-1",
      "Brake hard in the through lane when you see the exit": "ontario-g1-030-choice-2",
      "Cross several lanes at the last second": "ontario-g1-030-choice-3",
      "Reverse on the shoulder if you miss the exit": "ontario-g1-030-choice-4"
    }
  },
  "What should new drivers know about HOV lanes?": {
    "publicId": "ontario-g1-031",
    "choices": {
      "They have special posted rules and markings that must be followed": "ontario-g1-031-choice-1",
      "They are open to every vehicle at all times": "ontario-g1-031-choice-2",
      "They are only for passing on the right": "ontario-g1-031-choice-3",
      "They remove the need to signal lane changes": "ontario-g1-031-choice-4"
    }
  },
  "When may you park in a space designated for people with disabilities?": {
    "publicId": "ontario-g1-032",
    "choices": {
      "Only when a valid Accessible Parking Permit is properly displayed": "ontario-g1-032-choice-1",
      "Whenever the space is empty for less than five minutes": "ontario-g1-032-choice-2",
      "If you leave your hazard lights on": "ontario-g1-032-choice-3",
      "If you are picking up food or mail quickly": "ontario-g1-032-choice-4"
    }
  },
  "When parking downhill, which way should you turn your front wheels?": {
    "publicId": "ontario-g1-033",
    "choices": {
      "Toward the curb or right shoulder": "ontario-g1-033-choice-1",
      "Toward the centre of the road": "ontario-g1-033-choice-2",
      "Straight ahead in every situation": "ontario-g1-033-choice-3",
      "Whichever way makes it easier to leave": "ontario-g1-033-choice-4"
    }
  },
  "When parking uphill with a curb, which way should you turn your wheels?": {
    "publicId": "ontario-g1-034",
    "choices": {
      "To the left, toward the road": "ontario-g1-034-choice-1",
      "To the right, away from the road": "ontario-g1-034-choice-2",
      "Straight ahead": "ontario-g1-034-choice-3",
      "Toward the sidewalk at a sharp angle": "ontario-g1-034-choice-4"
    }
  },
  "When parking uphill without a curb, why should you turn the wheels sharply to the right?": {
    "publicId": "ontario-g1-035",
    "choices": {
      "So the vehicle would roll off the road instead of into traffic": "ontario-g1-035-choice-1",
      "So the vehicle rolls into the nearest lane": "ontario-g1-035-choice-2",
      "Because the law requires wheels left in every uphill situation": "ontario-g1-035-choice-3",
      "To make the parking brake unnecessary": "ontario-g1-035-choice-4"
    }
  },
  "Before opening your door after a roadside stop, what should you do?": {
    "publicId": "ontario-g1-036",
    "choices": {
      "Check for traffic, cyclists, and pedestrians before opening it": "ontario-g1-036-choice-1",
      "Open it quickly so others know you are parked": "ontario-g1-036-choice-2",
      "Only check if you parked beside a bike lane": "ontario-g1-036-choice-3",
      "Leave the door partly open as a warning": "ontario-g1-036-choice-4"
    }
  },
  "What does overdriving your headlights mean?": {
    "publicId": "ontario-g1-037",
    "choices": {
      "Driving so fast you cannot stop within the distance your headlights show": "ontario-g1-037-choice-1",
      "Using high beams on a rural road": "ontario-g1-037-choice-2",
      "Driving with headlights on during daylight": "ontario-g1-037-choice-3",
      "Turning headlights off in a well-lit area": "ontario-g1-037-choice-4"
    }
  },
  "When should you use low-beam headlights around other vehicles at night?": {
    "publicId": "ontario-g1-038",
    "choices": {
      "Within 150 m of oncoming vehicles or 60 m when following": "ontario-g1-038-choice-1",
      "Only after another driver flashes their lights": "ontario-g1-038-choice-2",
      "Only on city streets with streetlights": "ontario-g1-038-choice-3",
      "Never; high beams are always safer at night": "ontario-g1-038-choice-4"
    }
  },
  "What is a safe response when fog becomes very thick?": {
    "publicId": "ontario-g1-039",
    "choices": {
      "Slow down, use low beams, and pull off safely if visibility is too poor": "ontario-g1-039-choice-1",
      "Use high beams so the fog reflects more light": "ontario-g1-039-choice-2",
      "Stop in the travelled lane until the fog clears": "ontario-g1-039-choice-3",
      "Speed up suddenly when the fog appears to thin": "ontario-g1-039-choice-4"
    }
  },
  "How can you reduce the risk of skidding on a slippery road?": {
    "publicId": "ontario-g1-040",
    "choices": {
      "Drive slower and use smooth braking, steering, and acceleration": "ontario-g1-040-choice-1",
      "Brake hard whenever the vehicle starts to slide": "ontario-g1-040-choice-2",
      "Accelerate quickly to regain traction": "ontario-g1-040-choice-3",
      "Steer aggressively to force the vehicle back into line": "ontario-g1-040-choice-4"
    }
  },
  "What does this sign tell a driver to do?": {
    "publicId": "ontario-g1-041",
    "choices": {
      "Come to a complete stop and proceed only when safe": "ontario-g1-041-choice-1",
      "Slow down only if cross traffic is present": "ontario-g1-041-choice-2",
      "Yield without stopping every time": "ontario-g1-041-choice-3",
      "Continue if the road appears clear": "ontario-g1-041-choice-4"
    }
  },
  "What does this sign require you to do?": {
    "publicId": "ontario-g1-042",
    "choices": {
      "Slow or stop if needed and yield the right-of-way": "ontario-g1-042-choice-1",
      "Stop for exactly three seconds no matter what": "ontario-g1-042-choice-2",
      "Speed up to merge first": "ontario-g1-042-choice-3",
      "Only yield to large trucks": "ontario-g1-042-choice-4"
    }
  },
  "What does the number shown on this sign mean?": {
    "publicId": "ontario-g1-043",
    "choices": {
      "The maximum legal speed is 50 km/h when conditions allow": "ontario-g1-043-choice-1",
      "The minimum speed is 50 km/h": "ontario-g1-043-choice-2",
      "The recommended ramp speed is 50 km/h": "ontario-g1-043-choice-3",
      "Only trucks must obey 50 km/h": "ontario-g1-043-choice-4"
    }
  },
  "What should this sign make you prepare for?": {
    "publicId": "ontario-g1-044",
    "choices": {
      "Children or pedestrians may be crossing; slow down and be ready to stop": "ontario-g1-044-choice-1",
      "A school bus lane begins and cars must enter it": "ontario-g1-044-choice-2",
      "The road is closed to all traffic": "ontario-g1-044-choice-3",
      "Only school buses may use the road": "ontario-g1-044-choice-4"
    }
  },
  "At the crossing shown by this sign, when may you proceed?": {
    "publicId": "ontario-g1-045",
    "choices": {
      "After pedestrians have completely crossed the road": "ontario-g1-045-choice-1",
      "As soon as pedestrians pass the front of your vehicle": "ontario-g1-045-choice-2",
      "When the driver behind you honks": "ontario-g1-045-choice-3",
      "If you wave pedestrians to wait": "ontario-g1-045-choice-4"
    }
  },
  "What hazard is this sign warning about?": {
    "publicId": "ontario-g1-046",
    "choices": {
      "A railway crossing is ahead": "ontario-g1-046-choice-1",
      "A one-way street begins": "ontario-g1-046-choice-2",
      "A school zone ends": "ontario-g1-046-choice-3",
      "A divided highway starts": "ontario-g1-046-choice-4"
    }
  },
  "What does this sign tell you about the road?": {
    "publicId": "ontario-g1-047",
    "choices": {
      "Traffic travels only in the direction of the arrow": "ontario-g1-047-choice-1",
      "You may drive either direction if the lane is clear": "ontario-g1-047-choice-2",
      "Only bicycles may use the road": "ontario-g1-047-choice-3",
      "The lane is for emergency vehicles only": "ontario-g1-047-choice-4"
    }
  },
  "What left-turn movement is prohibited by this sign?": {
    "publicId": "ontario-g1-048",
    "choices": {
      "Turning left": "ontario-g1-048-choice-1",
      "Turning right": "ontario-g1-048-choice-2",
      "Driving straight through": "ontario-g1-048-choice-3",
      "Stopping at the intersection": "ontario-g1-048-choice-4"
    }
  },
  "What right turn on red movement does this sign prohibit?": {
    "publicId": "ontario-g1-049",
    "choices": {
      "Turning right on a red light": "ontario-g1-049-choice-1",
      "Turning left": "ontario-g1-049-choice-2",
      "Driving straight through": "ontario-g1-049-choice-3",
      "Yielding to pedestrians": "ontario-g1-049-choice-4"
    }
  },
  "What does this sign mean?": {
    "publicId": "ontario-g1-050",
    "choices": {
      "Do not enter this road or ramp": "ontario-g1-050-choice-1",
      "Stop only if another vehicle is coming": "ontario-g1-050-choice-2",
      "The road is one way in your direction": "ontario-g1-050-choice-3",
      "Parking is allowed ahead": "ontario-g1-050-choice-4"
    }
  },
  "What movement does this sign prohibit?": {
    "publicId": "ontario-g1-051",
    "choices": {
      "Making a U-turn": "ontario-g1-051-choice-1",
      "Turning right": "ontario-g1-051-choice-2",
      "Parking beside the curb": "ontario-g1-051-choice-3",
      "Proceeding through the intersection": "ontario-g1-051-choice-4"
    }
  },
  "What should you do when this sign is posted at an obstruction or traffic island?": {
    "publicId": "ontario-g1-052",
    "choices": {
      "Keep to the right of the sign or obstruction": "ontario-g1-052-choice-1",
      "Turn left before the sign": "ontario-g1-052-choice-2",
      "Stop and wait for a flag person": "ontario-g1-052-choice-3",
      "Drive on either side": "ontario-g1-052-choice-4"
    }
  },
  "What should you prepare to do when this sign is shown?": {
    "publicId": "ontario-g1-053",
    "choices": {
      "Prepare to stop completely ahead": "ontario-g1-053-choice-1",
      "Speed up before the intersection": "ontario-g1-053-choice-2",
      "Ignore it if traffic is light": "ontario-g1-053-choice-3",
      "Stop only after passing the sign": "ontario-g1-053-choice-4"
    }
  },
  "What does this sign warn you is ahead?": {
    "publicId": "ontario-g1-054",
    "choices": {
      "A stop sign is ahead": "ontario-g1-054-choice-1",
      "A railway crossing is ahead": "ontario-g1-054-choice-2",
      "Only buses may continue": "ontario-g1-054-choice-3",
      "The road is closed ahead": "ontario-g1-054-choice-4"
    }
  },
  "What does this sign warn drivers about?": {
    "publicId": "ontario-g1-055",
    "choices": {
      "Traffic moves in both directions ahead": "ontario-g1-055-choice-1",
      "The road becomes one way": "ontario-g1-055-choice-2",
      "You must make a U-turn": "ontario-g1-055-choice-3",
      "Only bicycles are allowed ahead": "ontario-g1-055-choice-4"
    }
  },
  "What should this sign make you watch for in a school crossing area?": {
    "publicId": "ontario-g1-056",
    "choices": {
      "Children or pedestrians may be crossing ahead": "ontario-g1-056-choice-1",
      "A hidden driveway is ahead": "ontario-g1-056-choice-2",
      "No pedestrians are allowed": "ontario-g1-056-choice-3",
      "The sidewalk ends immediately": "ontario-g1-056-choice-4"
    }
  },
  "What road feature is this sign warning about?": {
    "publicId": "ontario-g1-057",
    "choices": {
      "A roundabout is ahead": "ontario-g1-057-choice-1",
      "A dead end is ahead": "ontario-g1-057-choice-2",
      "A tunnel is ahead": "ontario-g1-057-choice-3",
      "A school bus stop is ahead": "ontario-g1-057-choice-4"
    }
  },
  "What condition does this sign warn you about?": {
    "publicId": "ontario-g1-058",
    "choices": {
      "The road may be slippery": "ontario-g1-058-choice-1",
      "The road is closed to cars": "ontario-g1-058-choice-2",
      "The lane is for passing only": "ontario-g1-058-choice-3",
      "The speed limit ends": "ontario-g1-058-choice-4"
    }
  },
  "What does this sign tell you to expect at a left merge?": {
    "publicId": "ontario-g1-059",
    "choices": {
      "Traffic will merge from the right toward the left": "ontario-g1-059-choice-1",
      "The road ends immediately": "ontario-g1-059-choice-2",
      "All traffic must turn right": "ontario-g1-059-choice-3",
      "Parking starts on the shoulder": "ontario-g1-059-choice-4"
    }
  },
  "What does this sign tell you to expect at a right merge?": {
    "publicId": "ontario-g1-060",
    "choices": {
      "Traffic will merge from the left toward the right": "ontario-g1-060-choice-1",
      "You must stop for a flag person": "ontario-g1-060-choice-2",
      "The road changes to gravel": "ontario-g1-060-choice-3",
      "No vehicles may pass": "ontario-g1-060-choice-4"
    }
  },
  "What should you do when this right-then-left curve sign is shown?": {
    "publicId": "ontario-g1-061",
    "choices": {
      "Slow down before the road curves right and then left": "ontario-g1-061-choice-1",
      "Speed up through the curve": "ontario-g1-061-choice-2",
      "Move to the shoulder": "ontario-g1-061-choice-3",
      "Drive in the centre of the road": "ontario-g1-061-choice-4"
    }
  },
  "What should you do when this winding-road warning sign is shown?": {
    "publicId": "ontario-g1-062",
    "choices": {
      "Slow down before the successive curves": "ontario-g1-062-choice-1",
      "Pass another vehicle immediately": "ontario-g1-062-choice-2",
      "Stop in the lane": "ontario-g1-062-choice-3",
      "Turn on hazard lights and continue fast": "ontario-g1-062-choice-4"
    }
  },
  "What road user should this sign make you watch for?": {
    "publicId": "ontario-g1-063",
    "choices": {
      "Cyclists may be crossing or entering nearby": "ontario-g1-063-choice-1",
      "Only motorcycles may use the road": "ontario-g1-063-choice-2",
      "Bicycles are prohibited ahead": "ontario-g1-063-choice-3",
      "A truck inspection station is ahead": "ontario-g1-063-choice-4"
    }
  },
  "What does this sign identify for bicycle traffic?": {
    "publicId": "ontario-g1-064",
    "choices": {
      "A bicycle lane or route": "ontario-g1-064-choice-1",
      "A lane for motorcycles only": "ontario-g1-064-choice-2",
      "A no-passing zone": "ontario-g1-064-choice-3",
      "A temporary detour": "ontario-g1-064-choice-4"
    }
  },
  "When may you park where this sign applies?": {
    "publicId": "ontario-g1-065",
    "choices": {
      "Only during the posted times and time limit": "ontario-g1-065-choice-1",
      "Driving through the area": "ontario-g1-065-choice-2",
      "Stopping for pedestrians": "ontario-g1-065-choice-3",
      "Turning at the intersection": "ontario-g1-065-choice-4"
    }
  },
  "Who may use a space marked with this sign?": {
    "publicId": "ontario-g1-066",
    "choices": {
      "Vehicles displaying a valid Accessible Parking Permit": "ontario-g1-066-choice-1",
      "Any vehicle for less than five minutes": "ontario-g1-066-choice-2",
      "Only taxis and delivery vehicles": "ontario-g1-066-choice-3",
      "Anyone with hazard lights on": "ontario-g1-066-choice-4"
    }
  },
  "What should you expect when this construction sign is shown?": {
    "publicId": "ontario-g1-067",
    "choices": {
      "Road work or construction activity ahead": "ontario-g1-067-choice-1",
      "A permanent speed increase ahead": "ontario-g1-067-choice-2",
      "A ferry crossing ahead": "ontario-g1-067-choice-3",
      "A hospital zone ahead": "ontario-g1-067-choice-4"
    }
  },
  "What does this sign usually indicate in a construction zone?": {
    "publicId": "ontario-g1-068",
    "choices": {
      "Follow a temporary detour route": "ontario-g1-068-choice-1",
      "The road is open only to bicycles": "ontario-g1-068-choice-2",
      "Ignore the next traffic signal": "ontario-g1-068-choice-3",
      "Parking is free ahead": "ontario-g1-068-choice-4"
    }
  }
} as const;

export const ontarioRoadTestSeedIdentities: Readonly<Record<string, SeedIdentity>> = {
  "What is the G2 road test mainly checking after the G1 stage?": {
    "publicId": "ontario-road-test-001",
    "choices": {
      "Whether you can safely handle basic driving tasks in traffic": "ontario-road-test-001-choice-1",
      "Whether you can independently handle advanced freeway merging and exiting": "ontario-road-test-001-choice-2",
      "Whether you can perform low-speed control exercises without entering traffic": "ontario-road-test-001-choice-3",
      "Whether you can follow a route when observation and yielding are inconsistent": "ontario-road-test-001-choice-4"
    }
  },
  "Before a road-test turn, what should you do before entering the turn?": {
    "publicId": "ontario-road-test-002",
    "choices": {
      "Signal, scan, check blind spots, slow, and turn only when clear": "ontario-road-test-002-choice-1",
      "Enter the turn first, then check mirrors": "ontario-road-test-002-choice-2",
      "Accelerate to finish the turn quickly": "ontario-road-test-002-choice-3",
      "Watch only the vehicle directly ahead": "ontario-road-test-002-choice-4"
    }
  },
  "What is required before turning right on a red light where it is permitted?": {
    "publicId": "ontario-road-test-003",
    "choices": {
      "Stop completely, yield, and turn only when clear and allowed": "ontario-road-test-003-choice-1",
      "Roll through slowly if cross traffic is light": "ontario-road-test-003-choice-2",
      "Proceed after stopping if cross traffic appears likely to slow for you": "ontario-road-test-003-choice-3",
      "Ignore pedestrians once they pass your lane": "ontario-road-test-003-choice-4"
    }
  },
  "What observation habit should be clear during a G2 lane change?": {
    "publicId": "ontario-road-test-004",
    "choices": {
      "Mirror check, signal, blind-spot check, then move into a safe gap": "ontario-road-test-004-choice-1",
      "Signal after entering the next lane": "ontario-road-test-004-choice-2",
      "Signal and use the mirrors, then move if no vehicle is visible there": "ontario-road-test-004-choice-3",
      "Move first so other drivers can react": "ontario-road-test-004-choice-4"
    }
  },
  "What should you remember during a roadside stop on a road test?": {
    "publicId": "ontario-road-test-005",
    "choices": {
      "Signal, choose a safe place, stop close to the edge, and check before moving": "ontario-road-test-005-choice-1",
      "Use the first open curb space without checking signs or driveways": "ontario-road-test-005-choice-2",
      "End the manoeuvre as soon as the vehicle is near the curb": "ontario-road-test-005-choice-3",
      "Pull out without signalling if traffic looks far away": "ontario-road-test-005-choice-4"
    }
  },
  "What is the safest approach to parallel parking on a road test?": {
    "publicId": "ontario-road-test-006",
    "choices": {
      "Signal, check around, reverse slowly, and maintain control": "ontario-road-test-006-choice-1",
      "Reverse quickly so traffic is delayed for less time": "ontario-road-test-006-choice-2",
      "Ignore vehicles behind once reverse lights are on": "ontario-road-test-006-choice-3",
      "Mount the curb if it helps straighten the vehicle": "ontario-road-test-006-choice-4"
    }
  },
  "When turning left, what should you do before crossing oncoming traffic?": {
    "publicId": "ontario-road-test-007",
    "choices": {
      "Yield to oncoming traffic and pedestrians until there is a safe gap": "ontario-road-test-007-choice-1",
      "Assume oncoming traffic will slow for you": "ontario-road-test-007-choice-2",
      "Begin turning before checking pedestrians": "ontario-road-test-007-choice-3",
      "Turn wide into any lane that is open": "ontario-road-test-007-choice-4"
    }
  },
  "Before booking a G2 road test, what should your practice show?": {
    "publicId": "ontario-road-test-008",
    "choices": {
      "Consistent safe decisions without needing reminders or intervention": "ontario-road-test-008-choice-1",
      "One lucky perfect route with no traffic": "ontario-road-test-008-choice-2",
      "Repeated manoeuvre practice without combining the skills on full routes": "ontario-road-test-008-choice-3",
      "Confidence even if rules are still uncertain": "ontario-road-test-008-choice-4"
    }
  },
  "What should you do when approaching a roundabout?": {
    "publicId": "ontario-road-test-009",
    "choices": {
      "Slow, choose the correct lane, yield, and exit with care": "ontario-road-test-009-choice-1",
      "Enter quickly because traffic inside must stop": "ontario-road-test-009-choice-2",
      "Stop inside the roundabout to decide your exit": "ontario-road-test-009-choice-3",
      "Change lanes inside without checking": "ontario-road-test-009-choice-4"
    }
  },
  "Why do hill-parking wheel positions matter on a road test?": {
    "publicId": "ontario-road-test-010",
    "choices": {
      "They help prevent the vehicle from rolling into traffic": "ontario-road-test-010-choice-1",
      "They make it easier to leave without checking": "ontario-road-test-010-choice-2",
      "They are only needed for manual transmission vehicles": "ontario-road-test-010-choice-3",
      "They replace the need for a parking brake": "ontario-road-test-010-choice-4"
    }
  },
  "What mindset is safest if you make a minor mistake during the G2 test?": {
    "publicId": "ontario-road-test-011",
    "choices": {
      "Correct calmly and continue making safe legal decisions": "ontario-road-test-011-choice-1",
      "Try to recover the lost time before returning to normal speed": "ontario-road-test-011-choice-2",
      "Keep replaying the mistake while you continue driving": "ontario-road-test-011-choice-3",
      "Ignore mirrors until you feel settled again": "ontario-road-test-011-choice-4"
    }
  },
  "When passing on a two-way road, what must be true before you move out?": {
    "publicId": "ontario-road-test-012",
    "choices": {
      "It is legal, clear, and there is enough space to return safely": "ontario-road-test-012-choice-1",
      "The vehicle ahead is slower than you prefer": "ontario-road-test-012-choice-2",
      "You can see only partway over a hill": "ontario-road-test-012-choice-3",
      "You plan to return immediately in front of the other vehicle": "ontario-road-test-012-choice-4"
    }
  },
  "How should your speed change before making a right or left turn on the G2 test?": {
    "publicId": "ontario-road-test-013",
    "choices": {
      "Slow before the turn, control the vehicle, then accelerate when safe": "ontario-road-test-013-choice-1",
      "Brake halfway through every turn": "ontario-road-test-013-choice-2",
      "Accelerate into the turn to clear traffic quickly": "ontario-road-test-013-choice-3",
      "Coast through without checking speed": "ontario-road-test-013-choice-4"
    }
  },
  "Why should you scan left, centre, and right before entering an intersection?": {
    "publicId": "ontario-road-test-014",
    "choices": {
      "To confirm the full intersection path is clear before you enter": "ontario-road-test-014-choice-1",
      "To check the nearest traffic stream first and the remaining directions after entering": "ontario-road-test-014-choice-2",
      "To confirm the signal remains in your favour instead of reassessing crossing traffic": "ontario-road-test-014-choice-3",
      "To make one complete scan while approaching so you can proceed immediately after stopping": "ontario-road-test-014-choice-4"
    }
  },
  "What should you do if your view is blocked while waiting to turn left?": {
    "publicId": "ontario-road-test-015",
    "choices": {
      "Wait until you can see clearly and the gap is safe": "ontario-road-test-015-choice-1",
      "Follow closely behind the vehicle ahead because it has already created a gap": "ontario-road-test-015-choice-2",
      "Move far enough into the oncoming lane to improve your view before judging the gap": "ontario-road-test-015-choice-3",
      "Use the traffic-light timing to estimate when oncoming vehicles will stop": "ontario-road-test-015-choice-4"
    }
  },
  "Which lane should you normally enter after a left turn onto a multi-lane road?": {
    "publicId": "ontario-road-test-016",
    "choices": {
      "The lane closest to the centre line or median": "ontario-road-test-016-choice-1",
      "Any lane that has the fewest vehicles": "ontario-road-test-016-choice-2",
      "The far-right lane every time": "ontario-road-test-016-choice-3",
      "The shoulder until traffic clears": "ontario-road-test-016-choice-4"
    }
  },
  "Why is a wide turn a problem on a G2 road test?": {
    "publicId": "ontario-road-test-017",
    "choices": {
      "It can put the vehicle into the wrong lane or create a conflict": "ontario-road-test-017-choice-1",
      "It proves you are checking more of the road": "ontario-road-test-017-choice-2",
      "It is required whenever traffic is heavy": "ontario-road-test-017-choice-3",
      "It replaces the need for a signal": "ontario-road-test-017-choice-4"
    }
  },
  "What should you check for before a right turn on red after stopping?": {
    "publicId": "ontario-road-test-018",
    "choices": {
      "Signs, pedestrians, cyclists, and traffic before turning when clear": "ontario-road-test-018-choice-1",
      "Traffic approaching from the left, but not cyclists from the right": "ontario-road-test-018-choice-2",
      "Whether the vehicle ahead turned successfully through the same gap": "ontario-road-test-018-choice-3",
      "The near crosswalk only, then check the far side after starting the turn": "ontario-road-test-018-choice-4"
    }
  },
  "When should you cancel a planned lane change on the road test?": {
    "publicId": "ontario-road-test-019",
    "choices": {
      "When the gap or conditions are no longer safe": "ontario-road-test-019-choice-1",
      "Never, because cancelling looks uncertain": "ontario-road-test-019-choice-2",
      "Only after you have crossed the lane line": "ontario-road-test-019-choice-3",
      "Continue because signalling commits you to complete the lane change": "ontario-road-test-019-choice-4"
    }
  },
  "What should your steering feel like during a G2 lane change?": {
    "publicId": "ontario-road-test-020",
    "choices": {
      "Smooth, controlled, and matched to a safe gap": "ontario-road-test-020-choice-1",
      "Fast and abrupt so the lane change ends quickly": "ontario-road-test-020-choice-2",
      "A slow drift without signalling": "ontario-road-test-020-choice-3",
      "A hard brake followed by a sharp turn": "ontario-road-test-020-choice-4"
    }
  },
  "Why must you check road markings before passing on a two-way road?": {
    "publicId": "ontario-road-test-021",
    "choices": {
      "They help show whether passing is legally allowed": "ontario-road-test-021-choice-1",
      "They tell you the vehicle ahead must slow down": "ontario-road-test-021-choice-2",
      "They replace the need to check oncoming traffic": "ontario-road-test-021-choice-3",
      "They let you pass on hills and curves": "ontario-road-test-021-choice-4"
    }
  },
  "Who should you yield to before entering a roundabout?": {
    "publicId": "ontario-road-test-022",
    "choices": {
      "Pedestrians and traffic already in the roundabout": "ontario-road-test-022-choice-1",
      "Only drivers behind your vehicle": "ontario-road-test-022-choice-2",
      "Only vehicles entering after you": "ontario-road-test-022-choice-3",
      "No one, because entering traffic has priority": "ontario-road-test-022-choice-4"
    }
  },
  "What should you do before leaving a roundabout?": {
    "publicId": "ontario-road-test-023",
    "choices": {
      "Signal the exit and check for pedestrians and cyclists": "ontario-road-test-023-choice-1",
      "Stop inside the circle to check your route": "ontario-road-test-023-choice-2",
      "Change lanes at the exit without signalling": "ontario-road-test-023-choice-3",
      "Speed up because exiting traffic has no conflicts": "ontario-road-test-023-choice-4"
    }
  },
  "Before pulling away from a roadside stop, what sequence should be obvious?": {
    "publicId": "ontario-road-test-024",
    "choices": {
      "Signal, mirror check, blind-spot check, safe gap, then move": "ontario-road-test-024-choice-1",
      "Move first, then signal if another vehicle appears": "ontario-road-test-024-choice-2",
      "Use hazard lights instead of checking traffic": "ontario-road-test-024-choice-3",
      "Pull out quickly because parked vehicles have priority": "ontario-road-test-024-choice-4"
    }
  },
  "Where should you avoid making a roadside stop on a road test?": {
    "publicId": "ontario-road-test-025",
    "choices": {
      "Anywhere unsafe, illegal, or blocking traffic": "ontario-road-test-025-choice-1",
      "Only in places with no curb": "ontario-road-test-025-choice-2",
      "Only on roads with parked cars": "ontario-road-test-025-choice-3",
      "Any open curb space, even beside a driveway or fire hydrant": "ontario-road-test-025-choice-4"
    }
  },
  "What should you do if another road user approaches while you are parallel parking?": {
    "publicId": "ontario-road-test-026",
    "choices": {
      "Keep checking, pause if needed, and continue only when safe": "ontario-road-test-026-choice-1",
      "Continue at the same speed so you do not delay the approaching road user": "ontario-road-test-026-choice-2",
      "Focus on the parking space and check surrounding traffic after stopping": "ontario-road-test-026-choice-3",
      "Wave them around without checking your blind spot": "ontario-road-test-026-choice-4"
    }
  },
  "What should accompany the correct wheel position when hill parking?": {
    "publicId": "ontario-road-test-027",
    "choices": {
      "A secure stop with the parking brake and safe checks": "ontario-road-test-027-choice-1",
      "Leaving the vehicle in neutral": "ontario-road-test-027-choice-2",
      "Turning off the signal before stopping": "ontario-road-test-027-choice-3",
      "Relying only on the curb to hold the vehicle": "ontario-road-test-027-choice-4"
    }
  },
  "What kind of driving environment should a G2 candidate practise before test day?": {
    "publicId": "ontario-road-test-028",
    "choices": {
      "Realistic routes with traffic, turns, lane changes, and parking tasks": "ontario-road-test-028-choice-1",
      "One familiar quiet route with the same turns each time": "ontario-road-test-028-choice-2",
      "Only one memorized route at one time of day": "ontario-road-test-028-choice-3",
      "Only highway driving at full speed": "ontario-road-test-028-choice-4"
    }
  },
  "Why should you avoid booking the G2 test before observation habits are automatic?": {
    "publicId": "ontario-road-test-029",
    "choices": {
      "Because safe observation must be consistent without reminders": "ontario-road-test-029-choice-1",
      "Because observation is checked only during parking": "ontario-road-test-029-choice-2",
      "Because strong steering control can compensate for late observation": "ontario-road-test-029-choice-3",
      "Because mirrors are enough whenever surrounding traffic looks light": "ontario-road-test-029-choice-4"
    }
  },
  "What should you do if the examiner gives an instruction late or traffic changes suddenly?": {
    "publicId": "ontario-road-test-030",
    "choices": {
      "Choose the safe legal action instead of forcing the instruction": "ontario-road-test-030-choice-1",
      "Cut across lanes so you do not miss the instruction": "ontario-road-test-030-choice-2",
      "Stop suddenly in traffic to ask for clarification": "ontario-road-test-030-choice-3",
      "Ignore all later instructions": "ontario-road-test-030-choice-4"
    }
  },
  "Why should you check the crosswalk before completing a turn?": {
    "publicId": "ontario-road-test-031",
    "choices": {
      "To avoid turning into pedestrians or cyclists crossing your path": "ontario-road-test-031-choice-1",
      "To decide whether signalling is necessary": "ontario-road-test-031-choice-2",
      "To confirm only the nearest half of the crosswalk is clear": "ontario-road-test-031-choice-3",
      "To avoid checking oncoming traffic": "ontario-road-test-031-choice-4"
    }
  },
  "What does a blind-spot check add that mirrors alone may miss?": {
    "publicId": "ontario-road-test-032",
    "choices": {
      "It confirms no road user is hidden beside the vehicle": "ontario-road-test-032-choice-1",
      "It replaces signalling": "ontario-road-test-032-choice-2",
      "It lets you ignore traffic ahead": "ontario-road-test-032-choice-3",
      "It is needed only when rain or glare reduces the mirror view": "ontario-road-test-032-choice-4"
    }
  },
  "How can you show confidence without rushing during a G2 test?": {
    "publicId": "ontario-road-test-033",
    "choices": {
      "Plan early, observe fully, and move only into safe legal gaps": "ontario-road-test-033-choice-1",
      "Commit immediately once a possible gap appears, without checking again": "ontario-road-test-033-choice-2",
      "Avoid signalling so choices are flexible": "ontario-road-test-033-choice-3",
      "Wait at every intersection even when you have right-of-way": "ontario-road-test-033-choice-4"
    }
  },
  "What should you confirm before opening a door after parking at the roadside?": {
    "publicId": "ontario-road-test-034",
    "choices": {
      "That no vehicle, cyclist, or pedestrian is approaching beside you": "ontario-road-test-034-choice-1",
      "That the parking brake is applied, so observation is no longer needed": "ontario-road-test-034-choice-2",
      "That your front wheels are straight in every parking situation": "ontario-road-test-034-choice-3",
      "That traffic behind you is moving quickly": "ontario-road-test-034-choice-4"
    }
  },
  "What should you do if an oncoming vehicle is close while you wait to turn left?": {
    "publicId": "ontario-road-test-035",
    "choices": {
      "Yield until there is enough time and distance to turn safely": "ontario-road-test-035-choice-1",
      "Begin turning so the oncoming driver slows": "ontario-road-test-035-choice-2",
      "Focus only on the traffic light": "ontario-road-test-035-choice-3",
      "Turn halfway and stop in the oncoming lane": "ontario-road-test-035-choice-4"
    }
  },
  "Why should you keep both hands ready on the wheel during test manoeuvres?": {
    "publicId": "ontario-road-test-036",
    "choices": {
      "It supports smooth control and correct lane position": "ontario-road-test-036-choice-1",
      "It removes the need for speed control": "ontario-road-test-036-choice-2",
      "It proves you can turn without checking mirrors": "ontario-road-test-036-choice-3",
      "It lets you ignore road surface conditions": "ontario-road-test-036-choice-4"
    }
  },
  "What is a good sign that parking practice is test-ready?": {
    "publicId": "ontario-road-test-037",
    "choices": {
      "You can park repeatedly with observation, control, and legal position": "ontario-road-test-037-choice-1",
      "You can park once if no one else is nearby": "ontario-road-test-037-choice-2",
      "You can park only with verbal coaching": "ontario-road-test-037-choice-3",
      "You can stop crooked as long as it is quick": "ontario-road-test-037-choice-4"
    }
  },
  "What should you do if you start a pass but conditions become unsafe?": {
    "publicId": "ontario-road-test-038",
    "choices": {
      "Abort safely and return to a safe following position when possible": "ontario-road-test-038-choice-1",
      "Speed up no matter what because you already started": "ontario-road-test-038-choice-2",
      "Force the other driver to brake": "ontario-road-test-038-choice-3",
      "Drive on the shoulder until there is room": "ontario-road-test-038-choice-4"
    }
  },
  "What is the best way to treat examiner feedback after a failed or weak mock G2 test?": {
    "publicId": "ontario-road-test-039",
    "choices": {
      "Practise the specific weak skills until they are consistent": "ontario-road-test-039-choice-1",
      "Book again immediately without changing practice": "ontario-road-test-039-choice-2",
      "Ignore the comments if you felt confident": "ontario-road-test-039-choice-3",
      "Practise only the easiest route": "ontario-road-test-039-choice-4"
    }
  },
  "What should you do if a pedestrian starts crossing as you prepare to turn?": {
    "publicId": "ontario-road-test-040",
    "choices": {
      "Yield and wait until the pedestrian is safely clear": "ontario-road-test-040-choice-1",
      "Turn quickly before the pedestrian reaches your lane": "ontario-road-test-040-choice-2",
      "Honk so the pedestrian stops": "ontario-road-test-040-choice-3",
      "Continue if the traffic light is green": "ontario-road-test-040-choice-4"
    }
  },
  "What is the G road test looking for when you enter a freeway?": {
    "publicId": "ontario-road-test-041",
    "choices": {
      "Build speed, signal, check mirrors and blind spots, and merge into a safe gap": "ontario-road-test-041-choice-1",
      "Stop at the end of the acceleration lane every time": "ontario-road-test-041-choice-2",
      "Merge slowly so freeway traffic can easily see you": "ontario-road-test-041-choice-3",
      "Enter first, then check for vehicles around you": "ontario-road-test-041-choice-4"
    }
  },
  "What observation rhythm should a full-G candidate maintain in normal traffic?": {
    "publicId": "ontario-road-test-042",
    "choices": {
      "Check mirrors every 5–10 seconds and look about 12–15 seconds ahead": "ontario-road-test-042-choice-1",
      "Check mirrors every 15–20 seconds and look about 5–8 seconds ahead": "ontario-road-test-042-choice-2",
      "Check mirrors every 2–3 seconds and look about 20–30 seconds ahead": "ontario-road-test-042-choice-3",
      "Look 12–15 seconds ahead, but check mirrors mainly before changing speed or lanes": "ontario-road-test-042-choice-4"
    }
  },
  "During a full-G lane change, what should the examiner clearly see?": {
    "publicId": "ontario-road-test-043",
    "choices": {
      "Plan, mirror check, signal, blind-spot check, and move smoothly": "ontario-road-test-043-choice-1",
      "A fast move before signalling so traffic cannot block you": "ontario-road-test-043-choice-2",
      "A lane change based only on the rear-view mirror": "ontario-road-test-043-choice-3",
      "A sudden brake before every lane change": "ontario-road-test-043-choice-4"
    }
  },
  "How should you leave a freeway during the G test?": {
    "publicId": "ontario-road-test-044",
    "choices": {
      "Plan early, signal, enter the exit lane safely, and slow on the ramp": "ontario-road-test-044-choice-1",
      "Brake hard in the through lane as soon as you see the exit": "ontario-road-test-044-choice-2",
      "Cross several lanes at the last second": "ontario-road-test-044-choice-3",
      "Reverse on the shoulder if you miss the exit": "ontario-road-test-044-choice-4"
    }
  },
  "During full-G freeway driving, which lane should slower traffic generally use?": {
    "publicId": "ontario-road-test-045",
    "choices": {
      "The right lane": "ontario-road-test-045-choice-1",
      "The far-left lane at all times": "ontario-road-test-045-choice-2",
      "The shoulder": "ontario-road-test-045-choice-3",
      "Whichever lane has the most traffic": "ontario-road-test-045-choice-4"
    }
  },
  "Which road environments remain part of Ontario's current shortened G test?": {
    "publicId": "ontario-road-test-046",
    "choices": {
      "Major roads and expressways, intersections, lane changes, turns, curves, and business areas": "ontario-road-test-046-choice-1",
      "Only residential streets and parking areas": "ontario-road-test-046-choice-2",
      "Only freeway merging and exiting": "ontario-road-test-046-choice-3",
      "Only the manoeuvres that were tested on the G2 road test": "ontario-road-test-046-choice-4"
    }
  },
  "What makes a pass or lane change unsafe on a higher-speed road?": {
    "publicId": "ontario-road-test-047",
    "choices": {
      "Moving without a legal clear gap and proper observation": "ontario-road-test-047-choice-1",
      "Waiting for a larger space cushion": "ontario-road-test-047-choice-2",
      "Cancelling a lane change when conditions change": "ontario-road-test-047-choice-3",
      "Keeping right when not passing": "ontario-road-test-047-choice-4"
    }
  },
  "What should a G2 driver be comfortable with before booking the full G road test?": {
    "publicId": "ontario-road-test-048",
    "choices": {
      "Consistent city and highway decisions without unsafe prompts": "ontario-road-test-048-choice-1",
      "Only quiet residential routes": "ontario-road-test-048-choice-2",
      "Freeway merging for the first time during the test": "ontario-road-test-048-choice-3",
      "Handling highway traffic only on one familiar route": "ontario-road-test-048-choice-4"
    }
  },
  "Why is planning ahead for a freeway exit important?": {
    "publicId": "ontario-road-test-049",
    "choices": {
      "It prevents sudden lane changes or braking near the exit": "ontario-road-test-049-choice-1",
      "It lets you ignore ramp advisory speeds": "ontario-road-test-049-choice-2",
      "It means you can cross multiple lanes at the gore": "ontario-road-test-049-choice-3",
      "It removes the need to signal": "ontario-road-test-049-choice-4"
    }
  },
  "Which manoeuvres does Ontario currently exclude from the G road test until further notice?": {
    "publicId": "ontario-road-test-050",
    "choices": {
      "Parallel parking, roadside stops, three-point turns, and residential-neighbourhood driving": "ontario-road-test-050-choice-1",
      "Parallel parking, roadside stops, three-point turns, and business-area driving": "ontario-road-test-050-choice-2",
      "Parallel parking, residential-neighbourhood driving, freeway exiting, and three-point turns": "ontario-road-test-050-choice-3",
      "Roadside stops, three-point turns, residential-neighbourhood driving, and lane changes": "ontario-road-test-050-choice-4"
    }
  },
  "If freeway traffic is heavy, what should you do while merging?": {
    "publicId": "ontario-road-test-051",
    "choices": {
      "Signal, adjust speed smoothly, and merge into a safe gap": "ontario-road-test-051-choice-1",
      "Match the nearest vehicle's speed and enter ahead of it before the lane ends": "ontario-road-test-051-choice-2",
      "Slow early in the acceleration lane so an opening develops behind the nearest vehicle": "ontario-road-test-051-choice-3",
      "Maintain one steady ramp speed and let freeway drivers adjust around your path": "ontario-road-test-051-choice-4"
    }
  },
  "What is the safest response if you miss an instruction or exit during the full G test?": {
    "publicId": "ontario-road-test-052",
    "choices": {
      "Continue safely and wait for the next legal instruction": "ontario-road-test-052-choice-1",
      "Cut across lanes immediately to recover": "ontario-road-test-052-choice-2",
      "Stop on the freeway shoulder to ask what to do": "ontario-road-test-052-choice-3",
      "Reverse if you have just passed the exit": "ontario-road-test-052-choice-4"
    }
  },
  "What should you do before reaching the end of a freeway acceleration lane?": {
    "publicId": "ontario-road-test-053",
    "choices": {
      "Build speed, observe fully, signal, and choose a safe gap early": "ontario-road-test-053-choice-1",
      "Choose a gap first, then adjust speed and check the blind spot immediately before entering": "ontario-road-test-053-choice-2",
      "Reach freeway speed before deciding which available gap is safest": "ontario-road-test-053-choice-3",
      "Signal near the end of the lane so drivers know exactly where you intend to enter": "ontario-road-test-053-choice-4"
    }
  },
  "Why is matching freeway traffic speed important when merging?": {
    "publicId": "ontario-road-test-054",
    "choices": {
      "It helps you merge smoothly without forcing traffic to react sharply": "ontario-road-test-054-choice-1",
      "It gives merging vehicles automatic priority over freeway traffic": "ontario-road-test-054-choice-2",
      "It means blind-spot checks are no longer needed": "ontario-road-test-054-choice-3",
      "It lets you ignore the posted speed limit": "ontario-road-test-054-choice-4"
    }
  },
  "What should you do if there is no safe freeway gap right away?": {
    "publicId": "ontario-road-test-055",
    "choices": {
      "Adjust speed smoothly and wait for a safe gap": "ontario-road-test-055-choice-1",
      "Force another driver to brake because the ramp is ending": "ontario-road-test-055-choice-2",
      "Stop in the live freeway lane": "ontario-road-test-055-choice-3",
      "Drive onto the shoulder as your normal merge plan": "ontario-road-test-055-choice-4"
    }
  },
  "When should you move toward the correct lane for a freeway exit?": {
    "publicId": "ontario-road-test-056",
    "choices": {
      "Early enough to make each lane change safely and predictably": "ontario-road-test-056-choice-1",
      "Only after passing the exit sign at the ramp": "ontario-road-test-056-choice-2",
      "At the last second so the route is shorter": "ontario-road-test-056-choice-3",
      "After slowing sharply in the through lane": "ontario-road-test-056-choice-4"
    }
  },
  "Where should most of your speed reduction happen when exiting a freeway?": {
    "publicId": "ontario-road-test-057",
    "choices": {
      "In the deceleration lane or ramp after moving out of through traffic": "ontario-road-test-057-choice-1",
      "In the centre freeway lane before signalling": "ontario-road-test-057-choice-2",
      "Only after stopping at the end of the ramp": "ontario-road-test-057-choice-3",
      "On the shoulder before the exit lane begins": "ontario-road-test-057-choice-4"
    }
  },
  "What should you do if you realize you are about to miss your freeway exit?": {
    "publicId": "ontario-road-test-058",
    "choices": {
      "Continue safely and take the next legal route": "ontario-road-test-058-choice-1",
      "Cross the gore area if the ramp is still visible": "ontario-road-test-058-choice-2",
      "Brake hard and cut across lanes": "ontario-road-test-058-choice-3",
      "Reverse carefully on the shoulder": "ontario-road-test-058-choice-4"
    }
  },
  "Why should freeway merge checks continue after you enter the lane?": {
    "publicId": "ontario-road-test-059",
    "choices": {
      "To stabilize speed and spacing after joining fast traffic": "ontario-road-test-059-choice-1",
      "To verify traffic behind accepted the merge while keeping speed and spacing unchanged": "ontario-road-test-059-choice-2",
      "To decide whether to move immediately into a faster lane before cancelling the signal": "ontario-road-test-059-choice-3",
      "To confirm the vehicle behind is visible without reassessing traffic ahead": "ontario-road-test-059-choice-4"
    }
  },
  "What is a safe response to a short freeway entrance ramp on the G test?": {
    "publicId": "ontario-road-test-060",
    "choices": {
      "Scan early, signal, build suitable speed, and merge only when safe": "ontario-road-test-060-choice-1",
      "Enter at very low speed because the ramp is short": "ontario-road-test-060-choice-2",
      "Use abrupt steering so you do not run out of lane": "ontario-road-test-060-choice-3",
      "Ignore the blind spot because there is less time": "ontario-road-test-060-choice-4"
    }
  },
  "How should you handle ramp advisory speeds during the full G test?": {
    "publicId": "ontario-road-test-061",
    "choices": {
      "Use the advisory and conditions to choose a controlled ramp speed": "ontario-road-test-061-choice-1",
      "Keep freeway speed through every ramp": "ontario-road-test-061-choice-2",
      "Brake only after the ramp curve ends": "ontario-road-test-061-choice-3",
      "Treat advisory signs as instructions to accelerate": "ontario-road-test-061-choice-4"
    }
  },
  "What should you do when another vehicle is entering from a ramp near you?": {
    "publicId": "ontario-road-test-062",
    "choices": {
      "Keep space and adjust safely without creating a new hazard": "ontario-road-test-062-choice-1",
      "Always brake hard to let the ramp vehicle enter": "ontario-road-test-062-choice-2",
      "Always change lanes without checking": "ontario-road-test-062-choice-3",
      "Speed up to block the merge": "ontario-road-test-062-choice-4"
    }
  },
  "When is the left freeway lane usually the right choice?": {
    "publicId": "ontario-road-test-063",
    "choices": {
      "When passing or when signs and traffic conditions make it appropriate": "ontario-road-test-063-choice-1",
      "Whenever you travel at the posted speed and vehicles to the right are slower": "ontario-road-test-063-choice-2",
      "When it provides the largest following gap, even when you are not passing": "ontario-road-test-063-choice-3",
      "When several exits approach and you want to avoid entering traffic": "ontario-road-test-063-choice-4"
    }
  },
  "What should guide your following distance on a freeway?": {
    "publicId": "ontario-road-test-064",
    "choices": {
      "Speed, traffic, weather, visibility, and your reaction time": "ontario-road-test-064-choice-1",
      "The gap used by surrounding drivers, even when weather or visibility is worse": "ontario-road-test-064-choice-2",
      "The minimum gap needed to prevent another car entering": "ontario-road-test-064-choice-3",
      "Traffic density, with a shorter gap in congestion to keep traffic moving": "ontario-road-test-064-choice-4"
    }
  },
  "Why should you avoid driving beside another vehicle for too long?": {
    "publicId": "ontario-road-test-065",
    "choices": {
      "It reduces blind-spot risk and preserves escape space": "ontario-road-test-065-choice-1",
      "It lets you avoid checking mirrors": "ontario-road-test-065-choice-2",
      "It is required only in parking lots": "ontario-road-test-065-choice-3",
      "It means you should always speed far ahead": "ontario-road-test-065-choice-4"
    }
  },
  "What should happen before every full-G lane change in heavier traffic?": {
    "publicId": "ontario-road-test-066",
    "choices": {
      "Plan, mirror check, signal, shoulder-check, confirm the gap, then move": "ontario-road-test-066-choice-1",
      "Signal only after half the vehicle is in the next lane": "ontario-road-test-066-choice-2",
      "Move when the front bumper fits, even if the gap is closing": "ontario-road-test-066-choice-3",
      "Use speed alone instead of observation": "ontario-road-test-066-choice-4"
    }
  },
  "What should you do if a vehicle enters your blind spot during a planned lane change?": {
    "publicId": "ontario-road-test-067",
    "choices": {
      "Cancel or delay the lane change and stay in your lane": "ontario-road-test-067-choice-1",
      "Move faster so you get ahead of the vehicle": "ontario-road-test-067-choice-2",
      "Keep moving because your signal gives priority": "ontario-road-test-067-choice-3",
      "Brake hard in your lane without checking behind": "ontario-road-test-067-choice-4"
    }
  },
  "What should you confirm before passing a slower vehicle on a rural road?": {
    "publicId": "ontario-road-test-068",
    "choices": {
      "Legal markings, clear view, safe oncoming gap, and return space": "ontario-road-test-068-choice-1",
      "Only that your vehicle can accelerate quickly": "ontario-road-test-068-choice-2",
      "Only that the driver ahead is below the speed limit": "ontario-road-test-068-choice-3",
      "That the shoulder is wide enough if something changes": "ontario-road-test-068-choice-4"
    }
  },
  "Why should you return from a pass only after seeing the passed vehicle clearly?": {
    "publicId": "ontario-road-test-069",
    "choices": {
      "To leave enough space and avoid cutting off the passed vehicle": "ontario-road-test-069-choice-1",
      "To avoid using your turn signal": "ontario-road-test-069-choice-2",
      "To stay in the oncoming lane longer than needed": "ontario-road-test-069-choice-3",
      "To judge the return by whether your front bumper has cleared the vehicle": "ontario-road-test-069-choice-4"
    }
  },
  "What does smooth speed control show during full-G traffic flow?": {
    "publicId": "ontario-road-test-070",
    "choices": {
      "You can match traffic and preserve space without abrupt moves": "ontario-road-test-070-choice-1",
      "You can ignore vehicles behind you": "ontario-road-test-070-choice-2",
      "You are allowed to exceed the speed limit to keep up": "ontario-road-test-070-choice-3",
      "You do not need lane-position checks": "ontario-road-test-070-choice-4"
    }
  },
  "What should change when moving from freeway traffic into a business area?": {
    "publicId": "ontario-road-test-071",
    "choices": {
      "Reduce speed and increase scanning for local hazards": "ontario-road-test-071-choice-1",
      "Keep freeway following distance but ignore pedestrians": "ontario-road-test-071-choice-2",
      "Keep freeway-style speed and spacing until reaching the first intersection": "ontario-road-test-071-choice-3",
      "Focus only on lane markings": "ontario-road-test-071-choice-4"
    }
  },
  "Although residential driving is currently excluded from the G test, why is it still useful practice?": {
    "publicId": "ontario-road-test-072",
    "choices": {
      "It develops lower-speed hazard scanning and speed control": "ontario-road-test-072-choice-1",
      "It replaces the required freeway practice": "ontario-road-test-072-choice-2",
      "It is still a primary section of the current shortened G test": "ontario-road-test-072-choice-3",
      "It matters only for practising parking manoeuvres": "ontario-road-test-072-choice-4"
    }
  },
  "What practice mix best prepares a learner for the full G road test?": {
    "publicId": "ontario-road-test-073",
    "choices": {
      "A mix of highway, city, lane-change, spacing, and recovery practice": "ontario-road-test-073-choice-1",
      "Only the exact road-test centre route": "ontario-road-test-073-choice-2",
      "Only empty residential streets": "ontario-road-test-073-choice-3",
      "Only parking manoeuvres already learned for G2": "ontario-road-test-073-choice-4"
    }
  },
  "How should you decide whether you are ready to book the full G test?": {
    "publicId": "ontario-road-test-074",
    "choices": {
      "Book when highway and city decisions are consistent without coaching": "ontario-road-test-074-choice-1",
      "Book as soon as the minimum waiting period ends": "ontario-road-test-074-choice-2",
      "Book before practising freeway driving so the test is realistic": "ontario-road-test-074-choice-3",
      "Book when parking alone feels easy": "ontario-road-test-074-choice-4"
    }
  },
  "What should a mock full-G highway drive include?": {
    "publicId": "ontario-road-test-075",
    "choices": {
      "Merge, spacing, lane changes, exit planning, ramp speed, and city recovery": "ontario-road-test-075-choice-1",
      "Only driving straight in the right lane": "ontario-road-test-075-choice-2",
      "Only entering the freeway and stopping afterward": "ontario-road-test-075-choice-3",
      "Only reading the route before driving": "ontario-road-test-075-choice-4"
    }
  },
  "What should you do with feedback from a weak full-G mock test?": {
    "publicId": "ontario-road-test-076",
    "choices": {
      "Practise the exact weak skills until they are repeatable": "ontario-road-test-076-choice-1",
      "Ignore it if the freeway portion felt exciting": "ontario-road-test-076-choice-2",
      "Book immediately while the route is still familiar": "ontario-road-test-076-choice-3",
      "Practise only quiet streets afterward": "ontario-road-test-076-choice-4"
    }
  },
  "Why is calm route recovery important on the full G test?": {
    "publicId": "ontario-road-test-077",
    "choices": {
      "It shows you can adapt legally without sudden unsafe moves": "ontario-road-test-077-choice-1",
      "It proves you know every possible road-test route": "ontario-road-test-077-choice-2",
      "It helps you recover a missed instruction with a late lane change": "ontario-road-test-077-choice-3",
      "It means stopping anywhere is acceptable": "ontario-road-test-077-choice-4"
    }
  },
  "What makes business-area driving different from the freeway part of the full G test?": {
    "publicId": "ontario-road-test-078",
    "choices": {
      "More local hazards, lower speeds, and frequent scanning demands": "ontario-road-test-078-choice-1",
      "No need to check mirrors because speeds are lower": "ontario-road-test-078-choice-2",
      "Only ramp-speed control matters": "ontario-road-test-078-choice-3",
      "Lane position no longer matters": "ontario-road-test-078-choice-4"
    }
  },
  "What highway experience must you declare before taking the full G road test?": {
    "publicId": "ontario-road-test-079",
    "choices": {
      "How often and how far you drove on 80 km/h-or-higher roads during the previous three months": "ontario-road-test-079-choice-1",
      "How often you drove on 100 km/h freeways during the previous six months": "ontario-road-test-079-choice-2",
      "How many highway kilometres you drove in three months, without trip-frequency details": "ontario-road-test-079-choice-3",
      "How often and how far you drove on 80 km/h-or-higher roads during the previous twelve months": "ontario-road-test-079-choice-4"
    }
  },
  "What is a good readiness sign for freeway following distance?": {
    "publicId": "ontario-road-test-080",
    "choices": {
      "You maintain space consistently as traffic speed changes": "ontario-road-test-080-choice-1",
      "You can stay close enough to prevent lane changes": "ontario-road-test-080-choice-2",
      "You brake late but always stop in time": "ontario-road-test-080-choice-3",
      "You use a fixed number of car lengths at every freeway speed": "ontario-road-test-080-choice-4"
    }
  }
} as const;
