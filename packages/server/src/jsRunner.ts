import vm from "vm"
import ivm from "isolated-vm"
import env from "./environment"
import { setJSRunner } from "@budibase/string-templates"
import { context, timers } from "@budibase/backend-core"
import tracer from "dd-trace"

type TrackerFn = <T>(f: () => T) => T

export function init() {
  setJSRunner((js: string, ctx: vm.Context) => {
    return tracer.trace("runJS", {}, span => {
      const perRequestLimit = env.JS_PER_REQUEST_TIME_LIMIT_MS
      let track: TrackerFn = f => f()
      if (perRequestLimit) {
        const bbCtx = context.getCurrentContext()
        if (bbCtx) {
          if (!bbCtx.jsExecutionTracker) {
            bbCtx.jsExecutionTracker =
              timers.ExecutionTimeTracker.withLimit(perRequestLimit)
          }
          span?.addTags({
            js: {
              limitMS: bbCtx.jsExecutionTracker.limitMs,
              elapsedMS: bbCtx.jsExecutionTracker.elapsedMS,
            },
          })
          // We call checkLimit() here to prevent paying the cost of creating
          // a new VM context below when we don't need to.
          bbCtx.jsExecutionTracker.checkLimit()
          track = bbCtx.jsExecutionTracker.track.bind(bbCtx.jsExecutionTracker)
        }
      }

      const isolate = new ivm.Isolate({ memoryLimit: 64 })
      const vm = isolate.createContextSync()
      const jail = vm.global
      jail.setSync("global", jail.derefInto())

      for (let key in ctx) {
        let value
        if (["alert", "setInterval", "setTimeout"].includes(key)) {
          value = undefined
        } else {
          value = ctx[key]
        }
        jail.setSync(
          key,
          new ivm.ExternalCopy(value).copyInto({ release: true })
        )
      }

      const script = isolate.compileScriptSync(js)

      return track(() => {
        return script.runSync(vm, {
          timeout: env.JS_PER_EXECUTION_TIME_LIMIT_MS,
        })
      })
    })
  })
}
