# Fault Tolerant Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a generic `fault-tolerant-design` skill that helps agents apply isolation, redundancy, static stability, recovery practice, progressive delivery, and failure-mode analysis to ordinary software development.

**Architecture:** Follow the repository's existing skill layout: one `SKILL.md` plus deterministic fixture evals beside the skill. Reuse the established Node `node:test` + fixture-runner pattern from `deliberate-response-loop` and `conventional-impact`, then wire the new eval runner into `package.json` and list the skill in `README.md`.

**Tech Stack:** Markdown skill files, Node.js ESM, `node:test`, JSON eval cases, markdown fixtures.

---

## File structure

- Create: `skills/fault-tolerant-design/SKILL.md`
  - Main skill reference. Trigger-focused frontmatter, compact principles, output template, guardrails, and examples.
- Create: `skills/fault-tolerant-design/evals/cases.json`
  - Deterministic case definitions for expected text, forbidden text, and required regex patterns.
- Create: `skills/fault-tolerant-design/evals/run-evals.mjs`
  - Generic fixture evaluator copied from the existing eval-runner pattern and scoped to this skill.
- Create: `skills/fault-tolerant-design/evals/run-evals.test.mjs`
  - Unit tests for evaluator behavior: required concepts, forbidden unsafe recommendations, and good output passing.
- Create: `skills/fault-tolerant-design/evals/fixtures/external-api-worker.good.md`
  - Expected output for an optional enrichment worker with an external API dependency.
- Create: `skills/fault-tolerant-design/evals/fixtures/config-service-request-path.good.md`
  - Expected output for a config/control-service dependency in the request path.
- Create: `skills/fault-tolerant-design/evals/fixtures/global-rollout.good.md`
  - Expected output for a risky global schema/application rollout.
- Modify: `package.json`
  - Add the new eval runner to `npm run eval`.
- Modify: `README.md`
  - Add the new skill to the skill table and structure block.

---

### Task 1: Add evaluator tests first

**Files:**
- Create: `skills/fault-tolerant-design/evals/run-evals.test.mjs`

- [ ] **Step 1: Write the failing evaluator tests**

Create `skills/fault-tolerant-design/evals/run-evals.test.mjs`:

```js
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { evaluateOutput } from './run-evals.mjs'

test('requires required reliability concepts when expected', () => {
  const result = evaluateOutput(
    {
      id: 'missing-reliability-concepts',
      must_include: ['Critical path', 'last known good config', 'control-plane failure'],
      must_not_include: [],
      required_patterns: ['Static stability|Last known good'],
    },
    'Cache config locally.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /Critical path/)
  assert.match(result.failures.join('\n'), /last known good config/)
  assert.match(result.failures.join('\n'), /control-plane failure/)
})

test('fails unsafe retry-only recommendations', () => {
  const result = evaluateOutput(
    {
      id: 'unsafe-retry-only',
      must_include: ['bounded retries', 'dead-letter'],
      must_not_include: ['retry forever', 'retries alone provide fault tolerance'],
    },
    'Retry forever because retries alone provide fault tolerance.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /bounded retries/)
  assert.match(result.failures.join('\n'), /dead-letter/)
  assert.match(result.failures.join('\n'), /retry forever/)
  assert.match(result.failures.join('\n'), /retries alone provide fault tolerance/)
})

test('passes a concise fault-tolerant design review', () => {
  const result = evaluateOutput(
    {
      id: 'good-review',
      must_include: ['Critical path', 'bounded retries', 'last known good state'],
      must_not_include: ['retry forever'],
      required_patterns: ['Progressive delivery|Blast-radius'],
    },
    `## Critical path
Record ingestion must continue when optional enrichment is down.

## Static stability
Keep the last known good state with a freshness timestamp.

## Recovery practice
Use bounded retries and a dead-letter queue for replay-safe failures.

## Progressive delivery
Roll out by low-risk queue partition first to limit blast-radius.`,
  )

  assert.equal(result.passed, true)
  assert.deepEqual(result.failures, [])
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
node --test skills/fault-tolerant-design/evals/run-evals.test.mjs
```

Expected: FAIL because `./run-evals.mjs` does not exist yet.

---

### Task 2: Implement the eval runner

**Files:**
- Create: `skills/fault-tolerant-design/evals/run-evals.mjs`
- Test: `skills/fault-tolerant-design/evals/run-evals.test.mjs`

- [ ] **Step 1: Add the minimal evaluator implementation**

