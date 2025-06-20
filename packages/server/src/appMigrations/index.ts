import { getAppMigrationQueue } from "./queue"
import { Next } from "koa"
import { getAppMigrationVersion } from "./appMigrationMetadata"
import { MIGRATIONS } from "./migrations"
import { UserCtx } from "@budibase/types"
import { Header } from "@budibase/backend-core"

export * from "./appMigrationMetadata"

export type AppMigration = {
  id: string
  func: () => Promise<void>
  // disabled so that by default all migrations listed are enabled
  disabled?: boolean
}

export function getLatestEnabledMigrationId(migrations?: AppMigration[]) {
  let latestMigrationId: string | undefined
  if (!migrations) {
    migrations = MIGRATIONS
  }
  for (let migration of migrations) {
    // if a migration is disabled, all migrations after it are disabled
    if (migration.disabled) {
      break
    }
    latestMigrationId = migration.id
  }
  return latestMigrationId
}

function getMigrationIndex(versionId: string) {
  return MIGRATIONS.findIndex(m => m.id === versionId)
}

export async function checkMissingMigrations(
  ctx: UserCtx,
  next: Next,
  appId: string
) {
  const latestMigration = getLatestEnabledMigrationId()

  // no migrations set - edge case, don't try to do anything
  if (!latestMigration) {
    return next()
  }

  const currentVersion = await getAppMigrationVersion(appId)

  if (getMigrationIndex(currentVersion) < getMigrationIndex(latestMigration)) {
    const queue = getAppMigrationQueue()
    await queue.add(
      {
        appId,
      },
      {
        jobId: `${appId}_${latestMigration}`,
      }
    )

    ctx.response.set(Header.MIGRATING_APP, appId)
  }

  return next()
}

export const isAppFullyMigrated = async (appId: string) => {
  const latestMigration = getLatestEnabledMigrationId()
  if (!latestMigration) {
    return true
  }
  const latestMigrationApplied = await getAppMigrationVersion(appId)
  return latestMigrationApplied >= latestMigration
}
