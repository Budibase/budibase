import { context, db, logging } from "@budibase/backend-core"

import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "./appMigrationMetadata"
import { AppMigration, doInMigrationLock } from "."
import { MIGRATIONS } from "./migrations"
import sdk from "../sdk"
import tracer from "dd-trace"

async function getPendingMigrationsForApp(
  appId: string,
  allMigrations: AppMigration[]
): Promise<AppMigration[]> {
  const currentVersion = await getAppMigrationVersion(appId)
  const currentIndex = allMigrations.findIndex(m => m.id === currentVersion)
  return allMigrations.slice(currentIndex + 1)
}

function getAllPendingMigrationIds(
  pendingMigrationsPerApp: Record<string, AppMigration[]>
): string[] {
  return Object.values(pendingMigrationsPerApp)
    .flatMap(migrations => migrations)
    .map(migration => migration.id)
}

function getUniquePendingMigrations(
  allMigrations: AppMigration[],
  pendingMigrationIds: string[]
): AppMigration[] {
  return allMigrations.filter(migration =>
    pendingMigrationIds.includes(migration.id)
  )
}

async function runMigrationForApp({
  migrationId,
  migrationFunc,
  appId,
}: {
  migrationId: string
  migrationFunc: () => Promise<void>
  appId: string
}): Promise<void> {
  await tracer.trace("runMigrationForApp", async span => {
    span.addTags({
      appId,
      migrationId,
    })
    await context.doInAppMigrationContext(appId, async () => {
      console.log(`Running migration "${migrationId}" for app "${appId}"`)
      await migrationFunc()
      console.log(`Migration "${migrationId}" ran for app "${appId}"`)
    })
  })
}

async function syncDevApp(devAppId: string): Promise<void> {
  await tracer.trace("runMigrationForApp", async span => {
    span.addTags({
      appId: devAppId,
    })
    await context.doInAppMigrationContext(devAppId, async () => {
      await sdk.applications.syncApp(devAppId)
      console.log(`App synchronized for dev "${devAppId}"`)
    })
  })
}

async function updateMigrationVersion(
  appId: string,
  migrationId: string
): Promise<void> {
  await context.doInAppMigrationContext(appId, () =>
    updateAppMigrationMetadata({
      appId,
      version: migrationId,
    })
  )
}

export async function processMigrations(
  appId: string,
  migrations: AppMigration[] = MIGRATIONS
) {
  console.log(`Processing app migration for "${appId}"`)

  await tracer.trace("runMigrationForApp", async span => {
    span.addTags({ appId })
    try {
      await context.doInAppContext(appId, () =>
        doInMigrationLock(appId, async () => {
          const devAppId = db.getDevAppID(appId)
          const prodAppId = db.getProdAppID(appId)
          const isPublished = await sdk.applications.isAppPublished(prodAppId)
          const appIdToMigrate = isPublished ? prodAppId : devAppId

          console.log(`Starting app migration for "${appIdToMigrate}"`)

          const pendingMigrationsPerApp = {
            [devAppId]: await getPendingMigrationsForApp(devAppId, migrations),
            [prodAppId]: isPublished
              ? await getPendingMigrationsForApp(prodAppId, migrations)
              : [],
          }

          function needsToRun(
            migrationId: string,
            targetAppId: string
          ): boolean {
            return pendingMigrationsPerApp[targetAppId].some(
              m => m.id === migrationId
            )
          }

          const allPendingMigrationIds = getAllPendingMigrationIds(
            pendingMigrationsPerApp
          )
          const pendingMigrations = getUniquePendingMigrations(
            migrations,
            allPendingMigrationIds
          )

          span.addTags({ migrationsToRun: pendingMigrations.length })

          console.log(
            `App migrations to run for "${appIdToMigrate}" - ${pendingMigrations.map(m => m.id).join(",")}`
          )

          let migrationIndex = 0
          for (const {
            id: migrationId,
            func: migrationFunc,
            disabled,
          } of pendingMigrations) {
            if (disabled) {
              // If we find a disabled migration, we prevent running any other
              console.log(
                `Migration ${migrationId} is disabled, stopping migration process`
              )
              return
            }

            const progressCounter = `(${++migrationIndex}/${pendingMigrations.length})`
            console.info(
              `Running migration ${migrationId}... ${progressCounter}`,
              {
                migrationId,
                appId: appIdToMigrate,
              }
            )

            const runForAppToMigrate = needsToRun(migrationId, appIdToMigrate)
            const runForDevApp =
              isPublished && needsToRun(migrationId, devAppId)

            if (runForAppToMigrate) {
              await runMigrationForApp({
                migrationId,
                migrationFunc,
                appId: appIdToMigrate,
              })
            }

            if (runForDevApp) {
              await syncDevApp(devAppId)
              await runMigrationForApp({
                migrationId,
                migrationFunc,
                appId: devAppId,
              })
            }

            if (runForAppToMigrate) {
              await updateMigrationVersion(appIdToMigrate, migrationId)
            }

            if (runForDevApp) {
              await updateMigrationVersion(devAppId, migrationId)
            }
          }

          console.log(`App migration for "${appIdToMigrate}" processed`)
        })
      )
    } catch (err) {
      logging.logAlert("Failed to run app migration", err)
      throw err
    }
  })
}
