import * as fs from "fs"
import * as crypto from "crypto"
import * as semver from "semver"
import { execSync } from "child_process"
import { isPreUpgradePhase, isPostUpgradePhase } from "./testHelpers"
import { expect, it as jestIt } from "@jest/globals"

function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === "function"
}

function contextFileName(): string {
  const state = expect.getState()
  if (!state.currentTestName) {
    throw new Error("Current test name is not set in Jest state")
  }
  if (!state.testPath) {
    throw new Error("Test path is not set in Jest state")
  }

  if (!process.env.TEST_APP_NAME) {
    throw new Error("TEST_APP_NAME environment variable is not set")
  }

  const appName = process.env.TEST_APP_NAME
  const testName = `${state.testPath}/${state.currentTestName}/${appName}`
  const name = crypto.createHash("md5").update(testName).digest("hex")
  return `/tmp/upgrade-context-${name}.json`
}

function saveContext(data: any): void {
  fs.writeFileSync(contextFileName(), JSON.stringify(data, null, 2))
}

function loadContext(): any {
  const fileName = contextFileName()
  if (!fs.existsSync(fileName)) {
    throw new Error(`Context file not found: ${fileName}`)
  }
  const content = fs.readFileSync(fileName, "utf-8")
  return JSON.parse(content)
}

export interface UpgradeTestOptions<T> {
  app?: string
  pre?: () => T | Promise<T>
  post?: (context: T) => void | Promise<void>
}

export interface EachUpgradeTestOptions<V, T> {
  app?: string
  pre?: (value: V) => T | Promise<T>
  post?: (value: V, context: T) => void | Promise<void>
}

export function it<T>(testName: string, options: UpgradeTestOptions<T>): void {
  const { app, pre, post } = options

  // Check if we should skip based on app filter
  const currentApp = process.env.TEST_APP
  if (app && currentApp && currentApp !== app) {
    jestIt.skip(testName, () => {})
    return
  }

  if (isPreUpgradePhase() && pre) {
    jestIt(testName, async () => {
      let result = pre()
      if (isPromise(result)) {
        result = await result
      }
      saveContext(result)
    })
  } else if (isPostUpgradePhase() && post) {
    jestIt(testName, async () => {
      const context = loadContext() as T
      const result = post(context)
      if (isPromise(result)) {
        await result
      }
    })
  } else {
    throw new Error(
      `Invalid test phase for ${testName}. Expected pre or post upgrade phase.`
    )
  }
}

it.only = function <T>(testName: string, options: UpgradeTestOptions<T>): void {
  const { app, pre, post } = options

  // Check if we should skip based on app filter
  const currentApp = process.env.TEST_APP
  if (app && currentApp && currentApp !== app) {
    jestIt.skip(testName, () => {})
    return
  }

  if (isPreUpgradePhase() && pre) {
    jestIt.only(testName, async () => {
      let result = pre()
      if (isPromise(result)) {
        result = await result
      }
      saveContext(result)
    })
  } else if (isPostUpgradePhase() && post) {
    jestIt.only(testName, async () => {
      const context = loadContext() as T
      let result = post(context)
      if (isPromise(result)) {
        await result
      }
    })
  } else {
    jestIt.skip(testName, () => {})
  }
}

it.skip = function <T>(
  testName: string,
  _options: UpgradeTestOptions<T>
): void {
  jestIt.skip(testName, () => {})
}

it.each = function <V>(values: V[]) {
  return <T>(name: string, options: EachUpgradeTestOptions<V, T>) => {
    const { pre, post } = options

    jestIt.each(values)(name, async (value: V) => {
      // Check if we should skip based on app filter
      const currentApp = process.env.TEST_APP
      if (options.app && currentApp && currentApp !== options.app) {
        jestIt.skip(name, () => {})
        return
      }

      if (isPreUpgradePhase() && pre) {
        let result = pre(value)
        if (isPromise(result)) {
          result = await result
        }
        saveContext(result)
      } else if (isPostUpgradePhase() && post) {
        const context = loadContext() as T
        let result = post(value, context)
        if (isPromise(result)) {
          await result
        }
      } else {
        throw new Error(
          `Invalid test phase for ${name}. Expected pre or post upgrade phase.`
        )
      }
    })
  }
}

