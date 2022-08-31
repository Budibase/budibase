const { createBullBoard } = require("@bull-board/api")
const { BullAdapter } = require("@bull-board/api/bullAdapter")
const { KoaAdapter } = require("@bull-board/koa")
const env = require("../environment")
const Queue = env.isTest()
  ? require("../utilities/queue/inMemoryQueue")
  : require("bull")
const { JobQueues } = require("../constants")
const { utils } = require("@budibase/backend-core/redis")
const { opts, redisProtocolUrl } = utils.getRedisOptions()
const listeners = require("./listeners")

const CLEANUP_PERIOD_MS = 60 * 1000
const queueConfig = redisProtocolUrl || { redis: opts }
let cleanupInternal = null

let automationQueue = new Queue(JobQueues.AUTOMATIONS, queueConfig)
listeners.addListeners(automationQueue)

async function cleanup() {
  await automationQueue.clean(CLEANUP_PERIOD_MS, "completed")
}

const PATH_PREFIX = "/bulladmin"

exports.init = () => {
  // cleanup the events every 5 minutes
  if (!cleanupInternal) {
    cleanupInternal = setInterval(cleanup, CLEANUP_PERIOD_MS)
    // fire off an initial cleanup
    cleanup().catch(err => {
      console.error(`Unable to cleanup automation queue initially - ${err}`)
    })
  }
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
  if (automationQueue) {
    clearInterval(cleanupInternal)
    await automationQueue.close()
    automationQueue = null
  }
  console.log("Bull shutdown")
}

exports.queue = automationQueue
