import { Ctx } from "@budibase/types"
import { context } from "@budibase/backend-core"
import { tracer } from "dd-trace"
import type { Middleware, Next } from "koa"

const middleware = (async (ctx: Ctx, next: Next) => {
  const resp = await next()

  const current = context.getCurrentContext()
  if (!current || !current.cleanup) {
    return resp
  }

  let errors = []
  for (let fn of current.cleanup) {
    try {
      await tracer.trace("cleanup", async () => {
        await fn()
      })
    } catch (e) {
      // We catch errors here to ensure we at least attempt to run all cleanup
      // functions. We'll throw the first error we encounter after all cleanup
      // functions have been run.
      errors.push(e)
    }
  }
  delete current.cleanup

  if (errors.length > 0) {
    throw errors[0]
  }

  return resp
}) as Middleware

export default middleware
