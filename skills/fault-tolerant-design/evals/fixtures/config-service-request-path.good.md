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
