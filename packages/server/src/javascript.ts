import vm from "vm"
import env from "./environment"
import { setJSRunner } from "@budibase/string-templates"
import { context, timers } from "@budibase/backend-core"

type TrackerFn = <T>(f: () => T) => T

export function init() {
  setJSRunner((js: string, ctx: vm.Context) => {
    const perRequestLimit = env.JS_PER_REQUEST_TIME_LIMIT_MS
    const bbCtx = context.getCurrentContext()
    let track: TrackerFn = f => f()
    if (perRequestLimit && bbCtx && !bbCtx.jsExecutionTracker) {
      bbCtx.jsExecutionTracker =
        timers.ExecutionTimeTracker.withLimit(perRequestLimit)
      track = bbCtx.jsExecutionTracker.track
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
        timeout: env.JS_PER_EXECUTION_TIME_LIMIT_MS,
      })
    )
  })
}
