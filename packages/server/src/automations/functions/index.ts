import { FunctionRunSupervisor } from "@budibase/functions-runtime"
import { functionExecutor } from "./executor"

export {
  createFunctionInvocationScope,
  FunctionCapabilityError,
  FunctionCapabilityService,
} from "./capabilities"
export type {
  FunctionCapabilityExecution,
  FunctionCapabilityLog,
  FunctionInvocationScope,
  FunctionInvocationScopeInput,
} from "./capabilities"
export { functionExecutor, LocalFunctionExecutor } from "./executor"
export { FunctionRunSupervisor } from "@budibase/functions-runtime"

export const functionRunSupervisor = new FunctionRunSupervisor({
  executor: functionExecutor,
})