/**
 * A utility function to create a Jest test that ensures a value does not change
 * between pre and post upgrade phases.
 *
 * @param testName this allows the same format specifiers (e.g. %s) as Jest's `it.each`
 * @param f a function that returns a Promise resolving to the value to be tested
 */
export function shouldNotChange(testName: string, f: () => Promise<any>): void {
  it(testName, {
    pre: async () => {
      const value = await f()
      return { initialValue: value }
    },
    post: async ({ initialValue }) => {
      const currentValue = await f()
      expect(currentValue).toEqual(initialValue)
    },
  })
}

shouldNotChange.only = function (
  testName: string,
  f: () => Promise<any>
): void {
  it.only(testName, {
    pre: async () => {
      const value = await f()
      return { initialValue: value }
    },
    post: async ({ initialValue }) => {
      const currentValue = await f()
      expect(currentValue).toEqual(initialValue)
    },
  })
}

shouldNotChange.skip = function (
  testName: string,
  _f: () => Promise<any>
): void {
  jestIt.skip(testName, () => {})
}

shouldNotChange.each = function <V, T>(values: V[]) {
  return (name: string, f: (value: V) => Promise<T>) => {
    it.each(values)(name, {
      pre: async value => {
        const initialValue = await f(value)
        return { initialValue }
      },
      post: async (value, { initialValue }) => {
        const currentValue = await f(value)
        expect(currentValue).toEqual(initialValue)
      },
    })
  }
}

let toVersion: string | undefined
function getToVersion(): string {
  if (toVersion) {
    return toVersion
  }
  toVersion = process.env.TO_VERSION
  if (!toVersion) {
    throw new Error("TO_VERSION environment variable is not set")
  }
  if (toVersion === "current") {
    const tag = execSync(
      "git for-each-ref --sort=-creatordate --format '%(refname:short)' refs/tags | head -n 1"
    )
      .toString()
      .trim()

    if (!semver.valid(tag)) {
      throw new Error(`Latest tag is not a valid semver version: ${tag}`)
    }

    toVersion = tag
  }
  return toVersion
}

function getFromVersion(): string {
  const fromVersion = process.env.FROM_VERSION
  if (!fromVersion) {
    throw new Error("FROM_VERSION environment variable is not set")
  }
  return fromVersion
}

export function upgradeSpansVersion(version: string): boolean {
  const from = getFromVersion()
  const to = getToVersion()
  return semver.gte(from, version) && semver.lte(version, to)
}

function commitForTag(tag: string): string {
  const commit = execSync(`git rev-list -n 1 ${tag}`).toString().trim()
  if (!commit) {
    throw new Error(`No commit found for tag: ${tag}`)
  }
  return commit
}

function commandSucceeds(command: string): boolean {
  try {
    execSync(command, { stdio: "ignore" })
    return true
  } catch (error) {
    return false
  }
}

let latestCommitSha: string | undefined
function latestCommit(): string {
  if (latestCommitSha) {
    return latestCommitSha
  }
  latestCommitSha = execSync("git rev-parse HEAD").toString().trim()
  if (!latestCommitSha) {
    throw new Error("No latest commit found")
  }
  return latestCommitSha
}

export function upgradeSpansCommit(sha: string): boolean {
  const from = commitForTag(getFromVersion())

  let to = latestCommit()
  if (process.env.TO_VERSION !== "current") {
    to = commitForTag(getToVersion())
  }

  return commandSucceeds(`git rev-list ${from}..${to} | grep -q ${sha}`)
}
