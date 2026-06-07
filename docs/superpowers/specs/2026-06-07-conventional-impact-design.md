# Conventional Impact Skill Design

## Goal

Create a reusable personal agent skill named `conventional-impact` that helps convert completed engineering tickets into clear, evidence-backed impact summaries for MR/PR descriptions, sprint review notes, manager updates, release notes, and performance-review bullets.

The skill should support lightweight inline annotations inspired by Conventional Comments so useful ticket context is captured while the work is still fresh, then aggregated later into presentable summaries.

## Audience

The primary audience is an agent helping an engineer summarize completed work. Secondary audiences are the engineer's reviewers, manager, PM/support partners, and future self reviewing accomplishments.

The skill must be safe for a public skills repository. Examples and evals should use neutral project language and avoid private workplace domain terms.

## Skill name

`conventional-impact`

Rationale: the name ties the skill to the requested Conventional Comments-style grammar while making the purpose explicit: delivery impact, not generic status reporting.

## Trigger conditions

The skill should activate when the user needs to prepare or refine:

- MR/PR descriptions
- Gerrit/GitLab/GitHub review summaries
- sprint review notes
- manager updates
- release notes
- performance-review bullets
- post-ticket accomplishment summaries
- rough notes or diffs containing `@impact`, `@metric`, `@evidence`, or similar annotations

It should not activate for generic emotional framing, ordinary factual questions, or speculative product strategy without completed work/evidence.

## Core principle

> Capture impact while it is fresh. Report only what the evidence supports.

The skill should prevent the common failure mode where engineering work is described only as implementation detail, while also preventing the opposite failure mode: inflated impact, invented metrics, or unsupported performance claims.

## Annotation grammar

Use grep-friendly annotations that can live in code comments, ticket notes, commit bodies, or MR drafts:

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

Common scopes:

- `user`
- `product`
- `perf`
- `data`
- `ux`
- `qa`
- `api`
- `frontend`
- `backend`
- `ops`
- `maintainability`
- `security`

## Summary workflow

When invoked, the agent should:

1. Collect available inputs: ticket title/description, diff summary, commits, review comments, tests, screenshots/logs, and inline annotations.
2. Separate facts into impact, metrics, evidence, decisions, risks, demo steps, release wording, and follow-ups.
3. Translate implementation details into user, product, technical, operational, or maintainability impact.
4. Preserve explicit before/after notation when provided.
5. Mark unknowns as `Not measured`, `Not provided`, or `Possible metric to verify` instead of implying unsupported value.
6. Generate the requested audience-specific output.

## Required output shape

The complete default output should include:

```md
# Ticket Impact Summary

## One-line summary

## Problem

## What changed

## Impact
- User impact:
- Product impact:
- Technical impact:
- Operational impact:

## Quantification
| Metric | Before | After | Change | Source |
|---|---:|---:|---:|---|

## Validation
- Unit tests:
- Manual tests:
- Screenshots/logs:
- Edge cases checked:

## Demo script

## Release note

## Manager update

## Performance-review bullet

## Follow-ups
```

Shorter requests may omit irrelevant sections, but must preserve evidence and uncertainty.

## Guardrails

- Never invent metrics, performance gains, user impact, or business value.
- Never convert `no measurement` into `faster`, `more performant`, or `reduced latency`.
- Put unsupported ideas under `Possible metric to verify`, not under `Impact` or `Quantification`.
- Preserve evidence exactly enough that someone can reproduce or audit it.
- Preserve explicit before/after notation such as `1 -> 4` in the quantification table.
- Separate risk reduced from risk introduced.
- Do not leak raw annotations into manager-facing output unless the user asks for raw notes.
- Do not hide incomplete work; list it as follow-up.
- Prefer concrete plain English over inflated executive language.

## Neutral example domain

Use neutral examples from personal/demo projects rather than private workplace terms. The current skill/evals use a poster-generator example:

- browser-based poster export
- A4, A3, 12x18, and square export presets
- missing cover art empty-state messaging
- form validation edge cases

This keeps the public repo safe while still exercising realistic ticket-summary behavior.

## Eval coverage

The skill should have deterministic fixture evals for:

1. Quantified impact from annotations.
   - Requires before/after notation like `1 -> 4`.
   - Requires evidence such as verified export presets.
   - Forbids raw annotation leakage.

2. No fake performance claims.
   - Input explicitly says no performance measurement was taken.
   - Output must preserve that fact.
   - Output must not say faster, speedup, reduced latency, or performance improved.

3. Annotation aggregation.
   - Input contains rough `@impact`, `@evidence`, and `@followup`-style notes.
   - Output must become MR/release/follow-up prose without raw annotation tags.

## Repository structure

This repo should be a multi-skill repository:

```txt
skills/
  deliberate-response-loop/
    SKILL.md
    evals/
  conventional-impact/
    SKILL.md
    evals/
docs/
  superpowers/specs/
```

Each skill is canonical under `skills/<skill-name>/SKILL.md`, with evals beside the skill they verify.

## Success criteria

- `conventional-impact` frontmatter is valid and trigger-focused.
- The skill documents the annotation grammar and summary workflow.
- The skill explicitly prevents fake metrics and unsupported performance claims.
- Examples and evals avoid private workplace domain terms.
- Existing `deliberate-response-loop` behavior remains preserved after repo restructuring.
- `npm test` passes.
- `npm run eval` passes for both skills.
