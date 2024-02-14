import vm from "vm"
import env from "../environment"
import { setJSRunner, setOnErrorLog } from "@budibase/string-templates"
import { context, logging, timers } from "@budibase/backend-core"
import tracer from "dd-trace"
import { serializeError } from "serialize-error"

type TrackerFn = <T>(f: () => T) => T

export function init() {
  setJSRunner((js: string, ctx: vm.Context) => {
    return tracer.trace("runJS", {}, span => {
      const perRequestLimit = env.JS_PER_REQUEST_TIMEOUT_MS
      let track: TrackerFn = f => f()
      if (perRequestLimit) {
        const bbCtx = tracer.trace("runJS.getCurrentContext", {}, span =>
          context.getCurrentContext()
        )
        if (bbCtx) {
          if (!bbCtx.jsExecutionTracker) {
            span?.addTags({
              createdExecutionTracker: true,
            })
            bbCtx.jsExecutionTracker = tracer.trace(
              "runJS.createExecutionTimeTracker",
              {},
              span => timers.ExecutionTimeTracker.withLimit(perRequestLimit)
            )
          }
          span?.addTags({
            js: {
              limitMS: bbCtx.jsExecutionTracker.limitMs,
              elapsedMS: bbCtx.jsExecutionTracker.elapsedMS,
            },
          })
          // We call checkLimit() here to prevent paying the cost of creating
          // a new VM context below when we don't need to.
          tracer.trace("runJS.checkLimitAndBind", {}, span => {
            bbCtx.jsExecutionTracker!.checkLimit()
            track = bbCtx.jsExecutionTracker!.track.bind(
              bbCtx.jsExecutionTracker
            )
          })
        }
      }

      ctx = {
        ...ctx,
        alert: undefined,
        setInterval: undefined,
        setTimeout: undefined,
      }

      vm.createContext(ctx)
      return track(() =>
        vm.runInNewContext(js, ctx, {
          timeout: env.JS_PER_INVOCATION_TIMEOUT_MS,
        })
      )
    })
  })

  if (env.LOG_JS_ERRORS) {
    setOnErrorLog((error: Error) => {
      logging.logWarn(JSON.stringify(serializeError(error)))
    })
  }
}
