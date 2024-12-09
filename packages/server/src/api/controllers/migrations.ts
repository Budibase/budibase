import { context } from "@budibase/backend-core"
import { migrate as migrationImpl, MIGRATIONS } from "../../migrations"
import {
  Ctx,
  FetchOldMigrationResponse,
  GetOldMigrationStatus,
  RunOldMigrationRequest,
} from "@budibase/types"
import {
  getAppMigrationVersion,
  getLatestEnabledMigrationId,
} from "../../appMigrations"

export async function migrate(ctx: Ctx<RunOldMigrationRequest, void>) {
  const options = ctx.request.body
  // don't await as can take a while, just return
  migrationImpl(options)
  ctx.status = 200
}

export async function fetchDefinitions(
  ctx: Ctx<void, FetchOldMigrationResponse>
) {
  ctx.body = MIGRATIONS
  ctx.status = 200
}

export async function getMigrationStatus(
  ctx: Ctx<void, GetOldMigrationStatus>
) {
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
