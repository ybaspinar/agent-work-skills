import assert from 'node:assert/strict'
import { test } from 'node:test'

import { evaluateOutput } from './run-evals.mjs'

test('rejects verdict-only review of copied greenfield history', () => {
  const result = evaluateOutput(
    {
      id: 'copied-v3',
      must_include: ['Review assessment', 'Material concerns', 'copied history', 'copy residue'],
      must_not_include: ['Decision:', 'Approve', 'naming nit'],
    },
    'Decision: Approve with comments\n\nNon-blocking: V3 may be a naming nit.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /Review assessment/)
  assert.match(result.failures.join('\n'), /Material concerns/)
  assert.match(result.failures.join('\n'), /copied history/)
  assert.match(result.failures.join('\n'), /copy residue/)
  assert.match(result.failures.join('\n'), /Decision:/)
  assert.match(result.failures.join('\n'), /Approve/)
  assert.match(result.failures.join('\n'), /naming nit/)
})

test('rejects optional-boolean commentary without prioritized state-model analysis', () => {
  const result = evaluateOutput(
    {
      id: 'optional-boolean',
      must_include: ['Review assessment', 'Material concerns', 'three states', 'default once at the boundary', 'repeated defensive reasoning'],
      must_not_include: ['idiomatic enough', 'Approve'],
      required_patterns: ['required boolean|enum|union|named state'],
    },
    'The enabled !== false check is idiomatic enough.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /Review assessment/)
  assert.match(result.failures.join('\n'), /Material concerns/)
  assert.match(result.failures.join('\n'), /three states/)
  assert.match(result.failures.join('\n'), /default once at the boundary/)
  assert.match(result.failures.join('\n'), /repeated defensive reasoning/)
  assert.match(result.failures.join('\n'), /required boolean\|enum\|union\|named state/)
})

test('passes a concise advisory design-integrity review', () => {
  const result = evaluateOutput(
    {
      id: 'advisory-review',
      must_include: ['Review assessment', 'Material concerns', 'three states', 'default once at the boundary'],
      must_not_include: ['Decision:', 'Approve', 'Request changes'],
      required_patterns: ['required boolean|enum|union|named state'],
    },
    `## Review assessment
The feature state is ambiguous and distributes its defaulting policy across callers.

## Material concerns
- enabled?: boolean creates three states and spreads repeated checks. Use a required boolean and default once at the boundary, or use an enum or named state when absence has meaning.`,
  )

  assert.equal(result.passed, true)
  assert.deepEqual(result.failures, [])
})
