import { FunctionErrorCode } from "@budibase/types"

const ERROR_MESSAGES: Partial<Record<FunctionErrorCode, string>> = {
  [FunctionErrorCode.FUNCTIONS_DISABLED]: "Functions are disabled",
  [FunctionErrorCode.FUNCTION_BUILD_REQUIRED]:
    "The Function must be built before it can run",
  [FunctionErrorCode.FUNCTION_BUILD_FAILED]:
    "The Function's latest build failed",
  [FunctionErrorCode.FUNCTION_MEMORY_LIMIT]:
    "The Function exceeded its memory limit",
  [FunctionErrorCode.FUNCTION_OUTPUT_INVALID]:
    "The Function returned invalid output",
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
  [FunctionErrorCode.FUNCTION_ORCHESTRATOR_INTERRUPTED]:
    "The Function run was interrupted",
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
