import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionCapabilityHandler,
  FunctionRunRequest,
  JSONValue,
} from "@budibase/types"
import env from "../../environment"
import { LocalFunctionExecutor } from "./executor"
import { FUNCTION_RUN_REQUEST_FIXTURE } from "./testFixtures"

const request = (
  compiledJavaScript: string,
  runId = "executor-run"
): FunctionRunRequest => ({
  ...FUNCTION_RUN_REQUEST_FIXTURE,
  runId,
  artifact: {
    ...FUNCTION_RUN_REQUEST_FIXTURE.artifact,
    compiledJavaScript,
  },
})

const context = (invokeCapability: FunctionCapabilityHandler) => ({
  invokeCapability,
})

const noCapabilities = async () => {
  throw new Error("Unexpected capability")
}

describe("LocalFunctionExecutor", () => {
  it("reports a healthy local executor", async () => {
    await expect(new LocalFunctionExecutor().health()).resolves.toEqual({
      healthy: true,
    })
  })

  it("uses the configured service concurrency limit by default", async () => {
    const configuredMaxConcurrentRuns =
      env.FUNCTIONS_LIMITS.service.maxConcurrentRuns
    env.FUNCTIONS_LIMITS.service.maxConcurrentRuns = 1

    try {
      const executor = new LocalFunctionExecutor()
      let releaseCapability = (_value: JSONValue) => {}
      let markStarted = () => {}
      const capabilityStarted = new Promise<void>(resolve => {
        markStarted = resolve
      })
      const capabilityResult = new Promise<JSONValue>(resolve => {
        releaseCapability = resolve
      })
      const invokeCapability = async () => {
        markStarted()
        return capabilityResult
      }
      const compiledJavaScript = `
        export default async function run() {
          await globalThis.__budibaseInvokeQuery("capability-1", {})
          return { output: {} }
        }
      `
      const firstRun = executor.execute(
        request(compiledJavaScript, "first-configured-run"),
        context(invokeCapability)
      )
      await capabilityStarted

      await expect(
        executor.execute(
          request(compiledJavaScript, "second-configured-run"),
          context(invokeCapability)
        )
      ).resolves.toMatchObject({
        status: "error",
        error: { code: FunctionErrorCode.FUNCTION_EXECUTOR_BUSY },
      })

      releaseCapability({})
      await expect(firstRun).resolves.toMatchObject({ status: "success" })
    } finally {
      env.FUNCTIONS_LIMITS.service.maxConcurrentRuns =
        configuredMaxConcurrentRuns
    }
  })

  it("runs a Function with a direct capability callback", async () => {
    const invokeCapability = jest.fn(async () => ({ id: "row-1" }))
    const executor = new LocalFunctionExecutor()

    const result = await executor.execute(
      request(`
        export default async function run() {
          const row = await globalThis.__budibaseInvokeQuery(
            "capability-1",
            { id: "row-1" }
          )
          return { output: { row } }
        }
      `),
      context(invokeCapability)
    )

    expect(result).toMatchObject({
      status: "success",
      output: { row: { id: "row-1" } },
      metrics: { queryCount: 1 },
    })
    expect(invokeCapability).toHaveBeenCalledWith({
      runId: "executor-run",
      capabilityId: "capability-1",
      parameters: { id: "row-1" },
      signal: expect.any(AbortSignal),
    })
  })

  it("returns busy when per-worker admission is full", async () => {
    const executor = new LocalFunctionExecutor({ maxConcurrentRuns: 1 })
    let releaseCapability = (_value: JSONValue) => {}
    let markStarted = () => {}
    const capabilityStarted = new Promise<void>(resolve => {
      markStarted = resolve
    })
    const capabilityResult = new Promise<JSONValue>(resolve => {
      releaseCapability = resolve
    })
    const invokeCapability = async () => {
      markStarted()
      return capabilityResult
    }
    const compiledJavaScript = `
      export default async function run() {
        await globalThis.__budibaseInvokeQuery("capability-1", {})
        return { output: {} }
      }
    `

    const firstRun = executor.execute(
      request(compiledJavaScript, "first-run"),
      context(invokeCapability)
    )
    await capabilityStarted

    const secondRun = await executor.execute(
      request(compiledJavaScript, "second-run"),
      context(invokeCapability)
    )

    expect(secondRun).toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_EXECUTOR_BUSY,
        message: "Function executor is busy",
      },
    })

    releaseCapability({})
    await expect(firstRun).resolves.toMatchObject({ status: "success" })
  })

  it("terminates only the requested active run", async () => {
    const executor = new LocalFunctionExecutor()
    const startedRuns = new Set<string>()
    let markBothStarted = () => {}
    const bothStarted = new Promise<void>(resolve => {
      markBothStarted = resolve
    })
    const capabilityResolvers = new Map<string, (value: JSONValue) => void>()
    const invokeCapability: FunctionCapabilityHandler = capabilityRequest => {
      startedRuns.add(capabilityRequest.runId)
      if (startedRuns.size === 2) {
        markBothStarted()
      }
      return new Promise((resolve, reject) => {
        capabilityResolvers.set(capabilityRequest.runId, resolve)
        capabilityRequest.signal.addEventListener("abort", () =>
          reject(new Error())
        )
      })
    }
    const compiledJavaScript = `
        export default async function run() {
          await globalThis.__budibaseInvokeQuery("capability-1", {})
          return { output: {} }
        }
      `

    const terminatedRun = executor.execute(
      request(compiledJavaScript, "terminated-run"),
      context(invokeCapability)
    )
    const activeRun = executor.execute(
      request(compiledJavaScript, "active-run"),
      context(invokeCapability)
    )
    await bothStarted
    await executor.terminate("terminated-run")
    capabilityResolvers.get("active-run")?.({})

    await expect(terminatedRun).resolves.toMatchObject({
      status: "error",
      error: { code: FunctionErrorCode.FUNCTION_MEMORY_LIMIT },
    })
    await expect(activeRun).resolves.toMatchObject({ status: "success" })
  })

  it("rejects oversized inputs before creating an isolate", async () => {
    const executor = new LocalFunctionExecutor()
    const runRequest = request(`
      export default async function run() {
        return { output: {} }
      }
    `)
    runRequest.inputs = { value: "too large" }
    runRequest.limits = { ...runRequest.limits, maxInputBytes: 10 }

    await expect(
      executor.execute(runRequest, context(noCapabilities))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function input is invalid",
      },
    })
  })

  it("returns invalid input when validation throws an unexpected error", async () => {
    const circularInputs: Record<string, JSONValue> = {}
    circularInputs.self = circularInputs
    const runRequest = request(`
      export default async function run() {
        return { output: {} }
      }
    `)
    runRequest.inputs = circularInputs
    runRequest.limits = {
      ...runRequest.limits,
      maxInputDepth: Number.MAX_SAFE_INTEGER,
    }

    await expect(
      new LocalFunctionExecutor().execute(runRequest, context(noCapabilities))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function input is invalid",
      },
    })
  })
})
