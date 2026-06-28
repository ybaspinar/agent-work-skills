# Agent Work Skills

Personal agent skills for turning messy work and decisions into clear, reusable workflows.

## Skills

| Skill | Use when |
|---|---|
| [`deliberate-response-loop`](skills/deliberate-response-loop/SKILL.md) | Emotional pressure, avoidance, anxiety, frustration, ambition, contempt, or conflict needs a deliberate next move. |
| [`conventional-impact`](skills/conventional-impact/SKILL.md) | Completed engineering tickets need impact annotations, MR descriptions, sprint review notes, manager updates, release notes, or performance-review bullets. |
| [`fault-tolerant-design`](skills/fault-tolerant-design/SKILL.md) | Reliability-sensitive software, critical paths, dependencies, rollouts, jobs, queues, database changes, or failure modes need fault-tolerance review. |
| [`structural-correctness`](skills/structural-correctness/SKILL.md) | Software work needs correctness pushed into boundaries, invariants, tests, observability, ownership, rollout shape, or safe deletion. |
| [`typescript-coding-standards`](skills/typescript-coding-standards/SKILL.md) | TypeScript code needs correctness, typed errors, parsing boundaries, domain types, adapter boundaries, tests, config, telemetry, or agent coding conventions. |

## Structure

```txt
skills/
  deliberate-response-loop/
    SKILL.md
    evals/
  conventional-impact/
    SKILL.md
    evals/
  fault-tolerant-design/
    SKILL.md
    evals/
  structural-correctness/
    SKILL.md
    evals/
  typescript-coding-standards/
    SKILL.md
    evals/
docs/
  superpowers/specs/
  superpowers/plans/
```

Each skill is canonical under `skills/<skill-name>/SKILL.md`. Keep evals beside the skill they verify.

## Verify

```bash
npm test
npm run eval
```

The evals are deterministic fixture checks. They do not call live models.
