import { context } from "@budibase/backend-core"
import { Ctx, GetMigrationStatus } from "@budibase/types"
import {
  getAppMigrationVersion,
  getLatestEnabledMigrationId,
} from "../../appMigrations"

export async function getMigrationStatus(ctx: Ctx<void, GetMigrationStatus>) {
  const appId = context.getAppId()

  if (!appId) {
    ctx.throw("AppId could not be found")
  }

  const latestAppliedMigration = await getAppMigrationVersion(appId)

  const latestMigrationId = getLatestEnabledMigrationId()
  const migrated =
    !latestMigrationId || latestAppliedMigration >= latestMigrationId

  ctx.body = { migrated }
}
