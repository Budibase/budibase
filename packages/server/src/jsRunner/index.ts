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
import { App, DocumentType, Snippet, VM } from "@budibase/types"

async function getIsolate(ctx: any): Promise<VM> {
  // Reuse the existing isolate if one exists
  if (ctx?.vm) {
    return ctx.vm
  }

  // Get snippets to build into new isolate, if inside app context
  let snippets: Snippet[] | undefined
  const db = context.getAppDB()
  if (db) {
    console.log("READ APP METADATA")
    const app = await db.get<App>(DocumentType.APP_METADATA)
    snippets = app.snippets
  }

  // Build a new isolate
  return new IsolatedVM({
    memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
    invocationTimeout: env.JS_PER_INVOCATION_TIMEOUT_MS,
    isolateAccumulatedTimeout: env.JS_PER_REQUEST_TIMEOUT_MS,
  })
    .withHelpers()
    .withSnippets(snippets)
}

export function init() {
  setJSRunner((js: string, ctx: Record<string, any>) => {
    return tracer.trace("runJS", {}, async span => {
      try {
        // Reuse an existing isolate from context, or make a new one
        const bbCtx = context.getCurrentContext()
        const vm = await getIsolate(bbCtx)
        if (bbCtx) {
          bbCtx.vm = vm
        }

        // Strip helpers (an array) and snippets (a proxy isntance) as these
        // will not survive the isolated-vm barrier
        const { helpers, snippets, ...rest } = ctx
        return vm.withContext(rest, () => vm!.execute(js))
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
