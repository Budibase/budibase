import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FUNCTION_RUN_RESULT_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import { FunctionExecutionError } from "../errors"
import { LocalRunnerFunctionExecutor } from "./localRunner"

describe("LocalRunnerFunctionExecutor", () => {
  const baseUrl = "https://example.com"
  let fetch: jest.MockedFunction<typeof globalThis.fetch>

  beforeEach(() => {
    fetch = jest.fn()
  })

  const jsonResponse = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "content-type": "application/json",
      },
    })

  it("reports compatible runner health", async () => {
    fetch.mockResolvedValue(
      jsonResponse({
        healthy: true,
      })
    )

    await expect(
      new LocalRunnerFunctionExecutor({ baseUrl, fetch }).health()
    ).resolves.toEqual({
      healthy: true,
    })
  })

  it("reports an unhealthy response", async () => {
    fetch.mockResolvedValue(
      jsonResponse({
        healthy: false,
      })
    )

    await expect(
      new LocalRunnerFunctionExecutor({ baseUrl, fetch }).health()
    ).resolves.toEqual({
      healthy: false,
    })
  })

  it("round-trips a validated execution envelope", async () => {
    fetch.mockResolvedValue(jsonResponse(FUNCTION_RUN_RESULT_FIXTURE))

    await expect(
      new LocalRunnerFunctionExecutor({ baseUrl, fetch }).execute(
        FUNCTION_RUN_REQUEST_FIXTURE
      )
    ).resolves.toEqual(FUNCTION_RUN_RESULT_FIXTURE)

    const [url, init] = fetch.mock.calls[0]
    expect(url.toString()).toBe("https://example.com/runs")
    expect(init?.method).toBe("POST")
    expect(JSON.parse(String(init?.body))).toEqual(FUNCTION_RUN_REQUEST_FIXTURE)
  })

  it.each([
    [429, FunctionErrorCode.FUNCTION_RUNNER_BUSY],
    [503, FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE],
    [400, FunctionErrorCode.FUNCTION_PROTOCOL_ERROR],
  ])("maps runner status %s to %s", async (status, code) => {
    fetch.mockResolvedValue(new Response("internal runner detail", { status }))

    await expect(
      new LocalRunnerFunctionExecutor({ baseUrl, fetch }).execute(
        FUNCTION_RUN_REQUEST_FIXTURE
      )
    ).rejects.toMatchObject({
      code,
    })
  })

  it("rejects malformed results without exposing their contents", async () => {
    const secret = "do-not-expose-this-token"
    fetch.mockResolvedValue(
      jsonResponse({
        runId: FUNCTION_RUN_REQUEST_FIXTURE.runId,
        secret,
      })
    )

    try {
      await new LocalRunnerFunctionExecutor({ baseUrl, fetch }).execute(
        FUNCTION_RUN_REQUEST_FIXTURE
      )
      throw new Error("Expected the request to fail")
    } catch (error) {
      expect(error).toBeInstanceOf(FunctionExecutionError)
      expect(error).toMatchObject({
        code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
      })
      expect(String(error)).not.toContain(secret)
      expect(String(error)).not.toContain(
        FUNCTION_RUN_REQUEST_FIXTURE.grantToken
      )
    }
  })

  it("cancels the runner after the execution deadline", async () => {
    fetch
      .mockImplementationOnce((_input, init) => {
        const body = new ReadableStream<Uint8Array>({
          start(controller) {
            init?.signal?.addEventListener("abort", () => {
              controller.error(new DOMException("Aborted", "AbortError"))
            })
          },
        })
        return Promise.resolve(
          new Response(body, {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          })
        )
      })
      .mockResolvedValueOnce(new Response(null, { status: 204 }))

    await expect(
      new LocalRunnerFunctionExecutor({ baseUrl, fetch }).execute({
        ...FUNCTION_RUN_REQUEST_FIXTURE,
        limits: {
          ...FUNCTION_RUN_REQUEST_FIXTURE.limits,
          timeoutMs: 20,
        },
      })
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_TIMEOUT,
    })

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch.mock.calls[1][0].toString()).toBe(
      `https://example.com/runs/${FUNCTION_RUN_REQUEST_FIXTURE.runId}`
    )
    expect(fetch.mock.calls[1][1]?.method).toBe("DELETE")
  })

  it("fails fast when no runner is configured", async () => {
    await expect(
      new LocalRunnerFunctionExecutor({ baseUrl: "", fetch }).execute(
        FUNCTION_RUN_REQUEST_FIXTURE
      )
    ).rejects.toMatchObject({
      code: FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
    })
  })
})
