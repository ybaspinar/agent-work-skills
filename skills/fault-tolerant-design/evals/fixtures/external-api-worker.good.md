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
