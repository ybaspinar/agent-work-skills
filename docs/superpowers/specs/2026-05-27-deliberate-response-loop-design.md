# Deliberate Response Loop Skill Design

## Goal

Create a private Letta Code skill named `deliberate-response-loop` that helps an agent convert emotionally charged moments, avoidance, anxiety, frustration, ambition, and conflict into clear perception, deliberate choice, precise language, and concrete action.

The skill is private but should not depend on anecdotes or identifying examples. It should preserve the operating philosophy while staying practical rather than theatrical.

## Audience

The primary audience is agents helping with emotionally charged or avoidant situations. The skill should be safe to keep private, but its content should still be general enough to avoid unnecessary identifying details.

## Skill name

`deliberate-response-loop`

Rationale: the name describes the behavior cleanly. It emphasizes chosen response over reflex, without tying the skill to a fictional reference or a narrow emotional-regulation label.

## Trigger conditions

The skill should activate when the user brings emotional pressure, avoidance, conflict, frustration, anxiety, ambition, contempt, or a desire to frame a messy situation clearly.

Example trigger phrases:

- "I'm annoyed by..."
- "I'm avoiding..."
- "I don't want to react emotionally"
- "help me frame this"
- "what's the precise move here"
- "turn this into a system observation"
- "I'm anxious about..."
- "I need to handle this strategically"
- "I'm stuck because I don't want to deal with this"
- "what's the smallest next move"

## Core mantra

The skill should preserve this four-part operating line:

> See clearly. Choose deliberately. Speak precisely. Move decisively.

The old framing "react slowly" should not be used as the core principle. The goal is not slowness or passivity. The goal is fast perception, deliberate choice, and action that is chosen rather than reflexive.

Useful internal line:

> Speed is fine. Reflex is not.

## Core behavior

When the skill is used, the agent should not provide generic reassurance, motivational slogans, or vague emotional validation. It should transform the user's raw input into a structured operating frame.

Default output shape:

```md
See clearly:
- Visible situation:
- Hidden system / avoidance loop:
- Unhelpful story:
- Cleaner reality:

Choose deliberately:
- Desired outcome:
- What must not drive the next move:
- Chosen posture:

Speak precisely:
"One clean sentence."

Move decisively:
- Smallest next move:
- Evidence/control/leverage created:
- Safety margin or guardrail:
```

The agent may compress the format when the user needs a short answer, but the result should still end in a concrete next move or a precise reason to stop.

## Loop semantics

### See clearly

Identify the visible situation and the hidden mechanism underneath it. Separate reality from identity-level doom, contempt, panic, or avoidance logic.

Useful conversions:

- "I am incapable" → "I am under-practiced."
- "This is stupid" → "The current setup makes this outcome likely."
- "I can't handle this" → "This level is too large; I need a smaller controlled exposure."

### Choose deliberately

Choose the outcome before choosing the response. Name what should not control the next move: fear, contempt, ego, urgency, shame, or avoidance.

The agent should help the user decide what kind of capability is being trained, not just what discomfort is being escaped.

### Speak precisely

Convert the emotional material into one clean sentence. The sentence should frame reality without blame, self-doom, fake certainty, or over-explanation.

The output should be calm enough to use in a notebook, meeting, message, or self-instruction.

### Move decisively

Pick the smallest concrete move that creates evidence, control, or leverage. Prefer controlled practice over heroic leaps.

The agent should avoid ending on abstract insight. Insight must become a next action unless stopping is the correct action.

## Guardrails

- Do not turn the framework into ego fantasy.
- Do not encourage manipulation, contempt, coldness, or superiority.
- Do not confuse calmness with passivity.
- Do not push heroic exposure when a smaller controlled step is safer and more effective.
- Do not use strategy language to avoid responsibility or action.
- Do not over-explain when one clean sentence is enough.
- Do not pretend confidence must exist before practice.

Central guardrail:

> See through people and systems without looking down on them.

## Recurring patterns

### System observation pattern

Use when annoyance should become leverage instead of venting.

```md
Observation:
Pattern:
Incentive:
Leverage point:
Possible sentence:
```

### Controlled exposure pattern

Use when the issue is avoidance of a high-stakes or cognitively heavy situation.

Key line:

> I am not learning to be fearless. I am learning to act with enough margin.

Process:

1. Shrink the situation until readiness is not required.
2. Take one low-risk action.
3. Keep margin.
4. Correct calmly.
5. Repeat until the level becomes boring enough.

### Evidence over reassurance pattern

Use when anxiety wants certainty before action.

Key line:

> Confidence is not the entry ticket. Evidence creates confidence.

The agent should help choose an action that creates evidence rather than offering reassurance that cannot be proven.

## Examples to include in SKILL.md

### Work frustration

User: "Bug reports keep arriving incomplete."

Expected framing:

- See clearly: The visible frustration is ticket quality; the hidden system is that bug intake may reward filing rather than actionability.
- Choose deliberately: The goal is fewer engineering interruptions and clearer reproduction paths, not venting about QA.
- Speak precisely: "The bug intake format is missing reproducibility, expected behavior, and impact, so engineering spends time reverse-engineering reports."
- Move decisively: Propose a minimum bug template and triage gate with examples of good and bad reports.

### Task avoidance

User: "I keep avoiding this task because it feels too big."

Expected framing:

- See clearly: The visible issue is procrastination; the hidden loop is that the task is too large to start safely, so avoidance reduces pressure short-term.
- Choose deliberately: The goal is not to finish everything at once; the goal is to create the first piece of evidence that the task can be engaged.
- Speak precisely: "This is not a motivation problem yet; the task needs to be shrunk until the first action is safe enough to start."
- Move decisively: Define a 10-minute first action with a clear stop point.

### Ambition and compounding

User: "I want to become more strategically capable."

Expected framing:

- See clearly: Strategic capability compounds through repeated perception, framing, and action, not through a personality pose.
- Choose deliberately: Pick one compounding skill for 60-90 days instead of rotating constantly.
- Speak precisely: "I am training strategic communication by turning surface complaints into system observations and precise next moves."
- Move decisively: Choose one daily rep: write visible situation, hidden system, and precise move.

## Initial file structure

Version one should stay lean:

```txt
deliberate-response-loop/
└── SKILL.md
```

No scripts, assets, or references are needed for the first version. If the skill grows, examples can move to `references/examples.md` and recurring patterns can move to `references/patterns.md`.

## Success criteria

- The skill frontmatter is valid.
- The description clearly says this is for emotional pressure, avoidance, anxiety, frustration, ambition, and deliberate response.
- The skill keeps the four-part loop intact.
- The skill remains practical and non-theatrical.
- The examples produce usable language and concrete next moves.
- The repo is created as private on GitHub.
- The skill package validates successfully with the Letta Code packaging script.