Create `skills/fault-tolerant-design/evals/run-evals.mjs`:

```js
#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function normalize(value) {
  return String(value).toLowerCase()
}

function includesText(output, expected) {
  return normalize(output).includes(normalize(expected))
}

export function evaluateOutput(testCase, output) {
  const failures = []

  for (const expected of testCase.must_include ?? []) {
    if (!includesText(output, expected)) {
      failures.push(`Missing required text: ${expected}`)
    }
  }

  for (const forbidden of testCase.must_not_include ?? []) {
    if (includesText(output, forbidden)) {
      failures.push(`Included forbidden text: ${forbidden}`)
    }
  }

  for (const pattern of testCase.required_patterns ?? []) {
    const regex = new RegExp(pattern, 'i')
    if (!regex.test(output)) {
      failures.push(`Missing required pattern: ${pattern}`)
    }
  }

  return {
    id: testCase.id,
    passed: failures.length === 0,
    failures,
  }
}

export function loadCases(casesPath) {
  return JSON.parse(readFileSync(casesPath, 'utf8'))
}

export function evaluateCases({ casesPath, fixturesDir }) {
  const cases = loadCases(casesPath)

  return cases.map((testCase) => {
    const fixturePath = resolve(fixturesDir, testCase.fixture)
    if (!existsSync(fixturePath)) {
      return {
        id: testCase.id,
        passed: false,
        failures: [`Missing fixture: ${fixturePath}`],
      }
    }

    const output = readFileSync(fixturePath, 'utf8')
    return evaluateOutput(testCase, output)
  })
}

function printResults(results) {
  for (const result of results) {
    if (result.passed) {
      console.log(`✅ ${result.id}`)
      continue
    }

    console.log(`❌ ${result.id}`)
    for (const failure of result.failures) {
      console.log(`   - ${failure}`)
    }
  }

  const failed = results.filter((result) => !result.passed)
  console.log(`\n${results.length - failed.length}/${results.length} fault-tolerant-design eval cases passed`)
  return failed.length === 0
}

function main() {
  const evalDir = dirname(fileURLToPath(import.meta.url))
  const results = evaluateCases({
    casesPath: join(evalDir, 'cases.json'),
    fixturesDir: join(evalDir, 'fixtures'),
  })

  process.exit(printResults(results) ? 0 : 1)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
```

- [ ] **Step 2: Run the focused test and verify it passes**

Run:

```bash
node --test skills/fault-tolerant-design/evals/run-evals.test.mjs
```

Expected: PASS with 3 tests passing.

---

### Task 3: Add eval cases and fixtures before the skill body

**Files:**
- Create: `skills/fault-tolerant-design/evals/cases.json`
- Create: `skills/fault-tolerant-design/evals/fixtures/external-api-worker.good.md`
- Create: `skills/fault-tolerant-design/evals/fixtures/config-service-request-path.good.md`
- Create: `skills/fault-tolerant-design/evals/fixtures/global-rollout.good.md`
- Test: `skills/fault-tolerant-design/evals/run-evals.mjs`

- [ ] **Step 1: Add case definitions**

Create `skills/fault-tolerant-design/evals/cases.json`:

```json
[
  {
    "id": "external-api-worker",
    "prompt": "Review a background worker that enriches records by calling an external API before writing enrichment results to the database.",
    "fixture": "external-api-worker.good.md",
    "must_include": [
      "Record ingestion must not depend on optional enrichment",
      "bounded retries",
      "dead-letter queue",
      "last known good enrichment",
      "idempotent writes"
    ],
    "must_not_include": [
      "retry forever",
      "retries alone provide fault tolerance",
      "unbounded queue"
    ],
    "required_patterns": [
      "Critical path",
      "Static stability|last known good",
      "Recovery practice|dead-letter"
    ]
  },
  {
    "id": "config-service-request-path",
    "prompt": "Review a request path that fetches feature configuration from a control service on every request.",
    "fixture": "config-service-request-path.good.md",
    "must_include": [
      "serving requests currently depends on the control service",
      "last known good config",
      "control-plane failure should block config changes, not existing traffic",
      "freshness telemetry"
    ],
    "must_not_include": [
      "fail closed on every request",
      "fetch live config on every request",
      "control service outage should stop traffic"
    ],
    "required_patterns": [
      "Critical path",
      "Isolation",
      "Static stability"
    ]
  },
  {
    "id": "global-rollout",
    "prompt": "Review a schema migration and application change planned for all customers at once.",
    "fixture": "global-rollout.good.md",
    "must_include": [
      "progressive delivery",
      "blast-radius controls",
      "mixed-version compatibility",
      "rollback",
      "production cohorts"
    ],
    "must_not_include": [
      "ship to all customers at once",
      "big bang rollout",
      "rollback is optional"
    ],
    "required_patterns": [
      "Progressive delivery",
      "Failure modes",
      "Recommendation"
    ]
  }
]
```

