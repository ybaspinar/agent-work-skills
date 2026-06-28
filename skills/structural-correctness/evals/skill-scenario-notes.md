# Skill scenario notes

Ran the three baseline pressure scenarios again with agents instructed to read and use `skills/structural-correctness/SKILL.md`.

## Bulk import

Skill-guided answer added explicit structural objective, caller-controlled blast radius, server-side boundary parsing, upload/row/parse limits, async `202`/job shape, idempotency, deduped email outbox, durable failure store, visible metrics, contract tests, and launch-day owner/pause path.

## Double-charge verification

Skill-guided answer rejected diff/green-test-only proof, required original repro, stable idempotency key at provider boundary, database-side atomic protection, concurrent/retry/timeout/interruption scenarios, provider truth, visible ambiguous paths, and permanent regression.

## API retirement

Skill-guided answer rejected source grep proof, required live telemetry over the real usage cycle, broader dependency search, deprecation/sunset window, tombstone handler, reversible rollout, docs/spec/SDK cleanup, owner/expiry for route reservation, and resurrection guard.

## Loopholes found

No new loopholes requiring a skill-body edit. The current skill already names the pressure points that the baseline responses missed or only implied: usage-cycle telemetry, lifecycle owner/expiry, resurrection guard, explicit structural objective, and running-system verification.
