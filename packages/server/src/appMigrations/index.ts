import queue from "./queue"
import { getAppMigrationVersion } from "./appMigrationMetadata"
import { MIGRATIONS } from "./migrations"

const latestMigration = MIGRATIONS.map(m => m.migrationId)
  .sort()
  .reverse()[0]

export async function checkMissingMigrations(appId: string) {
  const currentVersion = await getAppMigrationVersion(appId)

  if (currentVersion < latestMigration) {
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
