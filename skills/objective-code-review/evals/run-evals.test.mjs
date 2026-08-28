import assert from 'node:assert/strict'
import { test } from 'node:test'

import { evaluateOutput } from './run-evals.mjs'

test('rejects approval of copied greenfield version history', () => {
  const result = evaluateOutput(
    {
      id: 'copied-v3',
      must_include: ['Decision: Request changes', 'copied history', 'copy residue'],
      must_not_include: ['Approve with comments', 'naming nit'],
    },
    'Decision: Approve with comments\n\nNon-blocking: V3 may be a naming nit.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /Decision: Request changes/)
  assert.match(result.failures.join('\n'), /copied history/)
  assert.match(result.failures.join('\n'), /copy residue/)
  assert.match(result.failures.join('\n'), /Approve with comments/)
  assert.match(result.failures.join('\n'), /naming nit/)
})

test('rejects optional-boolean approval without state-model analysis', () => {
  const result = evaluateOutput(
    {
      id: 'optional-boolean',
      must_include: ['three states', 'default once at the boundary', 'repeated defensive reasoning'],
      must_not_include: ['idiomatic enough'],
      required_patterns: ['required boolean|enum|union|named state'],
    },
    'The enabled !== false check is idiomatic enough.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /three states/)
  assert.match(result.failures.join('\n'), /default once at the boundary/)
  assert.match(result.failures.join('\n'), /repeated defensive reasoning/)
  assert.match(result.failures.join('\n'), /required boolean\|enum\|union\|named state/)
})

test('passes a strict design-integrity review', () => {
  const result = evaluateOutput(
    {
      id: 'strict-review',
      must_include: ['Decision: Request changes', 'three states', 'default once at the boundary'],
      must_not_include: ['Approve with comments'],
      required_patterns: ['required boolean|enum|union|named state'],
    },
    `Decision: Request changes

Blocking
- enabled?: boolean creates three states and spreads repeated checks. Use a required boolean and default once at the boundary, or use an enum or named state when absence has meaning.`,
  )

  assert.equal(result.passed, true)
  assert.deepEqual(result.failures, [])
})
