import { Ctx } from "@budibase/types"
import type { Middleware, Next } from "koa"

// this middleware exists purely to be overridden by middlewares supplied by the @budibase/pro library
const middleware = (async (ctx: Ctx, next: Next) => {
  // Placeholder for audit log middleware
  return next()
}) as Middleware

export default middleware
