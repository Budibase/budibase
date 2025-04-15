import { Ctx } from "@budibase/types"
import environment from "../../../../environment"

export default () => {
  if (!environment.isTest()) {
    throw new Error("This middleware is only for testing")
  }

  return async (ctx: Ctx, next: any) => {
    try {
      await next()
    } catch (err: any) {
      if (!ctx.headers["x-budibase-include-stacktrace"]) {
        throw err
      }

      const status = err.status || err.statusCode || 500

      let error = err
      while (error.cause) {
        error = error.cause
      }

      ctx.status = status
      ctx.body = { status, message: error.message, stack: error.stack }
    }
  }
}
