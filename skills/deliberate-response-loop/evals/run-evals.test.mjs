import assert from 'node:assert/strict'
import { test } from 'node:test'

import { evaluateOutput } from './run-evals.mjs'

test('triggered cases require the deliberate response loop headers', () => {
  const result = evaluateOutput(
    {
      id: 'missing-loop',
      should_trigger: true,
      must_include: [],
      must_not_include: [],
    },
    'This answer skips the required structure.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /See clearly/i)
  assert.match(result.failures.join('\n'), /Move decisively/i)
})

test('triggered cases pass when required and forbidden phrases are satisfied', () => {
  const result = evaluateOutput(
    {
      id: 'good-output',
      should_trigger: true,
      must_include: ['smallest next move'],
      must_not_include: ['just be confident'],
    },
    `See clearly:
Visible situation: the task feels too large.

Choose deliberately:
Desired outcome: create one piece of evidence.

Speak precisely:
"This needs to be shrunk until starting is safe enough."

Move decisively:
Smallest next move: work for 10 minutes with a clear stop point.`,
  )

  assert.equal(result.passed, true)
  assert.deepEqual(result.failures, [])
})

test('non-triggered cases fail when loop headers appear', () => {
  const result = evaluateOutput(
    {
      id: 'over-triggered',
      should_trigger: false,
      must_include: [],
      must_not_include: [],
    },
    `See clearly:
The capital of Germany is Berlin.

Move decisively:
Use Berlin as the answer.`,
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /should not trigger/i)
})
