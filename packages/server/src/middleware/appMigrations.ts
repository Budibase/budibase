import { UserCtx } from "@budibase/types"
import { checkMissingMigrations } from "../appMigrations"

export default async (ctx: UserCtx, next: any) => {
  const { appId } = ctx

  if (!appId) {
    return next()
  }

  await checkMissingMigrations(appId)

  return next()
}
