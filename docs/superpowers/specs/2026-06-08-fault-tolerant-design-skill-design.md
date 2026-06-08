# Fault Tolerant Design Skill Design

## Goal

Create a reusable personal agent skill named `fault-tolerant-design` that extracts the generic software-development lessons from PlanetScale's extreme fault-tolerance principles and applies them to ordinary engineering work.

The skill should help agents review or design reliability-sensitive software by asking: what is the critical path, what can fail independently, what can continue with last-known-good state, what recovery paths exist, and how changes roll out without broad blast radius.

The skill must not be PlanetScale-specific. The blog post is inspiration only; the skill should use generic language that applies to production systems, background jobs, queues, database changes, data pipelines, rollout plans, and critical feature paths.

## Audience

The primary audience is agents helping an engineer design, review, or harden software that must tolerate dependency failures, deploy mistakes, infrastructure failures, or partial outages.

The skill should also be useful for everyday feature work when the feature has a critical path or external dependency, but it should avoid pushing distributed-systems complexity onto low-risk code.

## Skill name

`fault-tolerant-design`

Rationale: the name describes the action clearly and keeps the skill generic. It avoids vendor-specific framing while preserving the core theme from the source material.

## Trigger conditions

The skill should activate when the user asks for or implies:

- architecture review
- reliability review
- fault tolerance
- failure modes
- resilience
- critical path analysis
- dependency isolation
- rollout or migration safety
- background job, queue, or worker design
- database schema, data-plane, or control-plane changes
- cache/config behavior during dependency failure
- disaster recovery or failover design
- incident-prone feature paths
- external API dependency hardening

It should not activate for generic style refactors, UI polish, non-critical single-user scripts, or speculative infrastructure work with no stated reliability risk.

## Core principle

> Keep the critical path isolated, redundant where justified, stable under dependency failure, and changed progressively.

The skill should turn reliability concerns into concrete review questions and design changes. It should prefer simple failure boundaries over elaborate recovery machinery.

## Generic principles

### Isolation

- Split systems into parts that can fail independently.
- Keep the critical path's dependency list short.
- Prevent control, admin, analytics, billing, registry, or deployment-service failures from breaking already-running user-facing work.
- Identify shared-fate risks where two “copies” still rely on the same database, queue, config source, availability zone, credentials, or deploy step.

### Redundancy

- Copy or retry the parts whose failure would break important work.
- Keep redundant copies isolated from each other.
- Add capacity headroom only when the system is expected to absorb failed work.
- Avoid redundancy that depends on the same bottleneck or creates double-write correctness problems.

### Static stability

- During dependency failure, continue with the last known good state when safe.
- Decide explicitly what can degrade, pause, buffer, or reject work.
- Prefer safe stale config/cache behavior over live dependency reads in the request path.
- Use backpressure rather than unbounded buffering.

### Recovery practice

- Treat untested failover and recovery procedures as imaginary.
- Exercise recovery paths regularly enough that they remain boring.
- Design queues, buffers, retries, and idempotency around the recovery path, not as afterthoughts.

### Progressive delivery

- Roll out risky changes gradually across least-critical to most-critical environments.
- Use feature flags, release channels, canaries, and database-by-database or tenant-by-tenant rollout when appropriate.
- Make rollback fast, observable, and state-compatible before relying on progressive delivery.

## Required output shape

Default to this structure when reviewing or designing a reliability-sensitive system:

```md
## Critical path
- What must keep working:
- What can degrade or pause:

## Isolation
- Dependencies in the critical path:
- Failure boundaries:
- Cascade risks:
- Shared-fate risks:

## Redundancy
- Copies / retries / alternate paths:
- Isolation between copies:
- Capacity headroom:

## Static stability
- Last known good state:
- Behavior during dependency failure:
- Backpressure / buffering limit:

## Recovery practice
- Failover or recovery path:
- How it is exercised regularly:
- Idempotency / replay safety:

## Progressive delivery
- Rollout order:
- Feature flags / release channels:
- Blast-radius controls:
- Rollback constraints:

## Failure modes
- Non-critical dependency failure:
- Instance/process failure:
- Zone/region/provider-style failure:
- Self-induced deploy/config bug:

## Recommendation
- Required change:
- Optional improvement:
- Risk accepted:
```

For short answers, compress the headings but preserve the critical-path, isolation, static-stability, and rollout decisions.

## Guardrails

- Do not cargo-cult cloud or database architecture into small apps.
- Do not add redundancy unless the failure impact justifies the added complexity.
- Prefer removing critical-path dependencies before adding retries.
- Do not call a system redundant when the copies share the same failure domain.
- Do not treat feature flags as safety unless rollback is fast and state-compatible.
- Do not recommend unbounded retries, unbounded queues, or silent data loss.
- Static stability should be explicit about freshness, correctness, and safety limits.
- Progressive delivery reduces self-induced blast radius; it does not fix bad invariants.
- Recovery paths must be exercised; documentation alone is not recovery practice.

## Examples to include in SKILL.md

### External API in a background job

Input: a worker enriches records by calling an external API, then writes results to the database.

Expected review:

- Critical path: record ingestion should not depend on enrichment if enrichment is optional.
- Isolation: external API failures should pause enrichment, not intake or reads.
- Static stability: preserve last successful enrichment value with timestamp and stale marker.
- Recovery: queue jobs with bounded retries, dead-lettering, idempotent writes, and replay safety.
- Progressive delivery: roll out the new worker to a small tenant or low-risk queue partition first.

### Config service in request path

Input: every request fetches feature configuration from a control service.

Expected review:

- Critical path: serving requests currently depends on the control service.
- Isolation: move config reads out of the request path or use local cached snapshots.
- Static stability: if the config service fails, continue with last known good config and expose freshness telemetry.
- Failure mode: control-plane outage should block config changes, not serving existing traffic.

### Global database migration

Input: a schema migration and application change are planned for all customers at once.

Expected review:

- Progressive delivery: ship to dev, canary, low-risk tenants, then production cohorts.
- Isolation: avoid one bad migration impacting every tenant simultaneously.
- Static stability: define mixed-version compatibility and rollback behavior.
- Recovery practice: rehearse rollback or forward-fix on a realistic copy before rollout.

## Eval coverage

The skill should have deterministic fixture evals for:

1. External API dependency in a worker.
   - Requires isolation of optional enrichment from ingestion.
   - Requires bounded retries or dead-letter handling.
   - Requires last-known-good or stale-state behavior.
   - Forbids unbounded retries and claims that retries alone provide fault tolerance.

2. Control service dependency in request path.
   - Requires flagging the critical-path dependency.
   - Requires last-known-good config behavior.
   - Requires distinguishing control-plane failure from data/request-path failure.

3. Unsafe global rollout.
   - Requires progressive delivery.
   - Requires blast-radius controls.
   - Requires rollback or mixed-version compatibility.

## Repository updates

Add the skill under:

```txt
skills/fault-tolerant-design/
  SKILL.md
  evals/
    cases.json
    run-evals.mjs
    run-evals.test.mjs
    fixtures/
```

Update `README.md` to list the skill.

Update `package.json` `eval` script to include the new deterministic eval runner.

## Success criteria

- `fault-tolerant-design` frontmatter is valid and trigger-focused.
- The skill body is generic and not PlanetScale-specific.
- The skill captures isolation, redundancy, static stability, recovery practice, progressive delivery, and failure modes.
- Guardrails prevent over-engineering and fake safety.
- Evals cover worker dependency failure, critical-path config dependency, and unsafe global rollout.
- `npm test` passes.
- `npm run eval` passes for all skills.
