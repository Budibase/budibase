import queue, { PROCESS_MIGRATION_TIMEOUT } from "./queue"
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
        jobId: `${appId}_${latestMigration}`,
        removeOnComplete: true,
        removeOnFail: true,
        timeout: PROCESS_MIGRATION_TIMEOUT,
      }
    )
  }
}
