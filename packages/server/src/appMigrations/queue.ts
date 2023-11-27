import { queue } from "@budibase/backend-core"
import { Job } from "bull"

const appMigrationQueue = queue.createQueue(queue.JobQueue.APP_MIGRATION)
appMigrationQueue.process(processMessage)

async function processMessage(job: Job) {
  const { appId } = job.data

  console.log(appId)
}

export default appMigrationQueue
