---
name: objective-code-review
description: Review commits, pull requests, and merge requests for requirement correctness, disciplined scope, project fit, non-functional obligations, and regression protection while preferring approval over gatekeeping.
---

# Objective Code Review

Review for the product, not for personal taste. A change must satisfy its requirements without expanding beyond them, and a compliant change should ship.

Core rule:

> Block unmet requirements and material product risk. Approve correct, scoped changes even when optional improvements remain.

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
2. **Scope** — Is each change necessary for the requirement or a small, low-risk cleanup directly adjacent to it?
3. **Material risk** — Does the change introduce security, data integrity, reliability, compatibility, or serious maintainability risk?
4. **Project fit** — Does it use the project's established design, libraries, patterns, and abstractions?
5. **Non-functional requirements** — Does the changed surface preserve its operational and product obligations?
6. **Regression protection** — Do tests protect the observable behavior that changed?

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

Project conventions still win. Do not impose Tiger Style's static allocation, zero-dependency policy, fixed integer choices, naming syntax, recursion ban, or zero-technical-debt stance unless the project or a concrete requirement calls for them. In particular, never use “zero technical debt” to expand a scoped change.

## Scope discipline

Allow:

- code required to implement or safely verify the requested behavior;
- small, low-risk cleanup next to the changed code when it makes the requested change clearer.

Challenge:

- unrelated refactoring;
- broad renaming or formatting churn;
- opportunistic architecture changes;
- dependency or pattern replacement unrelated to the stated goal.

An architectural change is in scope when the PR explicitly exists to introduce or replace that design. Otherwise, respect established project decisions even when another design would be preferable. Challenge an established decision only when using it here causes concrete correctness or material risk.

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

Use only for:

- unmet functional or non-functional requirements;
- incorrect behavior or incomplete handling of an affected path;
- concrete security, data integrity, reliability, compatibility, or similarly material risk;
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

Prefer approval. Review is not a gatekeeping exercise; its purpose is to improve the product while keeping correct work moving.

## Output

When there are findings, start with the decision and group feedback as applicable:

```md
Decision: Request changes | Approve with comments

Blocking
- `path/to/file.ext:line` — `[Safety | Performance | Experience]` Direct verdict plus one concrete reason.

Questions
- `path/to/file.ext:line` — `[Safety | Performance | Experience]` Precise question naming the missing fact and risk.

Non-blocking
- `path/to/file.ext:line` — `[Safety | Performance | Experience]` Optional improvement plus one concrete reason.
```

Keep each finding to a direct verdict plus one reason. Point to the smallest useful file and line range. Suggest an implementation only when it materially removes ambiguity, and never imply that one implementation is the only acceptable fix.

Use a Tiger Style lens tag only when it sharpens the reason. Omit it for contract, scope, project-fit, or test findings that do not belong to one of the three lenses.

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
- burying a blocker among nits or optional suggestions.
