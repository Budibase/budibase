import { UserCtx } from "@budibase/types"
import { checkMissingMigrations, migrationsEnabled } from "../appMigrations"
import { env } from "@budibase/backend-core"

export default async (ctx: UserCtx, next: any) => {
  const { appId } = ctx

  // migrations can be disabled via environment variable, or can be disabled
  // due to some of the migrations not being ready to run - disables all migrations
  if (env.SKIP_APP_MIGRATIONS || !migrationsEnabled()) {
    return next()
  }

  if (!appId) {
    return next()
  }

  return checkMissingMigrations(ctx, next, appId)
}
