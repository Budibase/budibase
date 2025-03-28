import env from "../environment"
import { getRedisOptions } from "../redis/utils"
import { JobQueue } from "./constants"
import InMemoryQueue from "./inMemoryQueue"
import BullQueue, { Queue, QueueOptions, JobOptions, Job } from "bull"
import { addListeners, StalledFn } from "./listeners"
import { Duration } from "../utils"
import * as timers from "../timers"
import tracer from "dd-trace"
import sizeof from "object-sizeof"

export type { QueueOptions, Queue, JobOptions } from "bull"

// the queue lock is held for 5 minutes
const QUEUE_LOCK_MS = Duration.fromMinutes(5).toMs()
// queue lock is refreshed every 30 seconds
const QUEUE_LOCK_RENEW_INTERNAL_MS = Duration.fromSeconds(30).toMs()
// cleanup the queue every 60 seconds
const CLEANUP_PERIOD_MS = Duration.fromSeconds(60).toMs()
let QUEUES: Queue[] = []
let cleanupInterval: NodeJS.Timeout

async function cleanup() {
  for (let queue of QUEUES) {
    await queue.clean(CLEANUP_PERIOD_MS, "completed")
    await queue.clean(CLEANUP_PERIOD_MS, "failed")
  }
}

async function withMetrics<T>(
  name: string,
  cb: () => Promise<T>,
  tags?: Record<string, string | number>
): Promise<T> {
  const start = performance.now()
  try {
    const result = await cb()
    tracer.dogstatsd.increment(`${name}.success`, 1, tags)
    return result
  } catch (err) {
    tracer.dogstatsd.increment(`${name}.error`, 1, tags)
    throw err
  } finally {
    const durationMs = performance.now() - start
    tracer.dogstatsd.distribution(`${name}.duration.ms`, durationMs, tags)
    tracer.dogstatsd.increment(name, 1, tags)
  }
}

function jobOptsTags(opts: JobOptions) {
  return {
    "job.opts.attempts": opts.attempts,
    "job.opts.backoff": opts.backoff,
    "job.opts.delay": opts.delay,
    "job.opts.jobId": opts.jobId,
    "job.opts.lifo": opts.lifo,
    "job.opts.preventParsingData": opts.preventParsingData,
    "job.opts.priority": opts.priority,
    "job.opts.removeOnComplete": opts.removeOnComplete,
    "job.opts.removeOnFail": opts.removeOnFail,
    "job.opts.repeat": opts.repeat,
    "job.opts.stackTraceLimit": opts.stackTraceLimit,
    "job.opts.timeout": opts.timeout,
  }
}

function jobTags(job: Job) {
  return {
    "job.id": job.id,
    "job.attemptsMade": job.attemptsMade,
    "job.timestamp": job.timestamp,
    "job.data.sizeBytes": sizeof(job.data),
    ...jobOptsTags(job.opts || {}),
  }
}

export interface BudibaseQueueOpts<T> {
  removeStalledCb?: StalledFn
  maxStalledCount?: number
  jobOptions?: JobOptions
  jobTags?: (job: T) => Record<string, any>
}

export class BudibaseQueue<T> {
  private queue: Queue<T>
  private opts: BudibaseQueueOpts<T>
  private jobQueue: JobQueue

  constructor(jobQueue: JobQueue, opts: BudibaseQueueOpts<T> = {}) {
    this.opts = opts
    this.jobQueue = jobQueue
    this.queue = this.initQueue()
  }

  private initQueue() {
    const redisOpts = getRedisOptions()
    const queueConfig: QueueOptions = {
      redis: redisOpts,
      settings: {
        maxStalledCount: this.opts.maxStalledCount
          ? this.opts.maxStalledCount
          : 0,
        lockDuration: QUEUE_LOCK_MS,
        lockRenewTime: QUEUE_LOCK_RENEW_INTERNAL_MS,
      },
    }
    if (this.opts.jobOptions) {
      queueConfig.defaultJobOptions = this.opts.jobOptions
    }
    let queue: Queue<T>
    if (!env.isTest()) {
      queue = new BullQueue(this.jobQueue, queueConfig)
    } else if (
      process.env.BULL_TEST_REDIS_PORT &&
      !isNaN(+process.env.BULL_TEST_REDIS_PORT)
    ) {
      queue = new BullQueue(this.jobQueue, {
        redis: { host: "localhost", port: +process.env.BULL_TEST_REDIS_PORT },
      })
    } else {
      queue = new InMemoryQueue(this.jobQueue, queueConfig) as any
    }

    addListeners(queue, this.jobQueue, this.opts.removeStalledCb)
    QUEUES.push(queue)
    if (!cleanupInterval && !env.isTest()) {
      cleanupInterval = timers.set(cleanup, CLEANUP_PERIOD_MS)
      // fire off an initial cleanup
      cleanup().catch(err => {
        console.error(`Unable to cleanup ${this.jobQueue} initially - ${err}`)
      })
    }
    return queue
  }

  getBullQueue() {
    return this.queue
  }

  process(
    concurrency: number,
    cb: (job: Job<T>) => Promise<void>
  ): Promise<void>
  process(cb: (job: Job<T>) => Promise<void>): Promise<void>
  process(...args: any[]) {
    let concurrency: number | undefined = undefined
    let cb: (job: Job<T>) => Promise<void>
    if (args.length === 2) {
      concurrency = args[0]
      cb = args[1]
    } else {
      cb = args[0]
    }

    const wrappedCb = async (job: Job<T>) => {
      await tracer.trace("queue.process", async span => {
        // @ts-expect-error monkey patching the parent span id
        if (job.data._parentSpanContext) {
          // @ts-expect-error monkey patching the parent span id
          const parentContext = job.data._parentSpanContext
          const parent = {
            traceId: parentContext.traceId,
            spanId: parentContext.spanId,
            toTraceId: () => parentContext.traceId,
            toSpanId: () => parentContext.spanId,
            toTraceparent: () => "",
          }
          span.addLink(parent)
        }
        span.addTags({ "queue.name": this.jobQueue, ...jobTags(job) })
        if (this.opts.jobTags) {
          span.addTags(this.opts.jobTags(job.data))
        }

        tracer.dogstatsd.distribution(
          "queue.process.sizeBytes",
          sizeof(job.data),
          this.metricTags()
        )
        await this.withMetrics("queue.process", () => cb(job))
      })
    }

    if (concurrency) {
      return this.queue.process(concurrency, wrappedCb)
    } else {
      return this.queue.process(wrappedCb)
    }
  }

  async add(data: T, opts?: JobOptions): Promise<Job<T>> {
    return await tracer.trace("queue.add", async span => {
      span.addTags({
        "queue.name": this.jobQueue,
        "job.data.sizeBytes": sizeof(data),
        ...jobOptsTags(opts || {}),
      })
      if (this.opts.jobTags) {
        span.addTags(this.opts.jobTags(data))
      }
      // @ts-expect-error monkey patching the parent span id
      data._parentSpanContext = {
        traceId: span.context().toTraceId(),
        spanId: span.context().toSpanId(),
      }

      tracer.dogstatsd.distribution(
        "queue.add.sizeBytes",
        sizeof(data),
        this.metricTags()
      )
      return await this.withMetrics("queue.add", () =>
        this.queue.add(data, opts)
      )
    })
  }

  private withMetrics<T>(name: string, cb: () => Promise<T>) {
    return withMetrics(name, cb, this.metricTags())
  }

  private metricTags() {
    return { queueName: this.jobQueue }
  }

  close() {
    return this.queue.close()
  }
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
