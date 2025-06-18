import { context, locks, logging } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"

import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "./appMigrationMetadata"
import { AppMigration } from "."
import { MIGRATIONS } from "./migrations"

export async function processMigrations(
  appId: string,
  migrations: AppMigration[] = MIGRATIONS
) {
  console.log(`Processing app migration for "${appId}"`)
  try {
    // first step - setup full context - tenancy, app and guards
    await context.doInAppMigrationContext(appId, async () => {
      console.log(`Acquiring app migration lock for "${appId}"`)
      await locks.doWithLock(
        {
          name: LockName.APP_MIGRATION,
          type: LockType.AUTO_EXTEND,
          resource: appId,
        },
        async () => {
          console.log(`Lock acquired starting app migration for "${appId}"`)
          let currentVersion = await getAppMigrationVersion(appId)

          const currentIndexMigration = migrations.findIndex(
            m => m.id === currentVersion
          )

          const pendingMigrations = migrations.slice(currentIndexMigration + 1)

          const migrationIds = migrations.map(m => m.id)
          console.log(
            `App migrations to run for "${appId}" - ${migrationIds.join(",")}`
          )

          let index = 0
          for (const { id, func, disabled } of pendingMigrations) {
            if (disabled) {
              // If we find a disabled migration, we prevent running any other
              return
            }
            const expectedMigration =
              migrationIds[migrationIds.indexOf(currentVersion) + 1]

            if (expectedMigration !== id) {
              throw new Error(
                `Migration ${id} could not run, update for "${id}" is running but ${expectedMigration} is expected`
              )
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
        }
      )
    })
    console.log(`App migration for "${appId}" processed`)
  } catch (err) {
    logging.logAlert("Failed to run app migration", err)
    throw err
  }
}
