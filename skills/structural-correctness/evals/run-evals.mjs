#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function normalize(value) {
  return String(value).toLowerCase()
}

function includesText(output, expected) {
  return normalize(output).includes(normalize(expected))
}

export function evaluateOutput(testCase, output) {
  const failures = []

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
  console.log(`\n${results.length - failed.length}/${results.length} structural-correctness eval cases passed`)
  return failed.length === 0
}

function main() {
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
