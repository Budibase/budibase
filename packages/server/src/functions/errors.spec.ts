import { FunctionErrorCode } from "@budibase/types"
import { FunctionExecutionError } from "./errors"

describe("FunctionExecutionError", () => {
  it("identifies Function query failures", () => {
    expect(
      new FunctionExecutionError(FunctionErrorCode.FUNCTION_QUERY_ERROR)
    ).toMatchObject({
      code: FunctionErrorCode.FUNCTION_QUERY_ERROR,
      message: "The Function query failed",
    })
  })
})
