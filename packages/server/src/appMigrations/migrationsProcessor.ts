import { context, locks } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"

import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "./appMigrationMetadata"

export async function processMigrations(
  appId: string,
  migrations: {
    migrationId: string
    migrationFunc: () => Promise<void>
  }[]
) {
  console.log(`Processing app migration for "${appId}"`)

  await locks.doWithLock(
    {
      name: LockName.APP_MIGRATION,
      type: LockType.AUTO_EXTEND,
      resource: appId,
    },
    async () => {
      await context.doInAppMigrationContext(appId, async () => {
        let currentVersion = await getAppMigrationVersion(appId)

        const pendingMigrations = migrations
          .filter(m => m.migrationId > currentVersion)
          .sort((a, b) => a.migrationId.localeCompare(b.migrationId))

        const migrationIds = migrations.map(m => m.migrationId).sort()

        let index = 0
        for (const { migrationId, migrationFunc } of pendingMigrations) {
          const expectedMigration =
            migrationIds[migrationIds.indexOf(currentVersion) + 1]

          if (expectedMigration !== migrationId) {
            throw `Migration ${migrationId} could not run, update for "${migrationId}" is running but ${expectedMigration} is expected`
          }

          const counter = `(${++index}/${pendingMigrations.length})`
          console.info(`Running migration ${migrationId}... ${counter}`, {
            migrationId,
            appId,
          })
          await migrationFunc()
          await updateAppMigrationMetadata({
            appId,
            version: migrationId,
          })
          currentVersion = migrationId
        }
      })
    }
  )

  console.log(`App migration for "${appId}" processed`)
}
