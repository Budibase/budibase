import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import { executeFunctionInIsolate } from "./isolatedVmRuntime"

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
      grantToken: FUNCTION_RUN_REQUEST_FIXTURE.grantToken,
      capabilityId: "capability-1",
      parameters: { id: "hello" },
    })
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
              queryHandle: typeof globalThis.__budibaseInvokeQueryReference,
              lexicalQueryHandle: typeof queryReference,
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
      queryHandle: "undefined",
      lexicalQueryHandle: "undefined",
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
