import { UserCtx } from "@budibase/types"
import { checkMissingMigrations } from "../appMigrations"
import { env } from "@budibase/backend-core"

export default async (ctx: UserCtx, next: any) => {
  const { appId } = ctx

  if (env.SKIP_APP_MIGRATIONS) {
    return next()
  }

  if (!appId) {
    return next()
  }

  return checkMissingMigrations(ctx, next, appId)
}
