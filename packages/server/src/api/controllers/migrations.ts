import { context } from "@budibase/backend-core"
import { migrate as migrationImpl, MIGRATIONS } from "../../migrations"
import { Ctx } from "@budibase/types"
import {
  getAppMigrationVersion,
  getLatestEnabledMigrationId,
} from "../../appMigrations"

export async function migrate(ctx: Ctx) {
  const options = ctx.request.body
  // don't await as can take a while, just return
  migrationImpl(options)
  ctx.status = 200
}

export async function fetchDefinitions(ctx: Ctx) {
  ctx.body = MIGRATIONS
  ctx.status = 200
}

export async function getMigrationStatus(ctx: Ctx) {
  const appId = context.getAppId()

  if (!appId) {
    ctx.throw("AppId could not be found")
  }

  const latestAppliedMigration = await getAppMigrationVersion(appId)

  const latestMigrationId = getLatestEnabledMigrationId()
  const migrated =
    !latestMigrationId || latestAppliedMigration >= latestMigrationId

  ctx.body = { migrated }
  ctx.status = 200
}
