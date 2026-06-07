import assert from 'node:assert/strict'
import { test } from 'node:test'

import { evaluateOutput } from './run-evals.mjs'

test('requires explicit evidence and quantification text when expected', () => {
  const result = evaluateOutput(
    {
      id: 'missing-evidence',
      must_include: ['1 -> 4', 'A4'],
      must_not_include: [],
      required_patterns: ['Validation|Evidence'],
    },
    'Added more poster export presets.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /1 -> 4/)
  assert.match(result.failures.join('\n'), /A4/)
})

test('fails when unsupported performance language appears', () => {
  const result = evaluateOutput(
    {
      id: 'fake-performance',
      must_include: ['No performance measurement was taken'],
      must_not_include: ['faster', 'reduced latency'],
    },
    'This is faster and reduced latency for poster export.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /No performance measurement was taken/)
  assert.match(result.failures.join('\n'), /faster/)
})

test('passes manager-ready aggregation without raw annotation leakage', () => {
  const result = evaluateOutput(
    {
      id: 'good-aggregation',
      must_include: ['MR description', 'Release note', 'mocked missing-art response'],
      must_not_include: ['@impact', '@evidence'],
    },
    `MR description:
The poster editor now explains when cover art is unavailable instead of leaving the artwork area ambiguous.

Evidence:
Verified with mocked missing-art response.

Release note:
Improved empty-state messaging when album cover art is unavailable.`,
  )

  assert.equal(result.passed, true)
  assert.deepEqual(result.failures, [])
})
