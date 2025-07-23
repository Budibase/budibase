import { context, db, logging } from "@budibase/backend-core"

import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "./appMigrationMetadata"
import { AppMigration, doInMigrationLock } from "."
import { MIGRATIONS } from "./migrations"
import sdk from "../sdk"

export async function processMigrations(
  appId: string,
  migrations: AppMigration[] = MIGRATIONS
) {
  console.log(`Processing app migration for "${appId}"`)
  try {
    await context.doInAppContext(appId, () =>
      doInMigrationLock(appId, async () => {
        const devAppId = db.getDevAppID(appId)
        const prodAppId = db.getProdAppID(appId)
        const isPublished = await sdk.applications.isAppPublished(prodAppId)
        const appIdToMigrate = isPublished ? prodAppId : devAppId

        console.log(`Starting app migration for "${appIdToMigrate}"`)

        async function getPendingMigrations(appId: string) {
          const currentVersion = await getAppMigrationVersion(appId)
          const currentIndex = migrations.findIndex(
            m => m.id === currentVersion
          )
          return migrations.slice(currentIndex + 1)
        }

        // We might have dev and prod migration out of sync, as before they worked independently
        const pendingMigrationsPerApp = {
          [devAppId]: await getPendingMigrations(devAppId),
          [prodAppId]: isPublished ? await getPendingMigrations(prodAppId) : [],
        }

        function needsToRun(migrationId: string, appId: string) {
          return pendingMigrationsPerApp[appId].some(m => m.id === migrationId)
        }

        const pendingMigrations = migrations.filter(m =>
          Object.values(pendingMigrationsPerApp)
            .flatMap(m => m)
            .map(m => m.id)
            .includes(m.id)
        )

        console.log(
          `App migrations to run for "${appIdToMigrate}" - ${pendingMigrations.map(m => m.id).join(",")}`
        )

        let index = 0
        for (const { id, func, disabled } of pendingMigrations) {
          if (disabled) {
            // If we find a disabled migration, we prevent running any other
            return
          }

          const counter = `(${++index}/${pendingMigrations.length})`
          console.info(`Running migration ${id}... ${counter}`, {
            migrationId: id,
            appId: appIdToMigrate,
          })

          if (needsToRun(id, appIdToMigrate)) {
            // setup full context - tenancy, app and guards
            await context.doInAppMigrationContext(appIdToMigrate, () => func())
          }

          if (isPublished && needsToRun(id, devAppId)) {
            // setup full context - tenancy, app and guards
            await context.doInAppMigrationContext(devAppId, async () => {
              await sdk.applications.syncApp(devAppId)
              console.log(`App for dev syncronised for "${devAppId}"`)

              await func()
              console.log(`Migration ran for dev app "${devAppId}"`)
            })
          }

          if (needsToRun(id, appIdToMigrate)) {
            // Only updates versions after the migration has run successfully, to allow retriability
            await context.doInAppMigrationContext(appIdToMigrate, () =>
              updateAppMigrationMetadata({
                appId: appIdToMigrate,
                version: id,
              })
            )
          }

          if (isPublished && needsToRun(id, devAppId)) {
            await context.doInAppMigrationContext(devAppId, () =>
              updateAppMigrationMetadata({
                appId: devAppId,
                version: id,
              })
            )
          }
        }

        console.log(`App migration for "${appIdToMigrate}" processed`)
      })
    )
  } catch (err) {
    logging.logAlert("Failed to run app migration", err)
    throw err
  }
}
