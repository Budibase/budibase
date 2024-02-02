import ivm from "isolated-vm"
import env from "../environment"
import { setJSRunner, JsErrorTimeout } from "@budibase/string-templates"
import { context } from "@budibase/backend-core"
import tracer from "dd-trace"
import fs from "fs"
import url from "url"
import crypto from "crypto"
import querystring from "querystring"

const helpersSource = fs.readFileSync(
  `${require.resolve("@budibase/string-templates/index-helpers")}`,
  "utf8"
)

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

        const isolateRefs = bbCtx.isolateRefs
        if (!isolateRefs) {
          const jsIsolate = new ivm.Isolate({
            memoryLimit: env.JS_RUNNER_MEMORY_LIMIT,
          })
          const jsContext = jsIsolate.createContextSync()

          const injectedRequire = `const require = function(val){
        switch (val) {
          case "url": 
            return {
              resolve: (...params) => urlResolveCb(...params),
              parse: (...params) => urlParseCb(...params),
            }
          case "querystring":
            return {
              escape: (...params) => querystringEscapeCb(...params),
            }
        }
      };`

          const global = jsContext.global
          global.setSync(
            "urlResolveCb",
            new ivm.Callback((...params: Parameters<typeof url.resolve>) =>
              url.resolve(...params)
            )
          )

          global.setSync(
            "urlParseCb",
            new ivm.Callback((...params: Parameters<typeof url.parse>) =>
              url.parse(...params)
            )
          )

          global.setSync(
            "querystringEscapeCb",
            new ivm.Callback(
              (...params: Parameters<typeof querystring.escape>) =>
                querystring.escape(...params)
            )
          )

          global.setSync(
            "helpersStripProtocol",
            new ivm.Callback((str: string) => {
              var parsed = url.parse(str) as any
              parsed.protocol = ""
              return parsed.format()
            })
          )

          const helpersModule = jsIsolate.compileModuleSync(
            `${injectedRequire};${helpersSource}`
          )

          const cryptoModule = jsIsolate.compileModuleSync(`export default {
        randomUUID: cryptoRandomUUIDCb,
      }`)
          cryptoModule.instantiateSync(jsContext, specifier => {
            throw new Error(`No imports allowed. Required: ${specifier}`)
          })

          global.setSync(
            "cryptoRandomUUIDCb",
            new ivm.Callback(
              (...params: Parameters<typeof crypto.randomUUID>) => {
                return crypto.randomUUID(...params)
              }
            )
          )

          helpersModule.instantiateSync(jsContext, specifier => {
            if (specifier === "crypto") {
              return cryptoModule
            }
            throw new Error(`No imports allowed. Required: ${specifier}`)
          })

          for (const [key, value] of Object.entries(ctx)) {
            if (key === "helpers") {
              // Can't copy the native helpers into the isolate. We just ignore them as they are handled properly from the helpersSource
              continue
            }
            global.setSync(key, value)
          }

          bbCtx.isolateRefs = { jsContext, jsIsolate, helpersModule }
          if (!bbCtx.cleanup) {
            bbCtx.cleanup = []
          }
          bbCtx.cleanup.push(() => {
            helpersModule.release()
            jsContext.release()
            jsIsolate.dispose()
          })
        }

        let { jsIsolate, jsContext, helpersModule } = bbCtx.isolateRefs!

        const perRequestLimit = env.JS_PER_REQUEST_TIME_LIMIT_MS
        if (perRequestLimit) {
          const cpuMs = Number(jsIsolate.cpuTime) / 1e6
          if (cpuMs > perRequestLimit) {
            throw new ExecutionTimeoutError(
              `CPU time limit exceeded (${cpuMs}ms > ${perRequestLimit}ms)`
            )
          }
        }

        const script = jsIsolate.compileModuleSync(
          `import helpers from "compiled_module";const result=${js};cb(result)`,
          {}
        )

        script.instantiateSync(jsContext, specifier => {
          if (specifier === "compiled_module") {
            return helpersModule
          }

          throw new Error(`"${specifier}" import not allowed`)
        })

        let result
        jsContext.global.setSync(
          "cb",
          new ivm.Callback((value: any) => {
            result = value
          })
        )

        script.evaluateSync({
          timeout: env.JS_PER_EXECUTION_TIME_LIMIT_MS,
        })

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
