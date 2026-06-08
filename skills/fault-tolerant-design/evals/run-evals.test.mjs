import assert from 'node:assert/strict'
import { test } from 'node:test'

import { evaluateOutput } from './run-evals.mjs'

test('requires required reliability concepts when expected', () => {
  const result = evaluateOutput(
    {
      id: 'missing-reliability-concepts',
      must_include: ['Critical path', 'last known good config', 'control-plane failure'],
      must_not_include: [],
      required_patterns: ['Static stability|Last known good'],
    },
    'Cache config locally.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /Critical path/)
  assert.match(result.failures.join('\n'), /last known good config/)
  assert.match(result.failures.join('\n'), /control-plane failure/)
})

test('fails unsafe retry-only recommendations', () => {
  const result = evaluateOutput(
    {
      id: 'unsafe-retry-only',
      must_include: ['bounded retries', 'dead-letter'],
      must_not_include: ['retry forever', 'retries alone provide fault tolerance'],
    },
    'Retry forever because retries alone provide fault tolerance.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /bounded retries/)
  assert.match(result.failures.join('\n'), /dead-letter/)
  assert.match(result.failures.join('\n'), /retry forever/)
  assert.match(result.failures.join('\n'), /retries alone provide fault tolerance/)
})

test('passes a concise fault-tolerant design review', () => {
  const result = evaluateOutput(
    {
      id: 'good-review',
      must_include: ['Critical path', 'bounded retries', 'last known good state'],
      must_not_include: ['retry forever'],
      required_patterns: ['Progressive delivery|Blast-radius'],
    },
    `## Critical path
Record ingestion must continue when optional enrichment is down.

## Static stability
Keep the last known good state with a freshness timestamp.

## Recovery practice
Use bounded retries and a dead-letter queue for replay-safe failures.

## Progressive delivery
Roll out by low-risk queue partition first to limit blast-radius.`,
  )

  assert.equal(result.passed, true)
  assert.deepEqual(result.failures, [])
})
