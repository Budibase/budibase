import queue from "./queue"
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
  for (let migration of migrations || MIGRATIONS) {
    // if a migration is disabled, all migrations after it are disabled
    if (migration.disabled) {
      break
    }
    latestMigrationId = migration.id
  }
  return latestMigrationId
}

function getTimestamp(versionId: string) {
  return versionId?.split("_")[0] || ""
}

export async function checkMissingMigrations(
  ctx: UserCtx,
  next: Next,
  appId: string
) {
  const currentVersion = await getAppMigrationVersion(appId)
  const latestMigration = getLatestEnabledMigrationId()

  if (
    latestMigration &&
    getTimestamp(currentVersion) < getTimestamp(latestMigration)
  ) {
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
