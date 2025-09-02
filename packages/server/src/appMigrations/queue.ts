import { queue, logging } from "@budibase/backend-core"
import { Job } from "bull"
import { processMigrations } from "./migrationsProcessor"

const MAX_ATTEMPTS = 3
// max number of migrations to run at same time, per node
const MIGRATION_CONCURRENCY = 5

export type WorkspaceMigrationJob = {
  workspaceId: string
}

// always create workspace migration queue - so that events can be pushed and read from it
// across the different api and automation services
const workspaceMigrationQueue = new queue.BudibaseQueue<WorkspaceMigrationJob>(
  queue.JobQueue.WORKSPACE_MIGRATION,
  {
    jobOptions: {
      attempts: MAX_ATTEMPTS,
      removeOnComplete: true,
      removeOnFail: true,
    },
    maxStalledCount: MAX_ATTEMPTS,
    removeStalledCb: async (job: Job) => {
      logging.logAlert(
        `Workspace migration failed, queue job ID: ${job.id} - reason: ${job.failedReason}`
      )
    },
  }
)

export function init() {
  return workspaceMigrationQueue.process(MIGRATION_CONCURRENCY, processMessage)
}

async function processMessage(job: Job<WorkspaceMigrationJob>) {
  const { workspaceId } = job.data

  await processMigrations(workspaceId)
}

export function getWorkspaceMigrationQueue() {
  return workspaceMigrationQueue
}
