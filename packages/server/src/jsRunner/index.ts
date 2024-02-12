import env from "../environment"
import { setJSRunner, JsErrorTimeout } from "@budibase/string-templates"
import tracer from "dd-trace"

import { IsolatedVM } from "./vm"
import { context } from "@budibase/backend-core"

export function init() {
  setJSRunner((js: string, ctx: Record<string, any>) => {
    return tracer.trace("runJS", {}, span => {
      try {
        const bbCtx = context.getCurrentContext()!

        let { vm } = bbCtx
        if (!vm) {
          // Can't copy the native helpers into the isolate. We just ignore them as they are handled properly from the helpersSource
          const { helpers, ...ctxToPass } = ctx

          vm = new IsolatedVM({
            memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
            invocationTimeout: env.JS_PER_INVOCATION_TIMEOUT_MS,
            isolateAccumulatedTimeout: env.JS_PER_REQUEST_TIMEOUT_MS,
          })
            .withContext(ctxToPass)
            .withHelpers()

          bbCtx.vm = vm
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
