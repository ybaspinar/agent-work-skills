# Agent Work Skills

Personal agent skills for turning messy work and decisions into clear, reusable workflows.

## Skills

| Skill | Use when |
|---|---|
| [`deliberate-response-loop`](skills/deliberate-response-loop/SKILL.md) | Emotional pressure, avoidance, anxiety, frustration, ambition, contempt, or conflict needs a deliberate next move. |
| [`conventional-impact`](skills/conventional-impact/SKILL.md) | Completed engineering tickets need impact annotations, MR descriptions, sprint review notes, manager updates, release notes, or performance-review bullets. |
| [`fault-tolerant-design`](skills/fault-tolerant-design/SKILL.md) | Reliability-sensitive software, critical paths, dependencies, rollouts, jobs, queues, database changes, or failure modes need fault-tolerance review. |
| [`structural-correctness`](skills/structural-correctness/SKILL.md) | Software work needs correctness pushed into boundaries, invariants, tests, observability, ownership, rollout shape, or safe deletion. |
| [`structural-triage`](skills/structural-triage/SKILL.md) | Tickets, bug reports, incidents, asserted priorities, or incomplete reports need evidence-based triage. |
| [`structural-planning`](skills/structural-planning/SKILL.md) | Fuzzy requirements, migrations, estimates, spikes, or cross-team dependencies need an executable plan. |
| [`structural-implementing`](skills/structural-implementing/SKILL.md) | Non-trivial code paths, handlers, jobs, workflows, parsers, retries, or behavior changes need structural implementation checks. |
| [`structural-integrating`](skills/structural-integrating/SKILL.md) | Features, services, dependencies, APIs, models, adapters, or pipelines are being wired into a larger system. |
| [`structural-reviewing`](skills/structural-reviewing/SKILL.md) | Code, PRs, migrations, endpoint changes, jobs, queues, tests, or operational changes need structural review. |
| [`objective-code-review`](skills/objective-code-review/SKILL.md) | Commits, PRs, or MRs need objective review for requirements, scope, project fit, non-functional obligations, and regression protection. |
| [`structural-verifying`](skills/structural-verifying/SKILL.md) | Fixes, features, migrations, release candidates, or behavior changes need running-system proof. |
| [`structural-operating`](skills/structural-operating/SKILL.md) | Releases, rollouts, ramps, migrations, monitoring, rollback, on-call readiness, or runbooks need operating checks. |
| [`structural-investigating`](skills/structural-investigating/SKILL.md) | Defects, spikes, unknowns, flaky behavior, incidents, or hypotheses need bounded investigation. |
| [`structural-retrospective`](skills/structural-retrospective/SKILL.md) | Retrospectives, postmortems, near-miss reviews, or incident follow-ups need structural learning. |
| [`structural-retirement`](skills/structural-retirement/SKILL.md) | APIs, features, flags, services, tables, datasets, jobs, configs, docs, or code paths are being retired. |
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
  structural-triage/
    SKILL.md
  structural-planning/
    SKILL.md
  structural-implementing/
    SKILL.md
  structural-integrating/
    SKILL.md
  structural-reviewing/
    SKILL.md
  objective-code-review/
    SKILL.md
  structural-verifying/
    SKILL.md
  structural-operating/
    SKILL.md
  structural-investigating/
    SKILL.md
  structural-retrospective/
    SKILL.md
  structural-retirement/
    SKILL.md
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