- [ ] **Step 2: Add the external API worker fixture**

Create `skills/fault-tolerant-design/evals/fixtures/external-api-worker.good.md`:

```md
## Critical path
- What must keep working: Record ingestion must not depend on optional enrichment.
- What can degrade or pause: Enrichment can pause while records continue to be accepted and stored.

## Isolation
- Dependencies in the critical path: The external API must be outside the ingestion critical path.
- Failure boundaries: API failures should affect only enrichment workers, not reads or ingestion.
- Cascade risks: Worker retries must not exhaust database connections or queue capacity.

## Static stability
- Last known good state: Preserve the last known good enrichment with a freshness timestamp and stale marker.
- Behavior during dependency failure: Serve existing records with stale enrichment or an explicit unavailable enrichment state.
- Backpressure / buffering limit: Use bounded queue depth and stop scheduling new enrichment work when capacity is exhausted.

## Recovery practice
- Failover or recovery path: Use bounded retries, a dead-letter queue, and replay-safe retry tooling.
- How it is exercised regularly: Reprocess a small dead-letter sample after deployment.
- Idempotency / replay safety: Use idempotent writes keyed by record ID and enrichment version.

## Progressive delivery
- Rollout order: Enable the worker for one low-risk queue partition before broader rollout.
- Blast-radius controls: Partition by tenant or queue shard so one bug cannot corrupt every record.

## Recommendation
- Required change: Move enrichment out of the ingestion critical path and add bounded retries with a dead-letter queue.
- Optional improvement: Add stale-enrichment telemetry.
- Risk accepted: Enrichment may be stale while the external API is unhealthy.
```

- [ ] **Step 3: Add the config service fixture**

Create `skills/fault-tolerant-design/evals/fixtures/config-service-request-path.good.md`:

```md
## Critical path
- What must keep working: User requests should continue serving with safe configuration.
- What can degrade or pause: New config changes can pause during a control-service outage.

## Isolation
- Dependencies in the critical path: Serving requests currently depends on the control service because every request fetches live config.
- Failure boundaries: A control-plane failure should block config changes, not existing traffic.
- Cascade risks: Latency or outage in the control service can cascade into all request handlers.

## Static stability
- Last known good state: Cache the last known good config locally with version and freshness telemetry.
- Behavior during dependency failure: Continue serving with the last known good config when it is within the documented safety window.
- Backpressure / buffering limit: Do not queue user requests behind config refresh; refresh asynchronously and expose stale state.

## Recovery practice
- Failover or recovery path: Restarting an app instance should load a recent config snapshot before accepting traffic.
- How it is exercised regularly: Test control-service unavailability in staging and verify traffic continues with cached config.

## Failure modes
- Non-critical dependency failure: Config publishing is unavailable, but serving continues with the last known good config.
- Self-induced deploy/config bug: Roll back the config version or disable the flag through the last valid snapshot.

## Recommendation
- Required change: Remove live config fetches from the per-request path.
- Optional improvement: Add alerts for stale config age.
- Risk accepted: Users may see stale feature behavior until the control service recovers.
```

- [ ] **Step 4: Add the global rollout fixture**

Create `skills/fault-tolerant-design/evals/fixtures/global-rollout.good.md`:

```md
## Critical path
- What must keep working: Existing reads and writes must work during the schema migration and application rollout.
- What can degrade or pause: New functionality depending on the schema change can remain disabled until the rollout is complete.

## Isolation
- Failure boundaries: Avoid a single migration failure impacting every customer simultaneously.
- Shared-fate risks: A global migration creates shared fate across all tenants and environments.

## Static stability
- Last known good state: The previous application version must continue working against both old and new schema states.
- Behavior during dependency failure: If migration fails in one cohort, pause that cohort and keep unmigrated cohorts on the old path.

## Progressive delivery
- Rollout order: Use progressive delivery through dev, canary, low-risk tenants, then production cohorts.
- Feature flags / release channels: Keep the application path disabled until the schema is ready for that cohort.
- Blast-radius controls: Roll out tenant-by-tenant or cohort-by-cohort instead of a big bang rollout.
- Rollback constraints: Validate mixed-version compatibility and rollback before production rollout.

## Failure modes
- Self-induced deploy/config bug: Stop the rollout at the affected cohort and roll back or forward-fix before continuing.
- Instance/process failure: Ensure workers can resume the migration idempotently.

## Recommendation
- Required change: Replace the all-customers-at-once plan with progressive delivery and explicit blast-radius controls.
- Optional improvement: Rehearse rollback on a realistic copy.
- Risk accepted: The rollout takes longer, but production cohorts are protected from broad impact.
```

