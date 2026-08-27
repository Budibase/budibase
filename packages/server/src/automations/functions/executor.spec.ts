import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionCapabilityHandler,
  FunctionRunRequest,
  JSONValue,
} from "@budibase/types"
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

const context = (
  invokeCapability: FunctionCapabilityHandler,
  signal = new AbortController().signal
) => ({
  signal,
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

  it("stops execution and aborts capabilities when cancelled", async () => {
    const executor = new LocalFunctionExecutor()
    const abortController = new AbortController()
    let markStarted = () => {}
    const capabilityStarted = new Promise<void>(resolve => {
      markStarted = resolve
    })
    const invokeCapability: FunctionCapabilityHandler = request => {
      markStarted()
      return new Promise((_resolve, reject) => {
        request.signal.addEventListener("abort", () => reject(new Error()))
      })
    }

    const result = executor.execute(
      request(`
        export default async function run() {
          await globalThis.__budibaseInvokeQuery("capability-1", {})
          return { output: {} }
        }
      `),
      context(invokeCapability, abortController.signal)
    )
    await capabilityStarted
    abortController.abort()

    await expect(result).resolves.toMatchObject({ status: "stopped" })
  })

  it("terminates an active run by ID", async () => {
    const executor = new LocalFunctionExecutor()
    let markStarted = () => {}
    const capabilityStarted = new Promise<void>(resolve => {
      markStarted = resolve
    })
    const invokeCapability: FunctionCapabilityHandler = request => {
      markStarted()
      return new Promise((_resolve, reject) => {
        request.signal.addEventListener("abort", () => reject(new Error()))
      })
    }

    const result = executor.execute(
      request(
        `
        export default async function run() {
          await globalThis.__budibaseInvokeQuery("capability-1", {})
          return { output: {} }
        }
      `,
        "terminated-run"
      ),
      context(invokeCapability)
    )
    await capabilityStarted
    await executor.terminate("terminated-run")

    await expect(result).resolves.toMatchObject({ status: "stopped" })
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
})
