import { queue, logging } from "@budibase/backend-core"
import { Job } from "bull"
import { MIGRATIONS } from "./migrations"
import { processMigrations } from "./migrationsProcessor"

const MAX_ATTEMPTS = 3
// max number of migrations to run at same time, per node
const MIGRATION_CONCURRENCY = 5

export type AppMigrationJob = {
  appId: string
}

let appMigrationQueue: queue.Queue<AppMigrationJob> | undefined

export function init() {
  appMigrationQueue = queue.createQueue<AppMigrationJob>(
    queue.JobQueue.APP_MIGRATION,
    {
      jobOptions: {
        attempts: MAX_ATTEMPTS,
        removeOnComplete: true,
        removeOnFail: true,
      },
      maxStalledCount: MAX_ATTEMPTS,
      removeStalledCb: async (job: Job) => {
        logging.logAlert(
          `App migration failed, queue job ID: ${job.id} - reason: ${job.failedReason}`
        )
      },
    }
  )

  return appMigrationQueue.process(MIGRATION_CONCURRENCY, processMessage)
}

async function processMessage(job: Job<AppMigrationJob>) {
  const { appId } = job.data

  await processMigrations(appId, MIGRATIONS)
}

export function getAppMigrationQueue() {
  return appMigrationQueue
}
