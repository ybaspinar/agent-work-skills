---
name: typescript-coding-standards
description: Use when writing, reviewing, or refactoring TypeScript code where correctness, typed errors, parsing boundaries, domain types, module boundaries, tests, adapters, config, telemetry, or agent coding conventions matter.
---

# TypeScript Coding Standards

Design TypeScript so invalid data is stopped at boundaries, expected failures are typed, and callers cannot accidentally violate domain invariants.

Credit: adapted from David Mulroy's TypeScript Coding Standards draft gist by `dmmulroy`: https://gist.github.com/dmmulroy/9c80f1f499b031aa0b6525b5d9ae25f0

Core rule:

> Preserve correctness first, follow local convention second, and improve touched code without forcing unrelated migrations.

Use this before adding TypeScript modules, endpoint handlers, services, adapters, tests, schema parsing, config handling, telemetry, or domain types. Do not use it to rewrite a whole codebase during an unrelated change.

## Decision priority

1. Preserve correctness, safety, and debuggability.
2. Follow established project architecture and conventions.
3. Improve the touched design toward these standards.
4. Avoid broad migrations unless explicitly requested.
5. Document meaningful trade-offs with comments or ADRs.

## Quick reference

| Area | Standard |
|---|---|
| Expected failures | Return typed values: `Result<T, E>` / Effect / `better-result`; throw only for defects. |
| Boundaries | Parse early into domain/refined types; do not pass raw DTOs through core logic. |
| Domain primitives | Use branded/refined types for IDs, emails, money, durations, percentages, and units. |
| State | Use tagged unions/value classes for lifecycle states; avoid boolean blindness. |
| Modules | Prefer deep, cohesive modules; delete shallow pass-through wrappers. |
| Dependencies | Inject the smallest meaningful interface; concrete adapters may be wider. |
| Adapters | Audit existing adapters before creating one; ADR meaningful new adapters/services. |
| Entrypoints | Keep REST/CLI/GraphQL/workers thin; share authorization and business rules. |
| Retries/workflows | Use sagas/workflows for retry/compensation/idempotency; never hold DB tx across network calls. |
| Tests | Test behavior through real seams; avoid `vi.mock`/`jest.mock` module mocks and spy-driven tests. |
| TypeScript safety | Prefer `readonly`, strict settings, `import type`; avoid `any`, `!`, and casts without SAFETY comments. |
| Config/secrets | Parse config at startup; wrap secrets in `Redacted<T>`; never log secrets. |
| Exports | Export only caller-facing APIs; no barrels by default; JSDoc exported symbols. |

## Agent checklist before coding

- Inspect local conventions for errors, schemas, dependency injection, tests, observability, adapters, services, and module layout.
- Look for existing domain modules/types before creating new primitives.
- Look for existing adapters/services before creating new ones.
- Parse untrusted input at the edge and use domain types internally.
- Prefer typed errors as values for new expected failures.
- Preserve existing telemetry/error mechanics at integration boundaries.
- Test through public interfaces and real seams.
- Use `fast-check` arbitraries for parsers, smart constructors, state machines, and normalization when properties are clearer than examples.
- Add JSDoc for exported symbols.
- Add an ADR when a meaningful new adapter/service is created after an adapter reuse audit.

## Standards

### Existing code first, but not at any cost

Fit the local architecture. If the codebase uses exception-style framework handlers, translate typed domain errors at the boundary instead of rewriting the app. Do not use “local style” as an excuse to add new raw DTOs, unchecked secrets, module mocks, or pass-through adapters when the touched code can be safely improved.

### Errors and failures

Expected failures include parsing, domain, authorization, integration, I/O, persistence, workflow, and recoverable external-service failures. Put them in the return type.

Preferred order:

1. Effect, when the codebase already uses Effect.
2. `better-result`, when already available and appropriate.
3. A small local tagged union.

```ts
type Result<T, E extends Error> =
  | { readonly _tag: "ok"; readonly value: T }
  | { readonly _tag: "err"; readonly error: E }
```

Prefer `Promise<Result<User, UserLookupError>>`, not `Promise<User>` that rejects for ordinary lookup/storage failures. Promise rejection is throwing.

Throw only for unrecoverable defects: impossible branches, violated invariants, startup misconfiguration, `notYetImplemented`, or catastrophic runtime conditions. Use existing helpers such as `casesHandled`, `shouldNeverHappen`, or `notYetImplemented` instead of inventing `assertNever` clones.

Custom expected errors need stable tags, useful messages, structured safe fields, and optional `cause: unknown`. Keep error unions precise near module boundaries; reserve broad `AppError` unions for entrypoints/rendering/orchestration.

### Sensitive data, telemetry, and debugging

Traces/logs should include safe fields: domain IDs, operation names, dependency/provider names, state tags, retry counts, typed error tags, and safe summaries. Never include tokens, API keys, passwords, credentials, or raw secrets.

