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

export function getLatestEnabledMigrationId() {
  const enabledMigrations: AppMigration[] = []
  for (let migration of MIGRATIONS) {
    // if a migration is disabled, all migrations after it are disabled
    if (migration.disabled) {
      break
    }
    enabledMigrations.push(migration)
  }
  return enabledMigrations
    .map(m => m.id)
    .sort()
    .reverse()[0]
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

  if (getTimestamp(currentVersion) < getTimestamp(latestMigration)) {
    await queue.add(
      {
        appId,
      },
      {
        jobId: `${appId}_${latestMigration}`,
        removeOnComplete: true,
        removeOnFail: true,
      }
    )

    ctx.response.set(Header.MIGRATING_APP, appId)
  }

  return next()
}
