import type {
  FunctionCapabilityHandler,
  FunctionRunRequest,
  FunctionRunResult,
} from "@budibase/types"
import { executeFunctionInIsolate } from "@budibase/functions-runtime"

export interface InternalFunctionRuntimeContext {
  signal: AbortSignal
  invokeCapability: FunctionCapabilityHandler
}

export const executeInternalFunctionInIsolate = (
  request: FunctionRunRequest,
  runtimeContext: InternalFunctionRuntimeContext
): Promise<FunctionRunResult> =>
  executeFunctionInIsolate(request, {
    invokeCapability: runtimeContext.invokeCapability,
    registerTermination: terminateRuntime => {
      let terminationRequested = false
      const terminate = () => {
        if (terminationRequested) {
          return
        }
        terminationRequested = true
        terminateRuntime()
      }

      runtimeContext.signal.addEventListener("abort", terminate, { once: true })
      if (runtimeContext.signal.aborted) {
        terminate()
      }
      return () => runtimeContext.signal.removeEventListener("abort", terminate)
    },
  })
