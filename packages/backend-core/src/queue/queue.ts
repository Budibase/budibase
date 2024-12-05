import env from "../environment"
import { getRedisOptions } from "../redis/utils"
import { JobQueue } from "./constants"
import InMemoryQueue from "./inMemoryQueue"
import BullQueue, { QueueOptions, JobOptions } from "bull"
import { addListeners, StalledFn } from "./listeners"
import { Duration } from "../utils"
import * as timers from "../timers"

export type { QueueOptions, Queue, JobOptions } from "bull"

// the queue lock is held for 5 minutes
const QUEUE_LOCK_MS = Duration.fromMinutes(5).toMs()
// queue lock is refreshed every 30 seconds
const QUEUE_LOCK_RENEW_INTERNAL_MS = Duration.fromSeconds(30).toMs()
// cleanup the queue every 60 seconds
const CLEANUP_PERIOD_MS = Duration.fromSeconds(60).toMs()
let QUEUES: BullQueue.Queue[] = []
let cleanupInterval: NodeJS.Timeout

async function cleanup() {
  for (let queue of QUEUES) {
    await queue.clean(CLEANUP_PERIOD_MS, "completed")
    await queue.clean(CLEANUP_PERIOD_MS, "failed")
  }
}

export function createQueue<T>(
  jobQueue: JobQueue,
  opts: {
    removeStalledCb?: StalledFn
    maxStalledCount?: number
    jobOptions?: JobOptions
  } = {}
): BullQueue.Queue<T> {
  const redisOpts = getRedisOptions()
  const queueConfig: QueueOptions = {
    redis: redisOpts,
    settings: {
      maxStalledCount: opts.maxStalledCount ? opts.maxStalledCount : 0,
      lockDuration: QUEUE_LOCK_MS,
      lockRenewTime: QUEUE_LOCK_RENEW_INTERNAL_MS,
    },
  }
  if (opts.jobOptions) {
    queueConfig.defaultJobOptions = opts.jobOptions
  }
  let queue: BullQueue.Queue<T>
  if (!env.isTest()) {
    queue = new BullQueue(jobQueue, queueConfig)
  } else if (
    process.env.BULL_TEST_REDIS_PORT &&
    !isNaN(+process.env.BULL_TEST_REDIS_PORT)
  ) {
    queue = new BullQueue(jobQueue, {
      redis: { host: "localhost", port: +process.env.BULL_TEST_REDIS_PORT },
    })
  } else {
    queue = new InMemoryQueue(jobQueue, queueConfig) as any
  }
  addListeners(queue, jobQueue, opts?.removeStalledCb)
  QUEUES.push(queue)
  if (!cleanupInterval && !env.isTest()) {
    cleanupInterval = timers.set(cleanup, CLEANUP_PERIOD_MS)
    // fire off an initial cleanup
    cleanup().catch(err => {
      console.error(`Unable to cleanup ${jobQueue} initially - ${err}`)
    })
  }
  return queue
}

export async function shutdown() {
  if (cleanupInterval) {
    timers.clear(cleanupInterval)
  }
  if (QUEUES.length) {
    for (let queue of QUEUES) {
      await queue.close()
    }
    QUEUES = []
  }
  console.log("Queues shutdown")
}
