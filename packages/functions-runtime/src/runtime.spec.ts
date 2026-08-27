import type {
  FunctionCapabilityHandler,
  FunctionRunRequest,
} from "@budibase/types"
import { executeFunctionInIsolate } from "./runtime"

const request = (compiledJavaScript: string): FunctionRunRequest => ({
  runId: "runtime-run",
  artifact: {
    compiledJavaScript,
    capabilityIds: ["capability-1"],
    sourceMap: "{}",
    sourceHash: "source-hash",
    declarationsHash: "declarations-hash",
    compiledAt: "2026-01-01T00:00:00.000Z",
  },
  inputs: { message: "hello" },
  limits: {
    maxInputBytes: 256 * 1024,
    maxInputDepth: 20,
    isolateMemoryLimitMb: 64,
    timeoutMs: 30_000,
    maxQueryCalls: 10,
    maxConcurrentQueryCalls: 2,
    maxQueryResponseBytes: 1024 * 1024,
    maxQueryResponseDepth: 30,
    maxOutputBytes: 1024 * 1024,
    maxOutputDepth: 30,
    maxLogEntries: 100,
    maxLogBytes: 64 * 1024,
    maxLogEntryBytes: 4 * 1024,
  },
})

const execute = (
  runRequest: FunctionRunRequest,
  invokeCapability: FunctionCapabilityHandler
) => executeFunctionInIsolate(runRequest, { invokeCapability })

describe("Function runtime", () => {
  it("runs with an injected capability handler", async () => {
    const invokeCapability = jest.fn(async () => ({ id: "row-1" }))

    await expect(
      execute(
        request(`
          export default async function run() {
            const row = await globalThis.__budibaseInvokeQuery(
              "capability-1",
              {}
            )
            return { output: { row } }
          }
        `),
        invokeCapability
      )
    ).resolves.toMatchObject({
      status: "success",
      output: { row: { id: "row-1" } },
    })
  })

  it("registers termination for a host that owns the isolate", async () => {
    const invokeCapability: FunctionCapabilityHandler = request => {
      return new Promise((_resolve, reject) => {
        request.signal.addEventListener("abort", () => reject(new Error()))
      })
    }
    const abortController = new AbortController()

    const result = executeFunctionInIsolate(
      request(`
        export default async function run() {
          await globalThis.__budibaseInvokeQuery("capability-1", {})
          return { output: {} }
        }
      `),
      {
        invokeCapability,
        registerTermination: terminate => {
          abortController.signal.addEventListener("abort", terminate, {
            once: true,
          })
          if (abortController.signal.aborted) {
            terminate()
          }
          return () =>
            abortController.signal.removeEventListener("abort", terminate)
        },
      }
    )
    abortController.abort()

    await expect(result).resolves.toMatchObject({
      runId: "runtime-run",
    })
  })
})
