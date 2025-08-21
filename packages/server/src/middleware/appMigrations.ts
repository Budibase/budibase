import { Header } from "@budibase/shared-core"
import { UserCtx } from "@budibase/types"
import type { Middleware, Next } from "koa"
import { checkMissingMigrations } from "../appMigrations"
import env from "../environment"

export const appMigrations = (async (ctx: UserCtx, next: Next) => {
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

export async function skipMigrationRedirect(ctx: UserCtx, next: Next) {
  const result = await next()
  if (ctx.response.get(Header.MIGRATING_APP)) {
    console.log("Skipping migration redirect")
    ctx.response.remove(Header.MIGRATING_APP)
  }

  return result
}
