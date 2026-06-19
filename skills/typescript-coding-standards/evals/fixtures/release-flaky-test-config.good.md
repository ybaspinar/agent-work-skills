## Release blocker fix

Replace the spy-based test expansion with a real seam and test with a fake email adapter that records a sent email record. Assert observable behavior: returned result plus the fake adapter's recorded invitation message.

Parse config at startup into typed config, wrapping the invitation secret with `Redacted` or a project-local redacted type. Pass config into the invitation module; no non-null assertion and no `process.env` read inside the module.

If the codebase already has `vi.mock` or `jest.mock` in nearby tests, leave unrelated tests alone, but do not add a new module mock for this behavior.
