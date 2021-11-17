const { createBullBoard } = require("bull-board")
const { BullAdapter } = require("bull-board/bullAdapter")
const express = require("express")
const env = require("../environment")
const Queue = env.isTest()
  ? require("../utilities/queue/inMemoryQueue")
  : require("bull")
const { JobQueues } = require("../constants")
const { utils } = require("@budibase/auth/redis")
const { opts, redisProtocolUrl } = utils.getRedisOptions()

const CLEANUP_PERIOD_MS = 60 * 1000
const queueConfig = redisProtocolUrl || { redis: opts }
let cleanupInternal = null

let automationQueue = new Queue(JobQueues.AUTOMATIONS, queueConfig)

async function cleanup() {
  await automationQueue.clean(CLEANUP_PERIOD_MS, "completed")
}

exports.pathPrefix = "/bulladmin"

exports.init = () => {
  // cleanup the events every 5 minutes
  if (!cleanupInternal) {
    cleanupInternal = setInterval(cleanup, CLEANUP_PERIOD_MS)
    // fire off an initial cleanup
    cleanup().catch(err => {
      console.error(`Unable to cleanup automation queue initially - ${err}`)
    })
  }
  const expressApp = express()
  // Set up queues for bull board admin
  const queues = [automationQueue]
  const adapters = []
  for (let queue of queues) {
    adapters.push(new BullAdapter(queue))
  }
  const { router } = createBullBoard(adapters)

  expressApp.use(exports.pathPrefix, router)
  return expressApp
}

exports.queue = automationQueue
