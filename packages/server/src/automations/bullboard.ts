import { BullAdapter } from "@bull-board/api/bullAdapter"
import { KoaAdapter } from "@bull-board/koa"
import { queue } from "@budibase/backend-core"
import * as automation from "../threads/automation"
import { backups } from "@budibase/pro"
import { getAppMigrationQueue } from "../appMigrations/queue"
import { createBullBoard } from "@bull-board/api"
import { AutomationData } from "@budibase/types"

export const automationQueue = new queue.BudibaseQueue<AutomationData>(
  queue.JobQueue.AUTOMATION,
  {
    removeStalledCb: automation.removeStalled,
    jobTags: (job: AutomationData) => {
      return {
        "automation.id": job.automation._id,
        "automation.name": job.automation.name,
        "automation.appId": job.automation.appId,
        "automation.createdAt": job.automation.createdAt,
        "automation.trigger": job.automation.definition.trigger.stepId,
      }
    },
  }
)

const PATH_PREFIX = "/bulladmin"

export async function init() {
  // Set up queues for bull board admin
  const queues = [new BullAdapter(automationQueue.getBullQueue())]

  const backupQueue = backups.getBackupQueue()
  if (backupQueue) {
    queues.push(new BullAdapter(backupQueue.getBullQueue()))
  }

  const appMigrationQueue = getAppMigrationQueue()
  if (appMigrationQueue) {
    queues.push(new BullAdapter(appMigrationQueue.getBullQueue()))
  }

  const serverAdapter = new KoaAdapter()
  createBullBoard({ queues, serverAdapter })
  serverAdapter.setBasePath(PATH_PREFIX)
  return serverAdapter.registerPlugin()
}

export async function shutdown() {
  await queue.shutdown()
}
