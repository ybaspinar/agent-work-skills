---
name: objective-code-review
description: Review commits, pull requests, and merge requests for requirement correctness, disciplined scope, design integrity, project fit, non-functional obligations, and regression protection without confusing pragmatism with permissiveness.
---

# Objective Code Review

Review for the product, not for personal taste. A change must satisfy its requirements, fit the system, and leave the touched design coherent without expanding beyond its scope.

Core rule:

> Block unmet requirements, material product risk, and newly introduced accidental complexity that makes the touched design misleading or harder to change correctly. Approve when only genuinely optional improvements remain.

## Establish the contract

Before judging implementation, determine what the change is required to do.

Triangulate from:

- the ticket, commit, PR, or MR description;
- acceptance criteria and author explanation;
- existing behavior, tests, documentation, and nearby code;
- repository policies, configuration, and established conventions;
- obligations implied by the changed surface.

Do not invent a requirement from preference. If available evidence cannot establish intent, ask one precise question that names the ambiguity and risk. Do not present an unproven concern as a defect.

## Review order

1. **Correctness** — Does every affected path produce the required behavior, including relevant failures and boundaries?
2. **Design integrity** — Does new code model the current domain honestly, or does it introduce copied history, impossible states, ambiguous names, or repeated defensive reasoning?
3. **Scope** — Is each change necessary for the requirement or a small, low-risk cleanup directly adjacent to it?
4. **Material risk** — Does the change introduce security, data integrity, reliability, compatibility, or serious maintainability risk?
5. **Project fit** — Does it use the project's deliberate design, libraries, patterns, and abstractions rather than blindly reproducing nearby accidents?
6. **Non-functional requirements** — Does the changed surface preserve its operational and product obligations?
7. **Regression protection** — Do tests protect the observable behavior that changed?

A passing test suite is evidence, not proof that the requirement is satisfied. Trace the requirement through the changed behavior.

## Tiger Style lens

