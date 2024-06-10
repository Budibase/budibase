import { queue, logging } from "@budibase/backend-core"
import { Job } from "bull"
import { MIGRATIONS } from "./migrations"
import { processMigrations } from "./migrationsProcessor"
import { apiEnabled } from "../features"

const MAX_ATTEMPTS = 3

const appMigrationQueue = queue.createQueue(queue.JobQueue.APP_MIGRATION, {
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
})

// only run app migrations in main API services
if (apiEnabled()) {
  appMigrationQueue.process(processMessage)
}

async function processMessage(job: Job) {
  const { appId } = job.data

  await processMigrations(appId, MIGRATIONS)
}

export default appMigrationQueue