Wrap secrets as `Redacted<T>` or Effect `Redacted.Redacted` at the boundary. Unwrap only inside the adapter that needs the raw value.

### Parse, do not merely validate

Boundary code should convert unknown input into domain types early:

```txt
unknown -> HttpBodyDto -> CreateUserInput -> EmailAddress/UserId/etc.
```

Avoid passing `z.infer<typeof CreateUserSchema>` or raw DTOs through application/core logic. Use names that preserve meaning:

- `parseX(input): Result<X, ParseXError>` for untrusted or less-structured input.
- `makeX(...)` / `createX(...)` for smart constructors from already-typed pieces.
- `isX(value): boolean` for predicates.
- `assertX(...)` rarely, mostly at framework/test boundaries.

Schema libraries are boundary parsers, not ad-hoc validators in core logic. Use the repo's established schema library; otherwise prefer Effect Schema in Effect codebases, Standard Schema compatibility for generic helpers, Zod 4, or hand-written smart constructors for small domain types.

### Branded types and correct construction

Use branded/refined/domain types for meaningful primitives: `UserId`, `OrgId`, `WorkflowId`, `EmailAddress`, `NonEmptyString`, `Url`, `PositiveInt`, `Cents`, `Percentage`, `Milliseconds`, `Bytes`, `UsdCents`.

Construct them through parsers or smart constructors. Push optionality outward; branch or parse before calling functions that require values. Avoid `Partial<T>` as domain/application input unless partiality is the real domain concept.

### State machines and boolean blindness

Model meaningful lifecycle states with tagged unions or value classes:

```ts
type Invoice =
  | { readonly _tag: "Draft"; readonly id: InvoiceId; readonly lines: NonEmptyArray<LineItem> }
  | { readonly _tag: "Sent"; readonly id: InvoiceId; readonly sentAt: Instant }
  | { readonly _tag: "Paid"; readonly id: InvoiceId; readonly paidAt: Instant }
```

Avoid state bags such as `{ isSent: boolean; isPaid: boolean; sentAt?: Date }`. Avoid boolean parameters that control behavior; prefer named options or domain types. Predicate return values may still be booleans.

### Modules and abstractions

Prefer deep modules that hide substantial behavior/invariants behind cohesive, low-burden APIs. Use the deletion test: if deleting the module removes complexity, it was pass-through waste; if deleting it spreads complexity into callers, it earns its keep.

Domain modules center on one concept and expose parsers, smart constructors, combinators, predicates, interpreters, arbitraries, and formatting helpers. Application/service modules own real capabilities such as `PasswordReset`, `Billing`, `Invitations`, or `SubscriptionLifecycle`.

Avoid vague names: `Manager`, `Processor`, `Helper`, `utils.ts`, `common.ts`, `misc.ts`. Use precise capability or domain names.

### Dependency interfaces and adapters

Depend on the smallest meaningful shape a module uses. Let adapters be wider:

```ts
type UsersForPasswordReset = {
  findActiveByEmail(email: EmailAddress): Promise<Result<ActiveUser, UserLookupError>>
}

export class PasswordReset {
  constructor(private readonly users: UsersForPasswordReset) {}
}
```

Before creating an adapter/service, audit existing adapters/services. Prefer, in order:

1. Reuse an existing adapter through a narrow dependency type.
2. Extend an existing adapter if the method fits the same cohesive capability.
3. Create a new adapter only when reuse/extension would create bad coupling.

When creating a meaningful new adapter/service, write an ADR recording what was checked and why reuse/extension did not fit. ADRs are not needed for tiny local test adapters, obvious in-memory fakes, or trivial framework glue.

### Functional core, imperative shell, and entrypoints

Keep domain/application behavior reusable across REST, CLI, GraphQL, workers, and jobs. The core owns parsers, state transitions, combinators, and decisions. The shell parses input, sequences effects, classifies external failures, and handles I/O, queues, persistence, telemetry, time, and randomness.

Entrypoints should translate protocols only. Do not duplicate authorization or business rules in controllers/resolvers/CLI handlers. Shared modules should receive parsed authorization inputs such as `AdminUser`, `Session`, `Principal`, or `CommandActor`.

### Workflows, transactions, and idempotency

Use ordinary calls or database transactions for simple single-boundary operations. Use a saga/durable workflow when the process needs retries, compensation, idempotency, resumability, timers, human approval, cross-service coordination, or multiple transaction boundaries.

Do not hold database transactions open across network calls. Any retried command/job/workflow step needs an explicit idempotency strategy: key, unique constraint, dedupe record, state transition guard, outbox, or inbox.

### Testing

Prefer confidence-oriented tests:

1. E2E for critical flows.
2. Integration tests through real seams.
3. Focused/property tests for pure domain modules.
4. Unit tests when they test meaningful behavior.

