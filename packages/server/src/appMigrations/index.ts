import queue from "./queue"
import { getAppMigrationVersion } from "./appMigrationMetadata"
import { MIGRATIONS } from "./migrations"

export * from "./appMigrationMetadata"

export type AppMigration = {
  id: string
  func: () => Promise<void>
}

export const latestMigration = MIGRATIONS.map(m => m.id)
  .sort()
  .reverse()[0]

const getTimestamp = (versionId: string) => versionId?.split("_")[0]

export async function checkMissingMigrations(appId: string) {
  const currentVersion = await getAppMigrationVersion(appId)

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
  }
}
