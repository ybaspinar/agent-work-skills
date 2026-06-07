#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const LOOP_HEADERS = ['See clearly', 'Choose deliberately', 'Speak precisely', 'Move decisively']

function normalize(value) {
  return String(value).toLowerCase()
}

function includesText(output, expected) {
  return normalize(output).includes(normalize(expected))
}

export function evaluateOutput(testCase, output) {
  const failures = []

  if (testCase.should_trigger) {
    for (const header of LOOP_HEADERS) {
      if (!includesText(output, header)) {
        failures.push(`Missing required loop header: ${header}`)
      }
    }
  } else {
    const presentHeaders = LOOP_HEADERS.filter((header) => includesText(output, header))
    if (presentHeaders.length > 0) {
      failures.push(
        `Case should not trigger the skill, but output included loop header(s): ${presentHeaders.join(', ')}`,
      )
    }
  }

  for (const expected of testCase.must_include ?? []) {
    if (!includesText(output, expected)) {
      failures.push(`Missing required text: ${expected}`)
    }
  }

  for (const forbidden of testCase.must_not_include ?? []) {
    if (includesText(output, forbidden)) {
      failures.push(`Included forbidden text: ${forbidden}`)
    }
  }

  for (const pattern of testCase.required_patterns ?? []) {
    const regex = new RegExp(pattern, 'i')
    if (!regex.test(output)) {
      failures.push(`Missing required pattern: ${pattern}`)
    }
  }

  return {
    id: testCase.id,
    passed: failures.length === 0,
    failures,
  }
}

export function loadCases(casesPath) {
  return JSON.parse(readFileSync(casesPath, 'utf8'))
}

export function evaluateCases({ casesPath, fixturesDir }) {
  const cases = loadCases(casesPath)

  return cases.map((testCase) => {
    const fixturePath = resolve(fixturesDir, testCase.fixture)
    if (!existsSync(fixturePath)) {
      return {
        id: testCase.id,
        passed: false,
        failures: [`Missing fixture: ${fixturePath}`],
      }
    }

    const output = readFileSync(fixturePath, 'utf8')
    return evaluateOutput(testCase, output)
  })
}

function printResults(results) {
  for (const result of results) {
    if (result.passed) {
      console.log(`✅ ${result.id}`)
      continue
    }

    console.log(`❌ ${result.id}`)
    for (const failure of result.failures) {
      console.log(`   - ${failure}`)
    }
  }

  const failed = results.filter((result) => !result.passed)
  console.log(`\n${results.length - failed.length}/${results.length} eval cases passed`)
  return failed.length === 0
}

function main() {
  const args = new Set(process.argv.slice(2))
  if (args.has('--live')) {
    console.error('Live eval mode is not wired yet. Run deterministic fixture evals without --live.')
    process.exit(2)
  }

  const evalDir = dirname(fileURLToPath(import.meta.url))
  const results = evaluateCases({
    casesPath: join(evalDir, 'cases.json'),
    fixturesDir: join(evalDir, 'fixtures'),
  })

  process.exit(printResults(results) ? 0 : 1)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
