# Baseline pressure notes

Ran three ordinary-agent scenarios before writing `structural-correctness`.

## Bulk import

Baseline caught server-side validation, bounds, durable import record, idempotency, email decoupling, and local-file risk. It did not consistently force lifecycle ownership/expiry or explicit failure metrics as structural requirements.

## Double-charge verification

Baseline was strong on red/green, replay, concurrent duplicate submissions, ambiguous timeouts, provider evidence, and state consistency. The skill should preserve that standard and make it easy to trigger under generic verification requests.

## API retirement

Baseline caught source-search insufficiency, deprecation policy, docs/spec cleanup, tombstone handler, monitoring, rollback, and finite route reservation. It did not explicitly name observation over the real usage cycle, reverse contraction, or resurrection guard as mandatory retirement structure.
