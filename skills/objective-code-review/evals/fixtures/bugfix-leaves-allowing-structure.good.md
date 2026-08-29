Decision: Request changes

Blocking
- `src/domain/Feature.ts:4` — `[State model / Change amplification]` The fix handles the symptom in one controller but leaves the allowing structure, `enabled?: boolean`, with unnamed absence semantics while other callers still use truthiness. Put the new home of the invariant in a required boolean, named state, or one boundary default; audit all callers and remove or replace their compensating checks so behavior cannot diverge again.
- `test/feature-controller.test.ts:18` — The controller-only test does not protect the escaped contract. Add a regression that is red against the original undefined case and proves every supported entry path receives the same domain state.
