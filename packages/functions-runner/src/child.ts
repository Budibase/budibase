import { FunctionErrorCode } from "@budibase/types"
import type { FunctionRunResult } from "@budibase/types"
import { validateFunctionRunRequest } from "./protocol"

let handledRequest = false

const sendResult = (result: FunctionRunResult) => {
  if (!process.send) {
    process.exit(1)
    return
  }
  process.send(result, undefined, undefined, error =>
    process.exit(error ? 1 : 0)
  )
}

process.on("message", (value: unknown) => {
  try {
    if (handledRequest) {
      process.exit(1)
      return
    }
    handledRequest = true
    const request = validateFunctionRunRequest(value)
    sendResult({
      runId: request.runId,
      status: "error",
      metrics: {
        durationMs: 0,
        queryCount: 0,
        outputBytes: 0,
        logBytes: 0,
      },
      error: {
        code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
        message: "Function execution is not implemented",
      },
    })
  } catch {
    process.exit(1)
  }
})

process.on("disconnect", () => {
  if (!handledRequest) {
    process.exit(1)
  }
})
