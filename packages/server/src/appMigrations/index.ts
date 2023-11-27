import queue from "./queue"
import { getAppMigrationMetadata } from "./appMigrationMetadata"
import { MIGRATIONS } from "./migrations"

const latestMigration = Object.keys(MIGRATIONS).sort().reverse()[0]

export async function checkMissingMigrations(appId: string) {
  const currentVersion = await getAppMigrationMetadata(appId)

  if (currentVersion < latestMigration) {
    await queue.add(
      {
        appId,
      },
      {
        jobId: appId,
        removeOnComplete: true,
        removeOnFail: true,
      }
    )
  }
}
