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
    await doInMigrationLock(appId, async () => {
      const devAppId = db.getDevAppID(appId)
      const prodAppId = db.getProdAppID(appId)
      const isPublished = await db.dbExists(prodAppId)
      const appIdToMigrate = isPublished ? prodAppId : devAppId

      console.log(`Starting app migration for "${appIdToMigrate}"`)

      let currentVersion = await getAppMigrationVersion(appIdToMigrate)

      const currentIndexMigration = migrations.findIndex(
        m => m.id === currentVersion
      )

      const pendingMigrations = migrations.slice(currentIndexMigration + 1)

      const migrationIds = migrations.map(m => m.id)
      console.log(
        `App migrations to run for "${appIdToMigrate}" - ${pendingMigrations.map(m => m.id).join(",")}`
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
          appId: appIdToMigrate,
        })

        // setup full context - tenancy, app and guards
        await context.doInAppMigrationContext(appIdToMigrate, () => func())

        if (isPublished) {
          // setup full context - tenancy, app and guards
          await context.doInAppMigrationContext(devAppId, async () => {
            await sdk.applications.syncApp(devAppId)
            console.log(`App for dev syncronised for "${devAppId}"`)

            await func()
            console.log(`Migration ran for dev app "${devAppId}"`)
          })
        }

        // Only updates versions after the migration has run successfully, to allow retriability
        await context.doInAppMigrationContext(appIdToMigrate, () =>
          updateAppMigrationMetadata({
            appId: appIdToMigrate,
            version: id,
          })
        )

        if (isPublished) {
          await context.doInAppMigrationContext(devAppId, () =>
            updateAppMigrationMetadata({
              appId: devAppId,
              version: id,
            })
          )
        }

        currentVersion = id
      }

      console.log(`App migration for "${appIdToMigrate}" processed`)
    })
  } catch (err) {
    logging.logAlert("Failed to run app migration", err)
    throw err
  }
}
