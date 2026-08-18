import {
  FunctionErrorCode,
} from "@budibase/types"
import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FUNCTION_RUN_RESULT_FIXTURE,
} from "./testFixtures"
import {
  FunctionProtocolError,
  parseFunctionRunRequest,
  parseFunctionRunResult,
  validateFunctionRunResult,
} from "./protocol"

const expectProtocolError = (callback: () => void, message: string) => {
  try {
    callback()
    throw new Error("Expected protocol validation to fail")
  } catch (error) {
    expect(error).toBeInstanceOf(FunctionProtocolError)
    expect(error).toMatchObject({
      code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
      message,
    })
  }
}

describe("Functions runner protocol", () => {
  let protocolLogger: jest.SpyInstance

  beforeEach(() => {
    protocolLogger = jest.spyOn(console, "error").mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("round-trips a valid request", () => {
    expect(
      parseFunctionRunRequest(JSON.stringify(FUNCTION_RUN_REQUEST_FIXTURE))
    ).toEqual(FUNCTION_RUN_REQUEST_FIXTURE)
  })

  it("round-trips a valid result", () => {
    expect(
      parseFunctionRunResult(JSON.stringify(FUNCTION_RUN_RESULT_FIXTURE))
    ).toEqual(FUNCTION_RUN_RESULT_FIXTURE)
  })

  it("rejects malformed requests without exposing their contents", () => {
    const secret = "do-not-expose-this-token"

    expectProtocolError(
      () =>
        parseFunctionRunRequest(
          JSON.stringify({
            ...FUNCTION_RUN_REQUEST_FIXTURE,
            grantToken: secret,
            limits: { timeoutMs: "invalid" },
          })
        ),
      "Malformed Function run request"
    )
  })

  it("logs validation details without logging the invalid value", () => {
    const invalidValue = {
      ...FUNCTION_RUN_RESULT_FIXTURE,
      metrics: { durationMs: -1 },
    }

    expectProtocolError(
      () => validateFunctionRunResult(invalidValue),
      "Malformed Function run result"
    )
    expect(protocolLogger).toHaveBeenCalledWith(
      "Function protocol validation failed",
      expect.objectContaining({ issues: expect.any(Array) })
    )
    expect(protocolLogger).not.toHaveBeenCalledWith(
      "Function protocol validation failed",
      invalidValue
    )
  })

  it("rejects malformed results with a stable error", () => {
    expectProtocolError(
      () =>
        parseFunctionRunResult(
          JSON.stringify({
            ...FUNCTION_RUN_RESULT_FIXTURE,
            metrics: { durationMs: -1 },
          })
        ),
      "Malformed Function run result"
    )
  })

  it.each([
    ["durationMs", Number.NaN],
    ["durationMs", Number.POSITIVE_INFINITY],
    ["queryCount", Number.NaN],
    ["queryCount", Number.POSITIVE_INFINITY],
    ["queryCount", 1.5],
    ["outputBytes", Number.NaN],
    ["outputBytes", Number.POSITIVE_INFINITY],
    ["outputBytes", 1.5],
    ["logBytes", Number.NaN],
    ["logBytes", Number.POSITIVE_INFINITY],
    ["logBytes", 1.5],
  ])("rejects invalid metric values: %s=%s", (metric, value) => {
    expectProtocolError(
      () =>
        validateFunctionRunResult({
          ...FUNCTION_RUN_RESULT_FIXTURE,
          metrics: {
            ...FUNCTION_RUN_RESULT_FIXTURE.metrics,
            [metric]: value,
          },
        }),
      "Malformed Function run result"
    )
  })

  it("rejects invalid JSON with a stable error", () => {
    expectProtocolError(
      () => parseFunctionRunRequest("{invalid"),
      "Malformed Function run request"
    )
  })
})
