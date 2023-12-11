import { queue } from "@budibase/backend-core"
import { Job } from "bull"
import { MIGRATIONS } from "./migrations"
import { processMigrations } from "./migrationsProcessor"

const appMigrationQueue = queue.createQueue(queue.JobQueue.APP_MIGRATION)
appMigrationQueue.process(processMessage)

async function processMessage(job: Job) {
  const { appId } = job.data

  await processMigrations(appId, MIGRATIONS)
}

export default appMigrationQueue
