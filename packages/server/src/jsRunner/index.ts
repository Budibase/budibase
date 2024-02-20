import { serializeError } from "serialize-error"
import env from "../environment"
import {
  JsErrorTimeout,
  setJSRunner,
  setOnErrorLog,
} from "@budibase/string-templates"
import { context, logging } from "@budibase/backend-core"
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

        if (!bbCtx.vm) {
          bbCtx.vm = new IsolatedVM({
            memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
            invocationTimeout: env.JS_PER_INVOCATION_TIMEOUT_MS,
            isolateAccumulatedTimeout: env.JS_PER_REQUEST_TIMEOUT_MS,
          }).withHelpers()
        }
        const { helpers, ...rest } = ctx
        return bbCtx.vm.withContext(rest, () => bbCtx.vm!.execute(js))
      } catch (error: any) {
        if (error.message === "Script execution timed out.") {
          throw new JsErrorTimeout()
        }
        throw error
      }
    })
  })

  if (env.LOG_JS_ERRORS) {
    setOnErrorLog((error: Error) => {
      logging.logWarn(
        `Error while executing js: ${JSON.stringify(serializeError(error))}`
      )
    })
  }
}
