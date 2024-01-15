import ivm from "isolated-vm"
import env from "./environment"
import { setJSRunner } from "@budibase/string-templates"
import { context } from "@budibase/backend-core"
import tracer from "dd-trace"
import { readFileSync } from "fs"

const helpersSource = readFileSync(
  "node_modules/@budibase/string-templates/dist/bundle.mjs",
  "utf8"
)

export function init() {
  setJSRunner((js: string, ctx: Record<string, any>) => {
    return tracer.trace("runJS", {}, span => {
      const bbCtx = context.getCurrentContext()!
      if (!bbCtx.jsIsolate) {
        bbCtx.jsIsolate = new ivm.Isolate({ memoryLimit: 64 })
        bbCtx.jsContext = bbCtx.jsIsolate.createContextSync()
        const helpersModule = bbCtx.jsIsolate.compileModuleSync(helpersSource)
        helpersModule.instantiateSync(bbCtx.jsContext, () => {
          throw new Error("No imports allowed")
        })
      }

      const perRequestLimit = env.JS_PER_REQUEST_TIME_LIMIT_MS
      if (perRequestLimit) {
        const cpuMs = Number(bbCtx.jsIsolate.cpuTime) / 1e6
        if (cpuMs > perRequestLimit) {
          throw new Error(
            `CPU time limit exceeded (${cpuMs}ms > ${perRequestLimit}ms)`
          )
        }
      }

      const global = bbCtx.jsContext!.global
      for (const [key, value] of Object.entries(ctx)) {
        if (typeof value === "function") {
          // Can't copy functions into the isolate, so we just ignore them
          continue
        }
        global.setSync(key, new ivm.ExternalCopy(value).copyInto())
      }

      const script = bbCtx.jsIsolate.compileScriptSync(js)
      return script.runSync(bbCtx.jsContext!, {
        timeout: env.JS_PER_EXECUTION_TIME_LIMIT_MS,
      })
    })
  })
}
