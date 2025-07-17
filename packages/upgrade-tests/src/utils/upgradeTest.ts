import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import { JSONValue } from "../types"
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
  const testName = `${state.testPath}/${state.currentTestName}`
  const name = crypto.createHash("md5").update(testName).digest("hex")
  return `/tmp/upgrade-context-${name}.json`
}

function saveContext(data: JSONValue): void {
  fs.writeFileSync(contextFileName(), JSON.stringify(data, null, 2))
}

function loadContext(): JSONValue {
  const fileName = contextFileName()
  if (!fs.existsSync(fileName)) {
    throw new Error(`Context file not found: ${fileName}`)
  }
  const content = fs.readFileSync(fileName, "utf-8")
  return JSON.parse(content)
}

export interface UpgradeTestOptions<T extends JSONValue> {
  app?: string
  pre?: () => T | Promise<T>
  post?: (context: T) => void | Promise<void>
}

export function it<T extends JSONValue>(
  testName: string,
  options: UpgradeTestOptions<T>
): void {
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
    jestIt.skip(testName, () => {})
  }
}

it.only = function <T extends JSONValue>(
  testName: string,
  options: UpgradeTestOptions<T>
): void {
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

it.skip = function <T extends JSONValue>(
  testName: string,
  _options: UpgradeTestOptions<T>
): void {
  jestIt.skip(testName, () => {})
}

export function cleanupTestContexts(): void {
  const contextFiles = fs
    .readdirSync(process.cwd())
    .filter(
      file => file.startsWith(".upgrade-context-") && file.endsWith(".json")
    )

  contextFiles.forEach(file => {
    try {
      fs.unlinkSync(path.join(process.cwd(), file))
    } catch (error) {
      console.error(`Failed to clean up context file ${file}:`, error)
    }
  })
}
