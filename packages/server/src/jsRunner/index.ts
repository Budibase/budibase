import env from "../environment"
import { JsErrorTimeout, setJSRunner } from "@budibase/string-templates"
import { context } from "@budibase/backend-core"
import tracer from "dd-trace"
import { BuiltInVM, IsolatedVM } from "./vm"

const USE_ISOLATED_VM = true

export function init() {
  setJSRunner((js: string, ctx: Record<string, any>) => {
    return tracer.trace("runJS", {}, span => {
      if (!USE_ISOLATED_VM) {
        const vm = new BuiltInVM(ctx, span)
        return vm.execute(js)
      }

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
        return vm.execute(js)
      } catch (error: any) {
        if (error.message === "Script execution timed out.") {
          throw new JsErrorTimeout()
        }
        throw error
      }
    })
  })
}
