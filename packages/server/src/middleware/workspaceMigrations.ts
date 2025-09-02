import { Header } from "@budibase/shared-core"
import { UserCtx } from "@budibase/types"
import type { Middleware, Next } from "koa"
import { checkMissingMigrations } from "../workspaceMigrations"
import env from "../environment"
import { context } from "@budibase/backend-core"

export const workspaceMigrations = (async (ctx: UserCtx, next: Next) => {
  const workspaceId = context.getWorkspaceId()

  // migrations can be disabled via environment variable if you
  // need to completely disable migrations, e.g. for testing
  if (env.DISABLE_WORKSPACE_MIGRATIONS) {
    return next()
  }

  if (!workspaceId) {
    return next()
  }

  return checkMissingMigrations(ctx, next, workspaceId)
}) as Middleware

export async function skipMigrationRedirect(ctx: UserCtx, next: Next) {
  const result = await next()
  if (ctx.response.get(Header.MIGRATING_WORKSPACE)) {
    console.log("Skipping migration redirect")
    ctx.response.remove(Header.MIGRATING_WORKSPACE)
  }

  return result
}
