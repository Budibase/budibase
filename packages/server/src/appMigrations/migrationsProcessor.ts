import { context, locks } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"

import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "./appMigrationMetadata"
import { AppMigration } from "."

export async function processMigrations(
  appId: string,
  migrations: AppMigration[]
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
          .filter(m => m.id > currentVersion)
          .sort((a, b) => a.id.localeCompare(b.id))

        const migrationIds = migrations.map(m => m.id).sort()

        let index = 0
        for (const { id, func } of pendingMigrations) {
          const expectedMigration =
            migrationIds[migrationIds.indexOf(currentVersion) + 1]

          if (expectedMigration !== id) {
            throw `Migration ${id} could not run, update for "${id}" is running but ${expectedMigration} is expected`
          }

          const counter = `(${++index}/${pendingMigrations.length})`
          console.info(`Running migration ${id}... ${counter}`, {
            migrationId: id,
            appId,
          })
          await func()
          await updateAppMigrationMetadata({
            appId,
            version: id,
          })
          currentVersion = id
        }
      })
    }
  )

  console.log(`App migration for "${appId}" processed`)
}
