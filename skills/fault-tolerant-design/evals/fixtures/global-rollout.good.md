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
- Blast-radius controls: Roll out tenant-by-tenant or cohort-by-cohort instead of changing every customer simultaneously.
- Rollback constraints: Validate mixed-version compatibility and rollback before production rollout.

## Failure modes
- Self-induced deploy/config bug: Stop the rollout at the affected cohort and roll back or forward-fix before continuing.
- Instance/process failure: Ensure workers can resume the migration idempotently.

## Recommendation
- Required change: Replace the all-customers-at-once plan with progressive delivery and explicit blast-radius controls.
- Optional improvement: Rehearse rollback on a realistic copy.
- Risk accepted: The rollout takes longer, but production cohorts are protected from broad impact.