Borrow [Tiger Style](https://tigerstyle.dev/)'s safety, performance, and experience lenses, not its project-specific rulebook. Apply them proportionately to the changed surface.

### Safety

Correctness is necessary but not sufficient. For code at a meaningful boundary or failure domain, check:

- explicit limits on caller-controlled resources, concurrency, retries, queues, loops, and fan-out;
- invariants expressed through types, assertions, or validation at the point where violation becomes dangerous;
- failures that are visible and contained instead of silently swallowed or converted into false success;
- interfaces with minimal surface area, clear ownership, and a defined fault model;
- deterministic seams around physical or non-deterministic dependencies where the project already supports them.

Do not demand assertions, limits, or fault machinery without a concrete failure mode. Existing behavior on a trusted, naturally bounded path is not a blocker merely because it lacks extra defense-in-depth.

### Performance

For changes that can materially affect latency, throughput, or capacity, make a rough mechanical sketch across network, storage, memory, and compute. Consider both bandwidth and latency, including multiplicative costs such as unbounded fan-out, repeated allocation or copying, serialization, and per-item I/O.

Performance findings need repository evidence, measurements, an explicit requirement, or a plausible material scale. Do not block on speculative micro-optimization.

### Experience

Optimize for the total cost of ownership: users who run the product and engineers who read, debug, and operate it repeatedly. Prefer:

- direct control and data flow;
- small interfaces and simple representations;
- names that expose meaning, units, ordering, and limits;
- state and variables defined close to where they are used;
- designs whose failure behavior can be understood locally.

Use established project conventions as the default, but do not use them to excuse a semantically false model. Do not impose Tiger Style's static allocation, zero-dependency policy, fixed integer choices, naming syntax, recursion ban, or zero-technical-debt stance unless the project or a concrete requirement calls for them. In particular, never use “zero technical debt” to expand a scoped change.

## Design integrity

Pragmatism means choosing the simplest design that expresses the actual contract. It does not mean approving avoidable confusion because the code runs or resembles nearby code.

Apply a higher bar to greenfield code and newly introduced abstractions: there is no compatibility constraint yet. Legacy constraints can explain a compromise; copied legacy code does not create one.

Check the touched design for:

- **Honest history** — Names and versions describe real, current contracts. A new controller, API, or type must not inherit `V2`, `V3`, `legacy`, migration flags, or predecessor comments unless those predecessors or an external compatibility contract actually exist.
- **Copy residue** — Reused code must be adapted completely. Audit copied identifiers, routes, versions, comments, error messages, feature flags, authorization, types, and tests. Similar structure is acceptable; leaked source semantics are not.
- **Truthful state models** — Types represent the domain states callers may rely on. An optional boolean creates three states: `true`, `false`, and absent. If absence has no distinct meaning, remove the optionality or default once at the boundary. If the domain has more than two meaningful states, use the language's enum, union, discriminated union, or equivalent named representation.
- **Local reasoning** — Do not make every caller remember permissive expressions such as `flag !== false`, double negation, sentinel combinations, or repeated absent-value checks. Give the policy one name and one boundary.
- **Justified abstraction** — Every suffix, layer, mode, and configuration branch must correspond to a present requirement or established project contract, not anticipated history or cargo-culted structure.

These are not cosmetic findings when introduced by the change. Request changes when misleading history, an ambiguous state model, or copied residue establishes a public contract or a pattern future code must repeat. Keep a one-off readability improvement non-blocking only when the current representation is still semantically exact and locally obvious.

Project conventions are evidence, not immunity. Follow deliberate conventions; challenge a nearby pattern when the new change exposes that it is accidental, semantically false, or needlessly spreads invalid states.

## Classify and process structural design defects

Call this family **structural design defects**: the code may execute today, but its names, types, or duplicated policy make correct future changes unnecessarily expensive. Do not downgrade them to “code smells” or “technical debt”; those labels hide the concrete defect and imply optional cleanup.

Use one subtype:

- **Semantic integrity defect** — A name, version, comment, or interface claims history or meaning the system does not have. Example: a greenfield `V3` controller with no predecessor or external V3 contract.
- **Copy-residue defect** — Reused code retains source-system identity, policy, assumptions, or dead branches that do not belong in the target.
- **State-model defect** — The representation permits unnamed, contradictory, or impossible states, so callers must infer policy. Example: an optional boolean when absence is not a real domain state.
- **Change-amplification defect** — One policy is encoded as repeated conditions, sentinels, or compensating checks, increasing the number of places a correct change must touch.

Process each defect with four facts:

1. **Mismatch** — Quote what the code says and the repository evidence that makes it false or ambiguous.
2. **Invariant** — State the rule the design should make obvious, such as “this controller has no version lineage” or “feature state is exactly enabled or disabled.”
3. **Amplification** — Name who must compensate now and what becomes more expensive later: callers, tests, documentation, routing, migration, or compatibility.
4. **Disposition** — Request the smallest correction that restores truthful semantics; do not prescribe a broad redesign.

Severity follows propagation and correction cost, not whether production has failed yet:

- **Blocking** — The change introduces false semantics or an invalid state model into new code; establishes a public/shared contract; makes callers compensate; duplicates the workaround; or would require compatibility work or migration to correct after merge.
- **Separate follow-up** — The defect is pre-existing, not relied on or worsened by this change, and has a named owner.
- **Non-blocking** — The representation is semantically exact and local; only presentation or readability could improve.

The key review question is: **Does merging this make the next correct change touch more places or first unlearn a lie?** If yes, it is a defect with measurable change-amplification cost, not a preference.

## Scope discipline

Allow:

- code required to implement or safely verify the requested behavior;
- small, low-risk cleanup next to the changed code when it makes the requested change clearer.

Challenge:

- unrelated refactoring;
- broad renaming or formatting churn;
- opportunistic architecture changes;
- dependency or pattern replacement unrelated to the stated goal.

An architectural change is in scope when the PR explicitly exists to introduce or replace that design. Otherwise, respect deliberate project decisions even when another design would be preferable. Challenge an established pattern when using it here causes concrete correctness or material risk, carries false history into a new contract, or spreads an ambiguous state model.

## Non-functional requirements

Non-functional requirements are requirements. Infer applicable obligations from repository evidence and the type of surface being changed.

Check only relevant obligations, including:

- API or controller documentation, discoverability, and whether the surface is intentionally internal;
- authentication, authorization, privacy, and input boundaries;
- compatibility for existing callers, stored data, protocols, and configuration;
- failure visibility, observability, resource ownership, and operational behavior;
- performance or capacity constraints where the change can materially affect them;
- rollout, migration, and rollback safety where state or external consumers are involved.

Do not demand generic ceremony. Tie every finding to repository evidence, the changed surface, or a concrete material risk.

## Tests

Changed observable behavior should be protected where practical and proportionate.

For bug fixes, normally require a regression test. The escaped bug demonstrates an unprotected path, so the test must fail without the fix and pass with it. Do not block only when the author gives a concrete reason that coverage is impractical or disproportionate.

For other changes, block missing coverage when the new or changed observable contract has material regression risk and existing tests do not protect it. Prefer contract behavior over private implementation details.

## Classify feedback

### Blocking

Use for:

- unmet functional or non-functional requirements;
- incorrect behavior or incomplete handling of an affected path;
- concrete security, data integrity, reliability, compatibility, or similarly material risk;
- newly introduced misleading history, copy residue, or an ambiguous state model that becomes a contract or repeatable pattern;
- avoidable accidental complexity in greenfield code that forces callers to reproduce non-obvious reasoning;
- an unjustified scope expansion that increases review or product risk;
- a practical but missing regression test for a bug fix;
- missing protection for another materially risky observable contract.

### Questions

Use when missing evidence prevents a conclusion. Ask for the exact fact needed to decide; do not disguise a preference as a question.

### Non-blocking

Use for optional improvements that do not prevent the change from satisfying its contract. Clearly label them so the author knows approval does not depend on acting on them.

A pre-existing issue that this change neither relies on nor worsens is not a blocker. Mention it only when material, and move it to a separate follow-up.

## Decision policy

- **Request changes** when at least one blocking finding remains.
- **Approve with comments** when requirements are met and only questions or non-blocking improvements remain.
- **Approve** when there are no actionable findings.

Do not prefer approval before completing the review. Approval is the result when no blocking issue remains, not a target that lowers the bar.

## Output

When there are findings, start with the decision and group feedback as applicable:

```md
Decision: Request changes | Approve with comments

Blocking
- `path/to/file.ext:line` — `[Semantic integrity | Copy residue | State model | Change amplification]` Direct verdict plus one concrete reason.

Questions
- `path/to/file.ext:line` — Precise question naming the missing fact and risk.

Non-blocking
- `path/to/file.ext:line` — Optional improvement plus one concrete reason.
```

Keep each finding to a direct verdict plus one reason. Point to the smallest useful file and line range. For a structural design defect, name the subtype and its change-amplification cost. Suggest an implementation only when it materially removes ambiguity, and never imply that one implementation is the only acceptable fix.

Use a Tiger Style lens tag only when it sharpens a separate safety, performance, or experience reason.

When no actionable problems exist, output only:

```md
Approve
```

## Avoid

- blocking on personal style, preferred libraries, or hypothetical purity;
- restating the diff without identifying a defect or decision;
- prescribing broad refactors for a local bug;
- treating uncertain risks as established failures;
- forcing the author to fix unrelated pre-existing debt;
- approving because tests pass without checking the actual requirement;
- treating copied code as an established convention without checking whether its names, versions, states, and assumptions are valid here;
- dismissing a misleading greenfield model as “just maintainability” when it creates the contract future changes must follow;
- burying a blocker among nits or optional suggestions.
