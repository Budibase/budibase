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

const redisConfig = redisProtocolUrl || { redis: opts }
let automationQueue = new Queue(JobQueues.AUTOMATIONS, redisConfig)

exports.pathPrefix = "/bulladmin"

exports.init = () => {
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
