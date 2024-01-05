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
}

export const getLatestMigrationId = () =>
  MIGRATIONS.map(m => m.id)
    .sort()
    .reverse()[0]

const getTimestamp = (versionId: string) => versionId?.split("_")[0]

export async function checkMissingMigrations(
  ctx: UserCtx,
  next: Next,
  appId: string
) {
  const currentVersion = await getAppMigrationVersion(appId)
  const latestMigration = getLatestMigrationId()

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
