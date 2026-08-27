import { LocalFunctionRunSupervisor } from "@budibase/functions-runtime"
import { functionExecutor } from "./executor"

export {
  createFunctionInvocationScope,
  FunctionCapabilityError,
  FunctionCapabilityService,
} from "./capabilities"
export type {
  FunctionCapabilityExecution,
  FunctionCapabilityRecord,
  FunctionInvocationScope,
  FunctionInvocationScopeInput,
} from "./capabilities"
export { functionExecutor, LocalFunctionExecutor } from "./executor"
export { LocalFunctionRunSupervisor } from "@budibase/functions-runtime"

export const functionRunSupervisor = new LocalFunctionRunSupervisor({
  executor: functionExecutor,
})
