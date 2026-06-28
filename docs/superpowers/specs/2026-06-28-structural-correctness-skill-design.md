# Structural Correctness Skill Design

## Goal

Create a reusable personal agent skill named `structural-correctness` from *The Shape of the System* manifesto and lifecycle guides.

The skill should help agents turn broad engineering work into structural safeguards: correctness should live in types, schemas, boundaries, ownership, atomic operations, deadlines, tests, observability, rollout shape, and process where code cannot carry it.

## Scope decision

Use one skill, not many phase-specific skills.

Rationale:

- The manifesto's central move is one decision rule across many contexts: minimise maintainer cognitive load while bounding blast radius for caller- or attacker-controlled inputs.
- A single phase-router skill prevents fragmentation and avoids forcing future agents to choose among ten near-duplicate lifecycle skills before they have understood the task.
- Existing repository skills already cover narrower slices: `fault-tolerant-design` for reliability-sensitive review and `typescript-coding-standards` for TypeScript implementation. This skill should sit above them as a lifecycle/checklist lens, not duplicate every platform detail.

## Audience

Agents planning, implementing, reviewing, verifying, operating, investigating, retroing, or retiring software changes where correctness, blast radius, lifecycle safety, boundaries, tests, observability, or deletion safety matter.

## Trigger conditions

The skill should activate when the user asks for or implies:

- architecture/design/planning review
- implementation of non-trivial behavior
- code review or PR review
- verification/test plan for a fix or feature
- debugging or investigation framing
- rollout, migration, or operational safety
- deprecation, removal, retirement, or cleanup
- reliability/security/data-integrity concerns
- boundary parsing, trust boundaries, authorization, idempotency, race safety, deadlines, resource bounds, observability, or ownership

It should not activate for tiny copy edits, isolated formatting, pure prose unrelated to engineering systems, or low-risk local changes where a normal domain skill is more specific.

## Core principle

> Push correctness out of human vigilance and into the structure of the system.

The skill should force agents to choose safeguards by two variables:

1. Who controls the input or growth: self-controlled vs caller-/attacker-/environment-controlled.
2. How wide the blast radius is if wrong.

Wide radius plus external control means pay the complexity cost now. Contained plus self-controlled means defer if simpler, but record why.

## Default output shape

Use a phase-appropriate compressed checklist. Default to:

```md
## Structural objective
- Cognitive load reduced by:
- Blast radius bounded by:

## Boundaries and invariants
- Parsed/checked at boundary:
- Illegal state made unrepresentable by:
- Trust/auth/size limits:

## Time, resources, and mutation safety
- Deadlines / cancellation:
- Resource bounds / teardown:
- Race safety / idempotency:

## Failure, observability, and degraded behavior
- Visible failure path:
- Signals emitted/read:
- Degraded tier or abort decision:

## Change lifecycle
- Tests / reproducibility:
- Rollout / reversibility:
- Owner / expiry / runbook:

## Decision
- Must fix now:
- Can defer with reason:
- Simplify/delete instead:
```

For lifecycle-specific work, the skill should switch lens:

- Triage: evidence, reproducibility, blast radius, owner, explicit disposition.
- Planning: bounded unknowns, acceptance criteria, reversible sequence, named failures.
- Implementing: parse at boundaries, local reasoning, seams, bounds, idempotency, visible failures, tests.
- Integrating: whole-system dependencies, contracts, bidirectional load bounds, control loops, end-to-end probe, edge ownership.
- Reviewing: locality, boundaries, swallowed failures, unbounded caller-controlled growth, races/replay, teardown, blast radius, tests.
- Verifying: red-then-green reproduction, acceptance criteria, worst boundary input, failure paths, replay/teardown, production-like signals, reproducibility.
- Operating: reversible ramp, evidence-gated promotion, degradation, retry/backoff/jitter, clean shutdown, owners/runbooks.
- Retrospective: reproduced cause, system gap not blame, missing signal, permanent test/alert, owner/date, feed back to triage.
- Retirement: live usage proof, deprecation window, reverse contraction, reviewable deletion plan, no orphaned derivations, duty to forget, full subtraction, resurrection guard.

## Guardrails

- Do not cargo-cult every tenet into every change.
- Do not add distributed-systems ceremony to low-risk local code.
- Do not re-validate at every internal hop after a boundary has produced a trusted parsed type.
- Do not call telemetry useful unless a decision consumes it.
- Do not call a green check verification unless it exercised the behavior that could fail.
- Do not keep reversibility scaffolding without owner and expiry.
- Prefer deleting states, branches, flags, and knobs over adding guards around them.
- Treat tests and process as structural only when they re-run or assign ownership without relying on memory.

## Eval coverage

Deterministic eval fixtures should cover:

1. Planning a bulk import endpoint.
   - Requires parsed/bounded boundary input, async/backpressure or deadline choice, idempotent job/retry safety, visible failure/metrics, owner/expiry for operational artifacts.
   - Forbids trusting client validation, unbounded queues, or vague "add tests".

2. Verifying a double-charge fix.
   - Requires reproduction failing before the fix and passing after, same idempotency key replayed twice, concurrent/interleaved attempt if applicable, observable persisted result once, and permanent regression.
   - Forbids trusting a green test that was never red or code review alone.

3. Retiring an old API endpoint.
   - Requires live usage telemetry over a usage-cycle window, deprecation/sunset window, reverse contraction, reviewable deletion plan, docs/config cleanup, and resurrection guard.
   - Forbids relying only on grep, a hard cut, or indefinite deprecation.

## Repository updates

Add:

```txt
skills/structural-correctness/
  SKILL.md
  evals/
    cases.json
    run-evals.mjs
    run-evals.test.mjs
    fixtures/
```

Update:

- `README.md` skill table and structure list.
- `package.json` eval script.

## Success criteria

- `structural-correctness` frontmatter is valid and trigger-focused.
- Skill body is concise, agent-ready, and not a copy of the manifesto.
- Skill preserves the manifesto's objective, phase routing, tiebreaker, and guardrails.
- Evals cover planning, verification, and retirement pressure scenarios.
- `npm test` passes.
- `npm run eval` passes for all skills.
