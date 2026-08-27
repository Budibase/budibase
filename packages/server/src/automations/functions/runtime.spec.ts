import { FunctionErrorCode } from "@budibase/types"
import type {
  FunctionCapabilityHandler,
  FunctionRunRequest,
} from "@budibase/types"
import { executeFunctionInIsolate as executeRuntime } from "./internal-runtime"
import { FUNCTION_RUN_REQUEST_FIXTURE } from "./testFixtures"

const request = (compiledJavaScript: string, runId = "isolate-run") => ({
  ...FUNCTION_RUN_REQUEST_FIXTURE,
  runId,
  artifact: {
    ...FUNCTION_RUN_REQUEST_FIXTURE.artifact,
    compiledJavaScript,
  },
})

const noQueries = async () => {
  throw new Error("Unexpected query")
}

const executeFunctionInIsolate = (
  runRequest: FunctionRunRequest,
  invokeCapability: FunctionCapabilityHandler
) =>
  executeRuntime(runRequest, {
    signal: new AbortController().signal,
    invokeCapability,
  })

describe("Functions isolate", () => {
  it("runs a compiled artifact with copied inputs and an awaited query", async () => {
    const queryHandler = jest.fn(async () => ({ rows: [{ id: "row-1" }] }))
    const result = await executeFunctionInIsolate(
      request(`
        const inputs = globalThis.__budibaseInputs
        const query = globalThis.__budibaseInvokeQuery
        export default async function run() {
          const response = await query("capability-1", { id: inputs.message })
          return { output: { input: inputs.message, response } }
        }
      `),
      queryHandler
    )

    expect(result).toMatchObject({
      status: "success",
      output: {
        input: "hello",
        response: { rows: [{ id: "row-1" }] },
      },
      metrics: { queryCount: 1 },
    })
    expect(queryHandler).toHaveBeenCalledWith({
      runId: "isolate-run",
      capabilityId: "capability-1",
      parameters: { id: "hello" },
      signal: expect.any(AbortSignal),
    })
  })

  it("rejects queries to capabilities absent from the artifact", async () => {
    const queryHandler = jest.fn(async () => ({}))
    const result = await executeFunctionInIsolate(
      request(`
        export default async function run() {
          try {
            await globalThis.__budibaseInvokeQuery("undeclared", {})
          } catch {}
          return { output: { bypassed: true } }
        }
      `),
      queryHandler
    )

    expect(result).toMatchObject({
      status: "error",
      metrics: { queryCount: 0 },
      error: {
        code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
        message: "Function query denied",
      },
    })
    expect(result.output).toBeUndefined()
    expect(queryHandler).not.toHaveBeenCalled()
  })

  it("does not expose Node or network globals", async () => {
    const result = await executeFunctionInIsolate(
      request(`
        export default async function run() {
          return {
            output: {
              process: typeof process,
              require: typeof require,
              fetch: typeof fetch,
              Buffer: typeof Buffer,
            },
          }
        }
      `),
      noQueries
    )

    expect(result.output).toEqual({
      process: "undefined",
      require: "undefined",
      fetch: "undefined",
      Buffer: "undefined",
    })
  })

  it("exposes only frozen SDK values without raw isolate handles", async () => {
    const result = await executeFunctionInIsolate(
      request(`
        export default async function run() {
          return {
            output: {
              inputsFrozen: Object.isFrozen(globalThis.__budibaseInputs),
              nestedInputFrozen: Object.isFrozen(globalThis.__budibaseInputs.nested),
              queryFrozen: Object.isFrozen(globalThis.__budibaseInvokeQuery),
              inputHandle: typeof globalThis.__budibaseInputsValue,
              capabilityHandle:
                typeof globalThis.__budibaseInvokeCapabilityReference,
              lexicalCapabilityHandle: typeof capabilityReference,
              bootstrapHelper: typeof deepFreeze,
            },
          }
        }
      `),
      noQueries
    )

    expect(result.output).toEqual({
      inputsFrozen: true,
      nestedInputFrozen: true,
      queryFrozen: true,
      inputHandle: "undefined",
      capabilityHandle: "undefined",
      lexicalCapabilityHandle: "undefined",
      bootstrapHelper: "undefined",
    })
  })

  it("rejects dynamic access to Node modules", async () => {
    const result = await executeFunctionInIsolate(
      request(`
        export default async function run() {
          await import("node:fs")
          return { output: {} }
        }
      `),
      noQueries
    )

    expect(result).toMatchObject({
      status: "error",
      error: { code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR },
    })
  })

  it.each([
    [
      "cyclic",
      `const output = {}; output.self = output; return { output }`,
      FUNCTION_RUN_REQUEST_FIXTURE.limits.maxOutputDepth,
    ],
    ["invalid", `return { output: { value: undefined } }`, 30],
    ["deep", `return { output: { one: { two: { three: true } } } }`, 2],
  ])("rejects %s output", async (_name, body, maxOutputDepth) => {
    const runRequest = request(`
      export default async function run() {
        ${body}
      }
    `)
    runRequest.limits = { ...runRequest.limits, maxOutputDepth }

    const result = await executeFunctionInIsolate(runRequest, noQueries)

    expect(result).toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_OUTPUT_INVALID,
        message: "Function output is invalid",
      },
    })
  })

  it("rejects output over the byte limit", async () => {
    const runRequest = request(`
      export default async function run() {
        return { output: { value: "too large" } }
      }
    `)
    runRequest.limits = { ...runRequest.limits, maxOutputBytes: 10 }

    await expect(
      executeFunctionInIsolate(runRequest, noQueries)
    ).resolves.toMatchObject({
      status: "error",
      error: { code: FunctionErrorCode.FUNCTION_OUTPUT_INVALID },
    })
  })

  it.each([
    ["before await", `while (true) {}`],
    ["after await", `await Promise.resolve(); while (true) {}`],
    ["unresolved promise", `await new Promise(() => {})`],
  ])("times out an infinite run %s", async (_name, body) => {
    const runRequest = request(`
      export default async function run() {
        ${body}
        return { output: {} }
      }
    `)
    runRequest.limits = { ...runRequest.limits, timeoutMs: 20 }

    await expect(
      executeFunctionInIsolate(runRequest, noQueries)
    ).resolves.toMatchObject({
      status: "error",
      error: { code: FunctionErrorCode.FUNCTION_TIMEOUT },
    })
  })

  it("returns a stable error under isolate memory pressure", async () => {
    const runRequest = request(`
      export default async function run() {
        const values = []
        while (true) {
          values.push(new Array(100000).fill("memory pressure"))
        }
      }
    `)
    runRequest.limits = {
      ...runRequest.limits,
      isolateMemoryLimitMb: 8,
      timeoutMs: 2_000,
    }

    await expect(
      executeFunctionInIsolate(runRequest, noQueries)
    ).resolves.toMatchObject({
      status: "error",
      error: { code: FunctionErrorCode.FUNCTION_MEMORY_LIMIT },
    })
  })

  it("enforces the total query count", async () => {
    const runRequest = request(`
      export default async function run() {
        await globalThis.__budibaseInvokeQuery("first", {})
        await globalThis.__budibaseInvokeQuery("second", {})
        return { output: {} }
      }
    `)
    runRequest.limits = { ...runRequest.limits, maxQueryCalls: 1 }

    await expect(
      executeFunctionInIsolate(
        runRequest,
        () => new Promise(resolve => setTimeout(() => resolve({}), 10))
      )
    ).resolves.toMatchObject({
      status: "error",
      metrics: { queryCount: 1 },
      error: { code: FunctionErrorCode.FUNCTION_QUERY_LIMIT },
    })
  })

  it("enforces concurrent query calls", async () => {
    const runRequest = request(`
      export default async function run() {
        await Promise.all([
          globalThis.__budibaseInvokeQuery("first", {}),
          globalThis.__budibaseInvokeQuery("second", {}),
        ])
        return { output: {} }
      }
    `)
    runRequest.limits = {
      ...runRequest.limits,
      maxConcurrentQueryCalls: 1,
    }

    await expect(
      executeFunctionInIsolate(
        runRequest,
        () => new Promise(resolve => setTimeout(() => resolve({}), 10))
      )
    ).resolves.toMatchObject({
      status: "error",
      metrics: { queryCount: 1 },
      error: { code: FunctionErrorCode.FUNCTION_QUERY_LIMIT },
    })
  })

  it.each([
    [
      "total",
      `
        await query("first", {})
        try {
          await query("second", {})
        } catch {}
      `,
      { maxQueryCalls: 1 },
    ],
    [
      "concurrent",
      `
        try {
          await Promise.all([query("first", {}), query("second", {})])
        } catch {}
      `,
      { maxConcurrentQueryCalls: 1 },
    ],
  ])("keeps a caught %s query limit terminal", async (_name, body, limits) => {
    const runRequest = request(`
      export default async function run() {
        const query = globalThis.__budibaseInvokeQuery
        ${body}
        return { output: { caught: true } }
      }
    `)
    runRequest.limits = { ...runRequest.limits, ...limits }

    await expect(
      executeFunctionInIsolate(
        runRequest,
        () => new Promise(resolve => setTimeout(() => resolve({}), 10))
      )
    ).resolves.toMatchObject({
      status: "error",
      error: { code: FunctionErrorCode.FUNCTION_QUERY_LIMIT },
    })
  })

  it("rejects oversized query results", async () => {
    const runRequest = request(`
      export default async function run() {
        await globalThis.__budibaseInvokeQuery("query", {})
        return { output: {} }
      }
    `)
    runRequest.limits = { ...runRequest.limits, maxQueryResponseBytes: 10 }

    await expect(
      executeFunctionInIsolate(runRequest, async () => ({
        value: "too large",
      }))
    ).resolves.toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
        message: "Function query denied",
      },
    })
  })

  it("discards output when the function catches an invalid query response", async () => {
    const runRequest = request(`
      export default async function run() {
        try {
          await globalThis.__budibaseInvokeQuery("query", {})
        } catch {}
        return { output: { caught: true } }
      }
    `)

    const result = await executeFunctionInIsolate(
      runRequest,
      async () => Number.NaN
    )

    expect(result).toMatchObject({
      status: "error",
      metrics: { queryCount: 1 },
      error: {
        code: FunctionErrorCode.FUNCTION_QUERY_DENIED,
        message: "Function query denied",
      },
    })
    expect(result.output).toBeUndefined()
  })

  it("preserves __proto__ keys in output", async () => {
    const result = await executeFunctionInIsolate(
      request(`
        export default async function run() {
          return { output: JSON.parse('{"__proto__":{"safe":true}}') }
        }
      `),
      noQueries
    )

    expect(result).toMatchObject({
      status: "success",
      output: JSON.parse('{"__proto__":{"safe":true}}'),
    })
  })

  it("provides a frozen no-op console", async () => {
    const result = await executeFunctionInIsolate(
      request(`
      export default async function run() {
        console.log("abcdef")
        console.warn("ééé")
        console.error("ignored")
        return {
          output: {
            consoleFrozen: Object.isFrozen(console),
            logFrozen: Object.isFrozen(console.log),
          },
        }
      }
    `),
      noQueries
    )

    expect(result).toMatchObject({
      status: "success",
      output: {
        consoleFrozen: true,
        logFrozen: true,
      },
      metrics: { logBytes: 0 },
    })
    expect(result.logs).toBeUndefined()
  })

  it("does not retain globals between invocations", async () => {
    const compiledJavaScript = `
      globalThis.invocationCount = (globalThis.invocationCount || 0) + 1
      export default async function run() {
        return {
          output: {
            invocationCount: globalThis.invocationCount,
            input: globalThis.__budibaseInputs.message,
          },
        }
      }
    `

    const first = await executeFunctionInIsolate(
      request(compiledJavaScript, "isolate-first"),
      noQueries
    )
    const secondRequest = request(compiledJavaScript, "isolate-second")
    secondRequest.inputs = { ...secondRequest.inputs, message: "second" }
    const second = await executeFunctionInIsolate(secondRequest, noQueries)

    expect(first.output).toEqual({ invocationCount: 1, input: "hello" })
    expect(second.output).toEqual({ invocationCount: 1, input: "second" })
  })
})
