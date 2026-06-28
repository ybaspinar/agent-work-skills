## Must fix

- Grep is not enough. Prove zero legitimate use from live telemetry over the endpoint's real usage cycle, including old clients, partner integrations, scheduled jobs, SDKs, and other repos.
- If this is public, honour the deprecation window with Deprecation / Sunset communication before the hard removal. Tomorrow is only safe if that window has already elapsed or this is a security exception.
- Contract in reverse: divert/replace callers, stop new use, watch it go cold, then remove the implementation. Keep each step reversible until the drop.
- Keep a small 410 Gone tombstone handler with stable error code and migration link while stragglers drain; deleting the handler and returning 410 conflict.
- Update current docs, OpenAPI/specs, SDK surfaces, examples, and release notes with the retirement. Docs can wait only for historical archive pages.
- Give the reserved route an owner and expiry/review date. Do not reserve forever by default.
- Add a resurrection guard: alert on traffic to the retired route or a test/lint check that fails if the removed route name reappears.

## Can defer

- Historical blog/tutorial cleanup and dashboard polish can defer after canonical docs/specs are correct.
- Deep internal helper deletion can follow once the tombstone and live telemetry show the route is cold.
