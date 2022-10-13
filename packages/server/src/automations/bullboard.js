const { createBullBoard } = require("@bull-board/api")
const { BullAdapter } = require("@bull-board/api/bullAdapter")
const { KoaAdapter } = require("@bull-board/koa")
const { queue } = require("@budibase/backend-core")
const listeners = require("./listeners")

let automationQueue = queue.createQueue(queue.JobQueue.AUTOMATIONS)
listeners.addListeners(automationQueue)

const PATH_PREFIX = "/bulladmin"

exports.init = () => {
  // Set up queues for bull board admin
  const queues = [automationQueue]
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
