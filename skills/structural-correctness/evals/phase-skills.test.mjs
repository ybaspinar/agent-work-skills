import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const phaseSkills = [
  ['structural-triage', ['reproduce before ranking', 'one owner', 'explicit disposition']],
  ['structural-planning', ['acceptance criteria', 'Sequence', 'failure modes']],
  ['structural-implementing', ['Parse at the door', 'idempotent', 'failure visible']],
  ['structural-integrating', ['shared substrate', 'boundary contract', 'end-to-end']],
  ['structural-reviewing', ['silent swallow', 'caller-controlled', 'contract tests']],
  ['structural-verifying', ['red before', 'green after', 'running system']],
  ['structural-operating', ['canaries', 'jitter', 'runbook']],
  ['structural-investigating', ['falsifiable', 'deterministic', 'failing test']],
  ['structural-retrospective', ['system gap', 'owner', 'triage-ready']],
  ['structural-retirement', ['live telemetry', 'Sunset', 'resurrection guard']],
]

test('phase subskills exist with trigger-focused frontmatter', () => {
  for (const [name] of phaseSkills) {
    const text = readFileSync(`skills/${name}/SKILL.md`, 'utf8')
    assert.match(text, new RegExp(`name: ${name}`))
    assert.match(text, /description: Use when /)
    assert.match(text, /^---\n[\s\S]+?\n---\n/m)
  }
})

test('phase subskills preserve expected structural checks', () => {
  for (const [name, phrases] of phaseSkills) {
    const text = readFileSync(`skills/${name}/SKILL.md`, 'utf8').toLowerCase()
    for (const phrase of phrases) {
      assert.ok(text.includes(phrase.toLowerCase()), `${name} missing ${phrase}`)
    }
  }
})
