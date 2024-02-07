import env from "../environment"
import { setJSRunner, JsErrorTimeout } from "@budibase/string-templates"
import tracer from "dd-trace"

import { IsolatedVM } from "./vm"
import { context } from "@budibase/backend-core"

class ExecutionTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ExecutionTimeoutError"
  }
}

export function init() {
  setJSRunner((js: string, ctx: Record<string, any>) => {
    return tracer.trace("runJS", {}, span => {
      try {
        const bbCtx = context.getCurrentContext()!

        let { vm } = bbCtx
        if (!vm) {
          vm = new IsolatedVM({
            memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
            timeout: env.JS_PER_EXECUTION_TIME_LIMIT_MS,
          }).withHelpers()

          bbCtx.vm = vm
        }

        const perRequestLimit = env.JS_PER_REQUEST_TIME_LIMIT_MS
        if (perRequestLimit) {
          const cpuMs = Number(vm.cpuTime) / 1e6
          if (cpuMs > perRequestLimit) {
            throw new ExecutionTimeoutError(
              `CPU time limit exceeded (${cpuMs}ms > ${perRequestLimit}ms)`
            )
          }
        }

        const result = vm.execute(js)

        return result
      } catch (error: any) {
        if (error.message === "Script execution timed out.") {
          throw new JsErrorTimeout()
        }

        throw error
      }
    })
  })
}
