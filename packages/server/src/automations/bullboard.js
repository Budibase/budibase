const { createBullBoard } = require("@bull-board/api")
const { BullAdapter } = require("@bull-board/api/bullAdapter")
const { KoaAdapter } = require("@bull-board/koa")
const { queue } = require("@budibase/backend-core")
const automation = require("../threads/automation")
const { backups } = require("@budibase/pro")

let automationQueue = queue.createQueue(
  queue.JobQueue.AUTOMATION,
  automation.removeStalled
)

const PATH_PREFIX = "/bulladmin"

exports.init = async () => {
  // Set up queues for bull board admin
  const backupQueue = await backups.getBackupQueue()
  const queues = [automationQueue]
  if (backupQueue) {
    queues.push(backupQueue)
  }
  const adapters = []
  const serverAdapter = new KoaAdapter()
  for (let queue of queues) {
    adapters.push(new BullAdapter(queue))
  }
  createBullBoard({
    queues: adapters,
    serverAdapter,
  })
  serverAdapter.setBasePath(PATH_PREFIX)
  return serverAdapter.registerPlugin()
}

exports.shutdown = async () => {
  await queue.shutdown()
}

exports.automationQueue = automationQueue
