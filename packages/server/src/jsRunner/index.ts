import { serializeError } from "serialize-error"
import env from "../environment"
import {
  JsErrorTimeout,
  setJSRunner,
  setOnErrorLog,
} from "@budibase/string-templates"
import { context, logging } from "@budibase/backend-core"
import tracer from "dd-trace"

import { IsolatedVM } from "./vm"
import type { VM } from "@budibase/types"

export function init() {
  setJSRunner((js: string, ctx: Record<string, any>) => {
    return tracer.trace("runJS", {}, span => {
      try {
        const bbCtx = context.getCurrentContext()

        let vm: VM
        if (bbCtx && bbCtx.vm) {
          vm = bbCtx.vm
        } else {
          vm = new IsolatedVM({
            memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
            invocationTimeout: env.JS_PER_INVOCATION_TIMEOUT_MS,
            isolateAccumulatedTimeout: env.JS_PER_REQUEST_TIMEOUT_MS,
          }).withHelpers()
        }

        if (bbCtx && !bbCtx.vm) {
          bbCtx.vm = vm
          bbCtx.cleanup = bbCtx.cleanup || []
          bbCtx.cleanup.push(() => vm.close())
        }

        // Because we can't pass functions into an Isolate, we remove them from
        // the passed context and rely on the withHelpers() method to add them
        // back in.
        const { helpers, ...rest } = ctx
        return vm.withContext(rest, () => vm.execute(js))
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
