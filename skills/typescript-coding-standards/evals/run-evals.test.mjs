import assert from 'node:assert/strict'
import { test } from 'node:test'

import { evaluateOutput } from './run-evals.mjs'

test('requires parsing and typed errors for boundary changes', () => {
  const result = evaluateOutput(
    {
      id: 'missing-boundary-standards',
      must_include: ['parse the touched boundary', 'typed error', 'domain/refined type'],
      must_not_include: ['keep raw strings for consistency'],
      required_patterns: ['Result<|typed error'],
    },
    'Add displayName and keep raw strings for consistency.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /parse the touched boundary/)
  assert.match(result.failures.join('\n'), /typed error/)
  assert.match(result.failures.join('\n'), /domain\/refined type/)
  assert.match(result.failures.join('\n'), /keep raw strings for consistency/)
})

test('fails module-mock and non-null config shortcuts', () => {
  const result = evaluateOutput(
    {
      id: 'unsafe-test-config-shortcuts',
      must_include: ['real seam', 'parse config at startup'],
      must_not_include: ['keep module mocks', 'INVITE_SECRET!'],
    },
    'Keep module mocks and use INVITE_SECRET! to unblock release.',
  )

  assert.equal(result.passed, false)
  assert.match(result.failures.join('\n'), /real seam/)
  assert.match(result.failures.join('\n'), /parse config at startup/)
  assert.match(result.failures.join('\n'), /keep module mocks/)
  assert.match(result.failures.join('\n'), /INVITE_SECRET!/) 
})

test('passes concise TypeScript standards review', () => {
  const result = evaluateOutput(
    {
      id: 'good-review',
      must_include: ['parse the touched boundary', 'typed error', 'adapter reuse audit', 'real seam'],
      must_not_include: ['skip the audit'],
      required_patterns: ['narrow dependency type|UsersForPasswordReset'],
    },
    `Parse the touched boundary into domain/refined types and return a typed error such as Result<DisplayName, ParseDisplayNameError>. Translate at the existing framework boundary.

Run an adapter reuse audit before adding persistence. Inject a narrow dependency type like UsersForPasswordReset, and extend only if it fits the cohesive capability.

Replace the module mock with a real seam and fake email adapter so tests assert observable behavior.`,
  )

  assert.equal(result.passed, true)
  assert.deepEqual(result.failures, [])
})
