import type {
  FunctionCapabilityHandler,
  FunctionRunRequest,
  FunctionRunResult,
} from "@budibase/types"
import { startFunctionInIsolate } from "@budibase/functions-runtime"

export interface InternalFunctionRuntimeContext {
  signal: AbortSignal
  invokeCapability: FunctionCapabilityHandler
}

export const executeFunctionInIsolate = async (
  request: FunctionRunRequest,
  runtimeContext: InternalFunctionRuntimeContext
): Promise<FunctionRunResult> => {
  let terminationRequested = false
  const execution = startFunctionInIsolate(request, {
    invokeCapability: runtimeContext.invokeCapability,
  })
  const terminate = () => {
    if (terminationRequested) {
      return
    }
    terminationRequested = true
    execution.terminate()
  }

  runtimeContext.signal.addEventListener("abort", terminate, { once: true })
  if (runtimeContext.signal.aborted) {
    terminate()
  }
  try {
    return await execution.result
  } finally {
    runtimeContext.signal.removeEventListener("abort", terminate)
  }
}
