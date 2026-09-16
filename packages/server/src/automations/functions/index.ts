import { FunctionRunSupervisor } from "@budibase/functions-runtime"
import { functionExecutor } from "./executor"

export { functionExecutor, LocalFunctionExecutor } from "./executor"
export { FunctionRunSupervisor } from "@budibase/functions-runtime"

export const functionRunSupervisor = new FunctionRunSupervisor({
  executor: functionExecutor,
})
