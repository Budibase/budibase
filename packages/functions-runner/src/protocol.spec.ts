import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FUNCTION_RUN_RESULT_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import {
  FunctionProtocolError,
  parseFunctionRunRequest,
  parseFunctionRunResult,
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

  it("rejects invalid JSON with a stable error", () => {
    expectProtocolError(
      () => parseFunctionRunRequest("{invalid"),
      "Malformed Function run request"
    )
  })
})
