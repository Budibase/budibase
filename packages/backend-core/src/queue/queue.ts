import env from "../environment"
import { getRedisOptions } from "../redis/utils"
import { JobQueue } from "./constants"
import inMemoryQueue from "./inMemoryQueue"
import BullQueue from "bull"
import InMemoryQueue from "./inMemoryQueue"
const { opts, redisProtocolUrl } = getRedisOptions()

const CLEANUP_PERIOD_MS = 60 * 1000
let QUEUES: BullQueue.Queue[] | InMemoryQueue[] = []
let cleanupInterval: NodeJS.Timeout

async function cleanup() {
  for (let queue of QUEUES) {
    await queue.clean(CLEANUP_PERIOD_MS, "completed")
  }
}

export function createQueue(jobQueue: JobQueue) {
  const queueConfig: any = redisProtocolUrl || { redis: opts }
  let queue: any
  if (env.isTest()) {
    queue = new BullQueue(jobQueue, queueConfig)
  } else {
    queue = new inMemoryQueue(jobQueue, queueConfig)
  }
  QUEUES.push(queue)
  if (!cleanupInterval) {
    cleanupInterval = setInterval(cleanup, CLEANUP_PERIOD_MS)
    // fire off an initial cleanup
    cleanup().catch(err => {
      console.error(`Unable to cleanup automation queue initially - ${err}`)
    })
  }
  return queue
}

exports.shutdown = async () => {
  if (QUEUES.length) {
    clearInterval(cleanupInterval)
    for (let queue of QUEUES) {
      await queue.close()
    }
    QUEUES = []
  }
  console.log("Queues shutdown")
}
