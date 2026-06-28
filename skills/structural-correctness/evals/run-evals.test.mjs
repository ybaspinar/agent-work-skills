import assert from 'node:assert/strict'
import { test } from 'node:test'

import { evaluateOutput } from './run-evals.mjs'

test('requires structural boundary and lifecycle concepts', () => {
  const result = evaluateOutput(
    {
      id: 'missing-structure',
      must_include: ['Client-side validation is UX, not security', 'idempotency', 'owner and expiry'],
      must_not_include: [],
      required_patterns: ['Must fix', 'Can defer'],
    },
    'Validate the CSV on the server and add tests.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /Client-side validation/)
  assert.match(result.failures.join('\n'), /idempotency/)
  assert.match(result.failures.join('\n'), /owner and expiry/)
})

test('rejects weak verification claims', () => {
  const result = evaluateOutput(
    {
      id: 'weak-verification',
      must_include: ['red before the fix', 'green after'],
      must_not_include: ['green test is enough', 'diff is enough'],
    },
    'The green test is enough because the diff is enough.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /red before the fix/)
  assert.match(result.failures.join('\n'), /green after/)
  assert.match(result.failures.join('\n'), /green test is enough/)
  assert.match(result.failures.join('\n'), /diff is enough/)
})

test('passes a concise structural review', () => {
  const result = evaluateOutput(
    {
      id: 'good-structural-review',
      must_include: ['Must fix', 'Can defer', 'idempotency', 'live telemetry'],
      must_not_include: ['grep is enough'],
      required_patterns: ['owner|expiry'],
    },
    `## Must fix
Parse at the server boundary, add idempotency for retries, and prove retirement with live telemetry rather than repo search.

## Can defer
Dashboard polish can wait if the operational artifact has an owner and expiry.`,
  )

  assert.equal(result.passed, true)
  assert.deepEqual(result.failures, [])
})
