import vm from "vm"
import env from "../../environment"
import { context, timers } from "@budibase/backend-core"
import tracer, { Span } from "dd-trace"
import { VM } from "@budibase/types"

type TrackerFn = <T>(f: () => T) => T

export class BuiltInVM implements VM {
  private ctx: vm.Context
  private span?: Span

  constructor(ctx: vm.Context, span?: Span) {
    this.ctx = ctx
    this.span = span
  }

  withContext<T>(context: Record<string, any>, executeWithContext: () => T): T {
    this.ctx = vm.createContext(context)
    try {
      return executeWithContext()
    } finally {
      for (const key in context) {
        delete this.ctx[key]
      }
    }
  }

  execute(code: string) {
    const perRequestLimit = env.JS_PER_REQUEST_TIMEOUT_MS
    let track: TrackerFn = f => f()
    if (perRequestLimit) {
      const bbCtx = tracer.trace("runJS.getCurrentContext", {}, span =>
        context.getCurrentContext()
      )
      if (bbCtx) {
        if (!bbCtx.jsExecutionTracker) {
          this.span?.addTags({
            createdExecutionTracker: true,
          })
          bbCtx.jsExecutionTracker = tracer.trace(
            "runJS.createExecutionTimeTracker",
            {},
            span => timers.ExecutionTimeTracker.withLimit(perRequestLimit)
          )
        }
        this.span?.addTags({
          js: {
            limitMS: bbCtx.jsExecutionTracker.limitMs,
            elapsedMS: bbCtx.jsExecutionTracker.elapsedMS,
          },
        })
        // We call checkLimit() here to prevent paying the cost of creating
        // a new VM context below when we don't need to.
        tracer.trace("runJS.checkLimitAndBind", {}, span => {
          bbCtx.jsExecutionTracker!.checkLimit()
          track = bbCtx.jsExecutionTracker!.track.bind(bbCtx.jsExecutionTracker)
        })
      }
    }

    this.ctx = {
      ...this.ctx,
      alert: undefined,
      setInterval: undefined,
      setTimeout: undefined,
    }

    vm.createContext(this.ctx)
    return track(() =>
      vm.runInNewContext(code, this.ctx, {
        timeout: env.JS_PER_INVOCATION_TIMEOUT_MS,
      })
    )
  }
}
