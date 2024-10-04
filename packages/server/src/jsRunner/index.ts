import { serializeError } from "serialize-error"
import env from "../environment"
import {
  JsTimeoutError,
  setJSRunner,
  setOnErrorLog,
} from "@budibase/string-templates"
import { context, logging } from "@budibase/backend-core"
import tracer from "dd-trace"
import { IsolatedVM } from "./vm"

export function init() {
  setJSRunner((js: string, ctx: Record<string, any>) => {
    return tracer.trace("runJS", {}, () => {
      try {
        // Reuse an existing isolate from context, or make a new one
        const bbCtx = context.getCurrentContext()
        const vm =
          bbCtx?.vm ||
          new IsolatedVM({
            memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
            invocationTimeout: env.JS_PER_INVOCATION_TIMEOUT_MS,
            isolateAccumulatedTimeout: env.JS_PER_REQUEST_TIMEOUT_MS,
          })
            .withHelpers()
            .withBuffer()
            .withSnippets(bbCtx?.snippets)

        // Persist isolate in context so we can reuse it
        if (bbCtx && !bbCtx.vm) {
          bbCtx.vm = vm
          bbCtx.cleanup = bbCtx.cleanup || []
          bbCtx.cleanup.push(() => vm.close())
        }

        // Because we can't pass functions into an Isolate, we remove them from
        // the passed context and rely on the withHelpers() method to add them
        // back in.
        const { helpers, snippets, ...rest } = ctx
        return vm.withContext(rest, () => vm.execute(js))
      } catch (error: any) {
        if (error.message === "Script execution timed out.") {
          throw new JsTimeoutError()
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