Never use `vi.mock` or `jest.mock` for module mocking. Use constructor-injected interfaces/classes, Effect services/layers, local DB substitutes, SQLite, in-memory adapters, or fake external adapters. Assert observable behavior: returned value/error, persisted state, emitted event/message, rendered response, or sent email record in a fake/local adapter. Avoid spy assertions unless the interaction itself is the only observable behavior.

### TypeScript style and safety

Use strict settings where practical: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.

Prefer immutable `readonly` values. Local mutation is acceptable inside hidden imperative internals, builders, or performance-sensitive adapters behind precise interfaces.

Avoid `any`, non-null assertions (`!`), and casts with `as Type`. `as const` is fine. Rare casts need Rust-like safety comments:

```ts
// SAFETY: TypeScript cannot express the brand. parseEmailAddress checked the normalized string before branding.
return normalized as EmailAddress
```

Rare `any` needs a targeted lint ignore and justification. Do not use `!`; branch, parse, or refine.

### Imports, exports, files, and docs

Prefer direct imports from the owning file. Avoid barrel `index.ts` re-export layers by default. Namespace imports can preserve domain module shape; named imports are good for classes and focused helpers. Use `import type` / `export type` for type-only dependencies.

Export only intended caller APIs. Do not export internals just for tests. Use JSDoc for exported functions, classes, methods, constants, and usually exported types. Use `@throws` only for unrecoverable defects, framework-required behavior, or temporary `notYetImplemented` paths.

### Configuration and resources

Parse environment/config at startup or the earliest boundary into typed config with branded/redacted values. Do not read `process.env` throughout the app. Missing/invalid config is a startup failure with useful context.

Avoid top-level side effects except in true entrypoint/bootstrap files. Resource creation and cleanup should be explicit and owned by bootstrap/imperative shell code or Effect layers. Avoid mutable singletons/global state except isolated framework boundary requirements.

## Example

```ts
export class InvalidEmailAddress extends Error {
  readonly _tag = "InvalidEmailAddress"

  constructor(readonly inputSummary: string) {
    super("Invalid email address")
  }
}

export type EmailAddress = string & { readonly __brand: "EmailAddress" }

export function parseEmailAddress(input: unknown): Result<EmailAddress, InvalidEmailAddress> {
  if (typeof input !== "string") {
    return { _tag: "err", error: new InvalidEmailAddress(typeof input) }
  }

  const normalized = input.trim().toLowerCase()
  if (!normalized.includes("@")) {
    return { _tag: "err", error: new InvalidEmailAddress("invalid-format") }
  }

  // SAFETY: The format check and normalization above are the only construction path.
  return { _tag: "ok", value: normalized as EmailAddress }
}
```

Callers receive either a parsed `EmailAddress` or a typed error. They cannot accidentally pass an untrimmed raw string into core logic.

## Common mistakes and rationalizations

| Excuse | Reality |
|---|---|
| “This is a 15-minute field addition, not an input redesign.” | Parse the touched boundary enough to avoid spreading new raw DTO fields. Keep scope local, but do not add new unchecked data. |
| “Existing code throws, so new expected failures should throw too.” | New internals can return typed errors and translate to existing throw/framework behavior at the boundary. |
| “A wide repository already exists; one more method is consistent.” | Inject the narrow shape the use case needs. Extend only when the method fits the adapter's cohesive capability. |
| “No time for an adapter audit or ADR.” | A quick local audit prevents duplicate adapters. ADR only meaningful new services/adapters, not trivial glue. |
| “The tests already use `vi.mock`; keep the mock.” | Release pressure is when brittle tests hurt most. Prefer real seams/fakes for touched behavior. |
| “`process.env.SECRET!` is fine because prod sets it.” | Parse config at startup; secrets missing in tests or deploys should fail with context, not crash later. |
| “A spy proves the email was sent.” | Prefer observable behavior such as a fake email adapter's recorded sent message. Use spies only when interaction is the behavior. |

## Red flags

Stop and redesign the touched slice when you are about to:

- Add a new raw string/number/DTO field to core/application logic.
- Add `throw`/rejected promises for an expected domain, parsing, auth, I/O, or persistence failure.
- Add `!`, broad `any`, or an unjustified cast.
- Add another `vi.mock`/`jest.mock` module mock for new behavior.
- Read `process.env` from non-bootstrap code.
- Create a new adapter without checking existing adapters/services.
- Add a pass-through `Manager`, `Processor`, `Helper`, `utils.ts`, or barrel export.
- Model lifecycle state with boolean combinations or nullable bags.

## Handoff topics

Use domain-specific skills for deeper platform rules when applicable: Cloudflare Workers/Durable Objects, Effect services/layers, test runner conventions, oxlint/tsconfig/import tooling, and project-specific ADR rules.
