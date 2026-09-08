import { LocalFunctionRunSupervisor } from "@budibase/functions-runtime"
import { functionExecutor } from "./executor"

export { LocalFunctionRunSupervisor } from "@budibase/functions-runtime"

export const functionRunSupervisor = new LocalFunctionRunSupervisor({
  executor: functionExecutor,
})