- [ ] **Step 5: Run the new eval runner and verify fixtures pass**

Run:

```bash
node skills/fault-tolerant-design/evals/run-evals.mjs
```

Expected: PASS with `3/3 fault-tolerant-design eval cases passed`.

---

### Task 4: Write the fault-tolerant-design skill

**Files:**
- Create: `skills/fault-tolerant-design/SKILL.md`

- [ ] **Step 1: Add the skill body**

Create `skills/fault-tolerant-design/SKILL.md`:

```md
---
name: fault-tolerant-design
description: Use when designing or reviewing reliability-sensitive software, critical paths, background jobs, queues, database changes, rollout plans, dependency failures, resilience, fault tolerance, failover, or failure modes.
---

# Fault Tolerant Design

Review software so important paths keep working when dependencies, processes, deploys, or infrastructure fail.

Core rule:

> Keep the critical path isolated, redundant where justified, stable under dependency failure, and changed progressively.

Use this for architecture reviews, reliability reviews, background jobs, queues, data pipelines, database changes, rollout plans, external API dependencies, and incident-prone feature paths. Do not use it to add distributed-systems ceremony to low-risk code.

## Principles

| Principle | Review question |
|---|---|
| Isolation | Can this part fail without breaking the critical path? |
| Redundancy | Are important copies isolated, or do they share the same failure domain? |
| Static stability | What last known good state is safe to keep using during dependency failure? |
| Recovery practice | Is the recovery path exercised, idempotent, and boring? |
| Progressive delivery | How is blast radius limited when this change is wrong? |

## Default output

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

Compress the structure for short answers, but keep the critical-path, isolation, static-stability, and rollout decisions explicit.

## Review heuristics

### Isolation

- Remove non-essential dependencies from the request, write, or job critical path.
- Control, admin, analytics, billing, deploy, registry, and config-publishing failures should not break already-running user-facing work.
- Name shared-fate risks: same database, queue, config source, credentials, region, deploy step, or operator.

### Redundancy

- Add copies, retries, or alternate paths only when failure impact justifies complexity.
- Copies are not redundant if they depend on the same bottleneck.
- Retries need limits, backoff, idempotency, and a terminal state such as dead-lettering.

### Static stability

- Prefer last known good config/cache/state over live dependency reads in critical paths.
- State freshness, correctness limits, and safety windows explicitly.
- Use backpressure instead of unbounded queues or memory growth.

### Recovery practice

- Treat untested failover, restore, replay, and rollback as imaginary.
- Design idempotency and replay safety before relying on queues or retries.
- Exercise recovery paths regularly enough that they are routine.

### Progressive delivery

- Ship risky changes from least-critical to most-critical environments.
- Use flags, canaries, release channels, tenant cohorts, queue partitions, or database-by-database rollout when appropriate.
- Rollback must be fast, observable, and state-compatible before a feature flag counts as safety.

## Guardrails

- Do not cargo-cult cloud architecture into small apps.
- Do not add redundancy when removing a dependency is simpler.
- Do not call a system fault tolerant because it retries.
- Do not recommend retry forever, unbounded queues, or silent data loss.
- Do not call copies redundant when they share the same failure domain.
- Do not rely on feature flags if rollback cannot safely handle changed state.
- Do not hide degraded behavior; make stale, paused, or buffered states visible.

## Examples

### External API in a worker

If a worker enriches records through an external API, ingestion should not depend on enrichment when enrichment is optional. Keep the API outside the ingestion critical path. Preserve the last known good enrichment with a freshness timestamp. Use bounded retries, dead-lettering, and idempotent writes so replay is safe.

### Config service in the request path

If every request fetches feature config from a control service, serving traffic depends on the control plane. Move config refresh out of the request path. Serve from a last known good config snapshot with version, age, and safety limits. A control-service outage should block config changes, not existing traffic.

### Global migration rollout

If a database migration and app change are planned for all customers at once, the rollout has excessive shared fate. Require mixed-version compatibility, progressive delivery through dev/canary/low-risk cohorts, blast-radius controls, and a rehearsed rollback or forward-fix path.
```

