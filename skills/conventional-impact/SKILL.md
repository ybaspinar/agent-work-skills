---
name: conventional-impact
description: Use when completing engineering tickets, preparing MR or PR descriptions, sprint review notes, manager updates, release notes, or performance-review bullets from code changes, diffs, ticket notes, review comments, tests, logs, screenshots, or inline impact annotations.
---

# Conventional Impact

Convert completed engineering work into evidence-backed, manager-readable impact without inventing value.

Core rule:

> Capture impact while it is fresh. Report only what the evidence supports.

Use this skill after or near the end of ticket work, especially when rough notes, code comments, commits, diffs, tests, or MR/Gerrit comments need to become a presentable summary.

## Annotation Grammar

Prefer grep-friendly annotations in code comments, ticket notes, commit bodies, or MR drafts:

```md
@impact(scope): delivered value
@metric(scope): before -> after, change, source
@evidence(scope): test, log, screenshot, query, manual check, or reviewer confirmation
@risk(scope): risk removed, risk reduced, or risk introduced
@decision(scope): meaningful product or implementation decision
@tradeoff(scope): accepted downside and why
@demo: reproducible demonstration step
@release: release-note wording
@followup: future work that is not part of this ticket
```

Common scopes: `user`, `product`, `perf`, `data`, `ux`, `qa`, `api`, `frontend`, `backend`, `ops`, `maintainability`, `security`.

Neutral example:

```md
@decision(frontend): generate poster exports in the browser instead of adding a backend job
@impact(user): users can export print-ready posters without waiting for server-side processing
@metric(product): supported export presets 1 -> 4, source: export preset list
@evidence(qa): verified PNG export for A4, A3, 12x18, and square presets
@risk(ops): avoids storing artwork uploads or API secrets on a server
@demo: choose an album, adjust poster text, export each preset, and open the PNG files
```

## Summary Workflow

1. Collect ticket title, description, diff summary, commits, review comments, tests, screenshots/logs, and `@...` annotations.
2. Separate facts into: impact, metrics, evidence, decisions, risks, demo steps, release wording, follow-ups.
3. Translate implementation into why it matters for users, product, operations, or maintainability.
4. Quantify only when the source data supports it. Show `Not measured` instead of implying a number.
5. Produce the requested audience-specific outputs.

## Required Output

Use the relevant sections for the ask. Default to this complete shape:

```md
# Ticket Impact Summary

## One-line summary
[Business/user/engineering value in one sentence.]

## Problem
[What was broken, slow, confusing, risky, or missing.]

## What changed
[Plain-English technical change.]

## Impact
- User impact:
- Product impact:
- Technical impact:
- Operational impact:

## Quantification
| Metric | Before | After | Change | Source |
|---|---:|---:|---:|---|
| Example measured item | 1 | 4 | 1 -> 4 (+3) | provided metric source |

## Validation
- Unit tests:
- Manual tests:
- Screenshots/logs:
- Edge cases checked:

## Demo script
1. ...

## Release note
[1-3 sentences suitable for PM/support/release docs.]

## Manager update
[Short status update focused on outcome and evidence.]

## Performance-review bullet
[One durable accomplishment bullet.]

## Follow-ups
- [ ] ...
```

If a section has no evidence, write `Not provided` or omit it when the requested format is short.

## Impact Translation Hints

Look for these measurable or explainable buckets:

| Bucket | Signals |
|---|---|
| Frontend | data window reduced, renders avoided, loading/error states clarified, clicks removed |
| Backend/data | API calls reduced, records scanned, query window reduced, pipeline runtime, retry/failure cases |
| QA/process | reproduction clarified, edge cases covered, triage ambiguity reduced, manual steps removed |
| Architecture | ownership clarified, coupling reduced, code paths unified, stale cache/data mismatch prevented |
| Operations | alerts reduced, safer rollout, easier diagnosis, support burden reduced |

## Guardrails

- Never invent metrics, performance gains, user impact, or business value.
- Never convert `no measurement` into `faster`, `more performant`, or `reduced latency`.
- Put unsupported ideas under `Possible metric to verify`, not under `Impact` or `Quantification`.
- Preserve explicit before/after notation when provided (`1 -> 4`, `7 days -> 1 day`). In the quantification table, the `Change` cell MUST include that exact before/after text; you may add derived deltas, but do not replace the original measurement.
- Preserve evidence exactly enough that someone can reproduce or audit it.
- Separate `Risk reduced` from `Risk introduced`.
- Do not leak raw `@impact` annotations into manager-facing output unless the user asks for raw notes.
- Do not hide incomplete work; list it as follow-up.
- Prefer concrete plain English over inflated executive language.

## Quality Bar

A good summary answers:

- What changed?
- Why did it matter?
- What evidence proves it?
- What number changed, if any?
- What can be demonstrated?
- What remains unresolved?

A bad summary only says what was implemented, uses vague words like “improved” without evidence, or claims metrics that were not measured.
