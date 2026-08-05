import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import { executeFunctionInIsolate } from "./isolatedVmRuntime"
import {
  FunctionQueryBrokerError,
  createFunctionQueryBroker,
} from "./queryBroker"

const queryRequest = (extra: Record<string, unknown> = {}) => ({
  runId: "run-query",
  grantToken: "grant-secret",
  capabilityId: "cap_customers",
  parameters: { status: "active" },
  signal: new AbortController().signal,
  ...extra,
})

describe("Function query broker transport", () => {
  it("connects isolated Data and API Explorer queries to the broker", async () => {
    const brokerResults = [
      { data: { rows: [{ id: "row-1" }] } },
      { data: { status: 200, body: { accepted: true } } },
    ]
    const request = jest.fn(
      async (
        _input: Parameters<typeof fetch>[0],
        _options?: Parameters<typeof fetch>[1]
      ) => new Response(JSON.stringify(brokerResults.shift()))
    )
    const queryHandler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: request,
    })

    const result = await executeFunctionInIsolate(
      {
        ...FUNCTION_RUN_REQUEST_FIXTURE,
        artifact: {
          ...FUNCTION_RUN_REQUEST_FIXTURE.artifact,
          compiledJavaScript: `
            export default async function run() {
              const data = await globalThis.__budibaseInvokeQuery(
                "cap_data",
                { status: "active" }
              )
              const api = await globalThis.__budibaseInvokeQuery(
                "cap_api",
                { customerId: "row-1" }
              )
              return { output: { data, api } }
            }
          `,
        },
      },
      queryHandler
    )

    expect(result).toMatchObject({
      status: "success",
      output: {
        data: { rows: [{ id: "row-1" }] },
        api: { status: 200, body: { accepted: true } },
      },
      metrics: { queryCount: 2 },
    })
    expect(request).toHaveBeenCalledTimes(2)
    expect(
      request.mock.calls.map(call => JSON.parse(String(call[1]?.body)))
    ).toEqual([
      {
        runId: FUNCTION_RUN_REQUEST_FIXTURE.runId,
        grantToken: FUNCTION_RUN_REQUEST_FIXTURE.grantToken,
        capabilityId: "cap_data",
        parameters: { status: "active" },
      },
      {
        runId: FUNCTION_RUN_REQUEST_FIXTURE.runId,
        grantToken: FUNCTION_RUN_REQUEST_FIXTURE.grantToken,
        capabilityId: "cap_api",
        parameters: { customerId: "row-1" },
      },
    ])
  })

  it.each([
    ["Data", { rows: [{ id: "row-1" }] }],
    ["API Explorer", { status: 200, body: { accepted: true } }],
  ])("returns only the %s saved query data", async (_type, data) => {
    const request = jest.fn(
      async (
        _input: Parameters<typeof fetch>[0],
        _options?: Parameters<typeof fetch>[1]
      ) =>
        new Response(JSON.stringify({ data }), {
          headers: { "content-type": "application/json" },
          status: 200,
        })
    )
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com:4001",
      fetch: request,
    })

    await expect(handler(queryRequest())).resolves.toEqual(data)
    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith(
      "http://example.com:4001/api/internal/functions/query",
      expect.objectContaining({
        method: "POST",
        redirect: "error",
        signal: expect.any(AbortSignal),
      })
    )
    const options = request.mock.calls[0][1]
    expect(JSON.parse(String(options?.body))).toEqual({
      runId: "run-query",
      grantToken: "grant-secret",
      capabilityId: "cap_customers",
      parameters: { status: "active" },
    })
    expect(String(options?.body)).not.toContain("query_customers")
  })

  it.each([
    [403, "denied"],
    [429, "limit"],
    [500, "unavailable"],
  ] as const)("sanitizes a %s broker response", async (status, failure) => {
    const request = jest.fn(async () =>
      Promise.resolve(
        new Response(JSON.stringify({ error: "upstream-secret" }), { status })
      )
    )
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: request,
    })

    await expect(handler(queryRequest())).rejects.toEqual(
      new FunctionQueryBrokerError(failure)
    )
    expect(request).toHaveBeenCalledTimes(1)
  })

  it.each([
    ["malformed JSON", "not-json"],
    ["an invalid envelope", JSON.stringify({ result: { rows: [] } })],
    ["an envelope with extra fields", JSON.stringify({ data: [], secret: 1 })],
  ])("rejects %s", async (_name, body) => {
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: async () => new Response(body),
    })

    await expect(handler(queryRequest())).rejects.toEqual(
      new FunctionQueryBrokerError("invalid_response")
    )
  })

  it("rejects an oversized response envelope", async () => {
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: async () =>
        new Response(JSON.stringify({ data: "response-secret" })),
      maxResponseBytes: 10,
    })

    await expect(handler(queryRequest())).rejects.toEqual(
      new FunctionQueryBrokerError("invalid_response")
    )
  })

  it("sanitizes network failures without retrying", async () => {
    const request = jest.fn(async () => {
      throw new Error("host-secret")
    })
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: request,
    })

    await expect(handler(queryRequest())).rejects.toEqual(
      new FunctionQueryBrokerError("unavailable")
    )
    expect(request).toHaveBeenCalledTimes(1)
  })

  it("does not expose broker details in the Function result", async () => {
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: async () => {
        throw new Error("host-secret")
      },
    })

    const result = await executeFunctionInIsolate(
      {
        ...FUNCTION_RUN_REQUEST_FIXTURE,
        artifact: {
          ...FUNCTION_RUN_REQUEST_FIXTURE.artifact,
          compiledJavaScript: `
            export default async function run() {
              await globalThis.__budibaseInvokeQuery("cap_secret", {
                password: "parameter-secret"
              })
              return { output: {} }
            }
          `,
        },
      },
      handler
    )

    expect(result).toMatchObject({
      status: "error",
      error: {
        code: FunctionErrorCode.FUNCTION_QUERY_ERROR,
        message: "Function query failed",
      },
    })
    expect(JSON.stringify(result)).not.toContain("host-secret")
    expect(JSON.stringify(result)).not.toContain("parameter-secret")
    expect(JSON.stringify(result)).not.toContain(
      FUNCTION_RUN_REQUEST_FIXTURE.grantToken
    )
  })

  it("passes cancellation to the broker request", async () => {
    const runAbortController = new AbortController()
    const request = jest.fn(
      async (_url: string | URL | Request, options?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          options?.signal?.addEventListener("abort", () => {
            reject(new DOMException("request-secret", "AbortError"))
          })
        })
    )
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: request,
    })

    const result = handler(queryRequest({ signal: runAbortController.signal }))
    runAbortController.abort()

    await expect(result).rejects.toEqual(
      new FunctionQueryBrokerError("cancelled")
    )
    expect(request.mock.calls[0][1]?.signal?.aborted).toBe(true)
  })

  it("times out a broker request", async () => {
    const request = jest.fn(
      async (_url: string | URL | Request, options?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          options?.signal?.addEventListener("abort", () => {
            reject(new DOMException("request-secret", "AbortError"))
          })
        })
    )
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: request,
      timeoutMs: 1,
    })

    await expect(handler(queryRequest())).rejects.toEqual(
      new FunctionQueryBrokerError("timeout")
    )
    expect(request).toHaveBeenCalledTimes(1)
  })

  it("rejects non-string parameters before making a request", async () => {
    const request = jest.fn()
    const handler = createFunctionQueryBroker({
      baseUrl: "http://example.com",
      fetch: request,
    })

    await expect(
      handler(queryRequest({ parameters: { status: { unsafe: true } } }))
    ).rejects.toEqual(new FunctionQueryBrokerError("denied"))
    expect(request).not.toHaveBeenCalled()
  })
})
