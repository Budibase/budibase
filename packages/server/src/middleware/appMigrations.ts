import { UserCtx } from "@budibase/types"
import { checkMissingMigrations } from "../appMigrations"
import env from "../environment"
import type { Middleware, Next } from "koa"

const middleware = (async (ctx: UserCtx, next: Next) => {
  const { appId } = ctx

  // migrations can be disabled via environment variable if you
  // need to completely disable migrations, e.g. for testing
  if (env.DISABLE_APP_MIGRATIONS) {
    return next()
  }

  if (!appId) {
    return next()
  }

  return checkMissingMigrations(ctx, next, appId)
}) as Middleware

export default middleware
