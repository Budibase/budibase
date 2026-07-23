import { FunctionErrorCode } from "@budibase/types"

const ERROR_MESSAGES: Partial<Record<FunctionErrorCode, string>> = {
  [FunctionErrorCode.FUNCTION_RUNNER_BUSY]:
    "The Function runner is at capacity",
  [FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE]:
    "The Function runner is unavailable",
  [FunctionErrorCode.FUNCTION_TIMEOUT]: "The Function run timed out",
  [FunctionErrorCode.FUNCTION_QUERY_DENIED]:
    "The Function query request was denied",
  [FunctionErrorCode.FUNCTION_QUERY_LIMIT]:
    "The Function query request exceeded a limit",
  [FunctionErrorCode.FUNCTION_RUNTIME_ERROR]: "The Function query failed",
  [FunctionErrorCode.FUNCTION_PROTOCOL_ERROR]:
    "The Function runner returned an invalid response",
}

export class FunctionExecutionError extends Error {
  constructor(
    readonly code: FunctionErrorCode,
    message = ERROR_MESSAGES[code] || "The Function run failed"
  ) {
    super(message)
    this.name = "FunctionExecutionError"
  }
}