- [ ] **Step 2: Manually check frontmatter constraints**

Confirm:

- `name` is `fault-tolerant-design`.
- `description` starts with `Use when`.
- Description describes triggers, not workflow instructions.
- Frontmatter is under 1024 characters.

---

### Task 5: Wire the skill into repository metadata

**Files:**
- Modify: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Update README skill table**

Modify `README.md` skill table so lines 7-10 become:

```md
| Skill | Use when |
|---|---|
| [`deliberate-response-loop`](skills/deliberate-response-loop/SKILL.md) | Emotional pressure, avoidance, anxiety, frustration, ambition, contempt, or conflict needs a deliberate next move. |
| [`conventional-impact`](skills/conventional-impact/SKILL.md) | Completed engineering tickets need impact annotations, MR descriptions, sprint review notes, manager updates, release notes, or performance-review bullets. |
| [`fault-tolerant-design`](skills/fault-tolerant-design/SKILL.md) | Reliability-sensitive software, critical paths, dependencies, rollouts, jobs, queues, database changes, or failure modes need fault-tolerance review. |
```

- [ ] **Step 2: Update README structure block**

Modify the structure block so it includes:

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
docs/
  superpowers/specs/
  superpowers/plans/
```

- [ ] **Step 3: Update package eval script**

Modify `package.json` so the `scripts` block is:

```json
{
  "test": "node --test skills/*/evals/*.test.mjs",
  "eval": "node skills/deliberate-response-loop/evals/run-evals.mjs && node skills/conventional-impact/evals/run-evals.mjs && node skills/fault-tolerant-design/evals/run-evals.mjs"
}
```

- [ ] **Step 4: Run all tests**

Run:

```bash
npm test
```

Expected: PASS with 9 tests total: 3 existing conventional-impact tests, 3 existing deliberate-response-loop tests, and 3 new fault-tolerant-design tests.

- [ ] **Step 5: Run all deterministic evals**

Run:

```bash
npm run eval
```

Expected: PASS with all three skill eval runners succeeding, including `3/3 fault-tolerant-design eval cases passed`.

---

### Task 6: Final review against the approved spec

**Files:**
- Review: `docs/superpowers/specs/2026-06-08-fault-tolerant-design-skill-design.md`
- Review: `skills/fault-tolerant-design/SKILL.md`
- Review: `skills/fault-tolerant-design/evals/cases.json`
- Review: `README.md`
- Review: `package.json`

- [ ] **Step 1: Check spec coverage**

Verify these spec requirements are implemented:

```md
- Frontmatter is valid and trigger-focused.
- The skill body is generic and not PlanetScale-specific.
- The skill captures isolation, redundancy, static stability, recovery practice, progressive delivery, and failure modes.
- Guardrails prevent over-engineering and fake safety.
- Evals cover worker dependency failure, critical-path config dependency, and unsafe global rollout.
- README lists the new skill.
- package.json eval script includes the new runner.
```

- [ ] **Step 2: Search for unsafe or vendor-specific leakage**

Use the repository search tool for these strings in `skills/fault-tolerant-design`:

```txt
PlanetScale
Vitess
Metal
AWS
GCP
retry forever
unbounded queue
retries alone provide fault tolerance
```

Expected:

- No vendor-specific strings in the skill or fixtures.
- Unsafe strings appear only in `must_not_include` test data or evaluator unit-test inputs, not as recommendations in `SKILL.md` or `.good.md` fixtures.

- [ ] **Step 3: Run final verification**

Run:

```bash
npm test
npm run eval
```

Expected:

- `npm test` exits 0 with 9/9 tests passing.
- `npm run eval` exits 0 with all deterministic eval cases passing.

- [ ] **Step 4: Commit**

Run:

```bash
git add README.md package.json docs/superpowers/specs/2026-06-08-fault-tolerant-design-skill-design.md docs/superpowers/plans/2026-06-08-fault-tolerant-design.md skills/fault-tolerant-design
git commit -m "feat: add fault tolerant design skill"
```

Expected: Commit succeeds with the new skill, evals, spec, plan, and metadata updates.
