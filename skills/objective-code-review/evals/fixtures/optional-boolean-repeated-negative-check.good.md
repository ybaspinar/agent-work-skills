## Review assessment
The behavior depends on an unnamed third state, so the new domain model distributes policy instead of expressing it once.

## Material concerns
- `src/domain/Feature.ts:8-19` — `[State model / Change amplification]` `enabled?: boolean` creates three states—true, false, and undefined—while the domain describes only enabled and disabled. Repeating `enabled !== false` across controllers and services spreads repeated defensive reasoning to every caller and multiplies the places a policy change must touch. Use a required boolean and default once at the boundary; if absence is a real third state, model it as an enum, union, or equivalent named state and handle it explicitly.
