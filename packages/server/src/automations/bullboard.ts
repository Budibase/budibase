import { BullAdapter } from "@bull-board/api/bullAdapter"
import { KoaAdapter } from "@bull-board/koa"
import { queue } from "@budibase/backend-core"
import * as automation from "../threads/automation"
import { backups } from "@budibase/pro"
import { getAppMigrationQueue } from "../appMigrations/queue"
import { createBullBoard } from "@bull-board/api"
import { AutomationData } from "@budibase/types"

export const automationQueue = queue.createQueue<AutomationData>(
  queue.JobQueue.AUTOMATION,
  { removeStalledCb: automation.removeStalled }
)

const PATH_PREFIX = "/bulladmin"

export async function init() {
  // Set up queues for bull board admin
  const queues = [new BullAdapter(automationQueue)]

  const backupQueue = backups.getBackupQueue()
  if (backupQueue) {
    queues.push(new BullAdapter(backupQueue))
  }

  const appMigrationQueue = getAppMigrationQueue()
  if (appMigrationQueue) {
    queues.push(new BullAdapter(appMigrationQueue))
  }

  const serverAdapter = new KoaAdapter()
  createBullBoard({ queues, serverAdapter })
  serverAdapter.setBasePath(PATH_PREFIX)
  return serverAdapter.registerPlugin()
}

export async function shutdown() {
  await queue.shutdown()
}
