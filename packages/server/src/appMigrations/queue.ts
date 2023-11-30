import { context, locks, queue } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"
import { Job } from "bull"
import { MIGRATIONS } from "./migrations"
import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "./appMigrationMetadata"
import environment from "../environment"

const appMigrationQueue = queue.createQueue(queue.JobQueue.APP_MIGRATION)
appMigrationQueue.process(processMessage)

async function processMessage(job: Job) {
  const { appId } = job.data
  console.log(`Processing app migration for "${appId}"`)

  await locks.doWithLock(
    {
      name: LockName.APP_MIGRATION,
      type: LockType.AUTO_EXTEND,
      resource: appId,
      ttl: 60000,
    },
    async () => {
      await context.doInAppContext(appId, async () => {
        let currentVersion = await getAppMigrationVersion(appId)

        const pendingMigrations = MIGRATIONS.filter(
          m => m.migrationId > currentVersion
        ).sort((a, b) => a.migrationId.localeCompare(b.migrationId))

        const migrationIds = MIGRATIONS.map(m => m.migrationId).sort()

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

export default appMigrationQueue
