# Agent Work Skills

Personal agent skills for turning messy work and decisions into clear, reusable workflows.

## Skills

| Skill | Use when |
|---|---|
| [`deliberate-response-loop`](skills/deliberate-response-loop/SKILL.md) | Emotional pressure, avoidance, anxiety, frustration, ambition, contempt, or conflict needs a deliberate next move. |
| [`conventional-impact`](skills/conventional-impact/SKILL.md) | Completed engineering tickets need impact annotations, MR descriptions, sprint review notes, manager updates, release notes, or performance-review bullets. |

## Structure

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

Each skill is canonical under `skills/<skill-name>/SKILL.md`. Keep evals beside the skill they verify.

## Verify

```bash
npm test
npm run eval
```

The evals are deterministic fixture checks. They do not call live models.
