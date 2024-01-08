import vm from "vm"
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
        tracer.trace<any>("runJS.setupTracker", {}, span => {
          const bbCtx = context.getCurrentContext()
          if (bbCtx) {
            if (!bbCtx.jsExecutionTracker) {
              span?.addTags({
                createdExecutionTracker: true,
              })
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
            track = bbCtx.jsExecutionTracker.track.bind(
              bbCtx.jsExecutionTracker
            )
          }
        })
      }

      ctx = tracer.trace("runJS.ctxClone", {}, span => {
        return {
          ...ctx,
          alert: undefined,
          setInterval: undefined,
          setTimeout: undefined,
        }
      })

      tracer.trace("runJS.vm.createContext", {}, span => {
        vm.createContext(ctx)
      })

      return track(() =>
        tracer.trace("runJS.vm.runInNewContext", {}, span =>
          vm.runInNewContext(js, ctx, {
            timeout: env.JS_PER_EXECUTION_TIME_LIMIT_MS,
          })
        )
      )
    })
  })
}
