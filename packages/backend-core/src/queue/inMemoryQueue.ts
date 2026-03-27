import events from "events"
import { newid, timeout } from "../utils"
import { helpers } from "@budibase/shared-core"
import {
  Queue,
  QueueOptions,
  JobOptions,
  Job,
  JobId,
  JobInformation,
  DoneCallback,
} from "./types"
import cronParser from "cron-parser"

function jobToJobInformation(job: Job): JobInformation {
  let cron = ""
  let every = -1
  let tz: string | undefined = undefined
  let endDate: number | undefined = undefined

  const repeat = job.opts?.repeat
  if (repeat) {
    endDate = repeat.endDate ? new Date(repeat.endDate).getTime() : Date.now()
    tz = repeat.tz
    if ("cron" in repeat) {
      cron = repeat.cron || ""
    } else {
      every = repeat.every ?? -1
    }
  }

  return {
    id: job.id.toString(),
    name: "",
    key: job.id.toString(),
    tz,
    endDate,
    cron,
    every,
    next: 0,
  }
}

export interface TestQueueMessage<T = any>
  extends Pick<
    Job<T>,
    | "id"
    | "timestamp"
    | "queue"
    | "data"
    | "opts"
    | "discard"
    | "remove"
    | "attemptsMade"
    | "failedReason"
  > {
  manualTrigger?: boolean
  _isDiscarded?: boolean
}

/**
 * This is a lightweight in-memory queue used for tests and local execution.
 * memory as a sort of mock.  It is relatively simple, using an event emitter
 * internally to register when messages are available to the consumers - in can
 * support many inputs and many consumers.
 */
export class InMemoryQueue<T = any> implements Partial<Queue<T>> {
  _name: string
  _opts?: QueueOptions
  _messages: TestQueueMessage<T>[]
  _queuedJobIds: Set<string>
  _scheduledRepeatables: Map<string, NodeJS.Timeout>
  _scheduledDelayedJobs: Set<NodeJS.Timeout>
  _emitter: events.EventEmitter
  _processor?: (job: Job<T>, done?: DoneCallback) => Promise<void>
  _concurrency: number
  _runningCount: number
  _pending: TestQueueMessage<T>[]
  _paused: boolean
  _manualRepeatableJobs: boolean
  _runCount: number
  _addCount: number
  _completedResults: Map<string, any>
  _failedResults: Map<string, Error>

  /**
   * The constructor the queue, exactly the same as that of Bulls.
   * @param name The name of the queue which is being configured.
   * @param opts This is not used by the in memory queue as there is no real use
   * case when in memory, but is the same API as Bull
   */
  constructor(name: string, opts?: QueueOptions) {
    this._name = name
    this._opts = opts
    this._messages = []
    this._emitter = new events.EventEmitter()
    this._scheduledRepeatables = new Map()
    this._scheduledDelayedJobs = new Set()
    this._concurrency = 1
    this._runningCount = 0
    this._pending = []
    this._paused = false
    this._manualRepeatableJobs =
      opts?.manualRepeatableJobs ?? !!process.env.JEST_WORKER_ID
    this._runCount = 0
    this._addCount = 0
    this._queuedJobIds = new Set<string>()
    this._completedResults = new Map()
    this._failedResults = new Map()
  }

  get name() {
    return this._name
  }

  private withQueueRef<TJob extends object>(job: TJob): TJob {
    Object.defineProperty(job, "queue", {
      value: this as unknown as Queue<T>,
      enumerable: false,
      configurable: true,
      writable: true,
    })
    return job
  }

  /**
   * Same callback API as Bull, each callback passed to this will consume messages as they are
   * available. Please note this is a queue service, not a notification service, so each
   * consumer will receive different messages.
   * as the Bull API, within this job the property "data" contains the JSON message. Please
   * note this is incredibly limited compared to Bull as in reality the Job would contain
   * a lot more information about the queue and current status of Bull cluster.
   */
  async process(concurrencyOrFunc: number | any, func?: any) {
    this._concurrency =
      typeof concurrencyOrFunc === "number" ? concurrencyOrFunc : 1
    this._processor =
      typeof concurrencyOrFunc === "number" ? func : concurrencyOrFunc
    this.drain()
  }

  async isReady() {
    return true
  }

  /**
   * Simple function to replicate the add message functionality of Bull, putting
   * a new message on the queue. This then emits an event which will be used to
   * return the message to a consumer (if one is attached).
   * @param msg A message to be transported over the queue, this should be
   * a JSON message as this is required by Bull.
   * @param repeat serves no purpose for the import queue.
   */
  async add(data: T | string, optsOrT?: JobOptions | T) {
    if (typeof data === "string") {
      throw new Error("doesn't support named jobs")
    }

    const opts = {
      ...(this._opts?.defaultJobOptions || {}),
      ...((optsOrT as JobOptions) || {}),
    }

    const jobId = opts?.jobId?.toString()
    if (jobId && this._queuedJobIds.has(jobId)) {
      console.log(`Ignoring already queued job ${jobId}`)
      return {
        id: jobId,
        finished: async () => undefined,
        discard: async () => {},
        remove: async () => {},
      } as Job<T>
    }

    if (typeof data !== "object") {
      throw "Queue only supports carrying JSON."
    }
    if (jobId) {
      this._queuedJobIds.add(jobId)
    }

    const messageId = jobId || newid()
    const message = this.withQueueRef(
      {
        id: messageId,
        timestamp: Date.now(),
        data,
        opts,
        attemptsMade: 0,
        discard: async () => {
          message._isDiscarded = true
        },
        remove: async () => {
          this.removeMessageById(message.id)
        },
      } as TestQueueMessage<T>
    )
    this._messages.push(message)
    if (this._messages.length > 1000) {
      this._messages.shift()
    }
    this._addCount++
    this._emitter.emit("message", message)

    const isRepeatable = opts?.repeat != null

    if (isRepeatable) {
      if (!this._manualRepeatableJobs) {
        this.scheduleNextRepeat(message)
      }
    } else {
      let delayTimer: NodeJS.Timeout | undefined
      const pushMessage = () => {
        if (delayTimer) {
          this._scheduledDelayedJobs.delete(delayTimer)
        }
        this.enqueue(message)
      }
      const delay = opts?.delay
      if (delay) {
        delayTimer = setTimeout(pushMessage, delay)
        this._scheduledDelayedJobs.add(delayTimer)
      } else {
        this.enqueue(message)
      }
    }

    return this.withQueueRef({
      id: messageId,
      data,
      opts,
      timestamp: message.timestamp,
      attemptsMade: message.attemptsMade,
      discard: async () => {
        message._isDiscarded = true
      },
      remove: async () => {
        this.removeMessageById(message.id)
      },
      finished: () =>
        new Promise((resolve, reject) => {
          if (this._failedResults.has(messageId.toString())) {
            const err = this._failedResults.get(messageId.toString())
            this._failedResults.delete(messageId.toString())
            reject(err)
            return
          }
          if (this._completedResults.has(messageId.toString())) {
            const result = this._completedResults.get(messageId.toString())
            this._completedResults.delete(messageId.toString())
            resolve(result)
            return
          }

          const failedHandler = (job: Job<T>, error: Error) => {
            if (job.id?.toString() !== messageId.toString()) {
              return
            }
            this._emitter.off("failed", failedHandler)
            this._emitter.off("completed", completedHandler)
            reject(error)
          }

          const completedHandler = (job: Job<T>, result: any) => {
            if (job.id?.toString() !== messageId.toString()) {
              return
            }
            this._emitter.off("failed", failedHandler)
            this._emitter.off("completed", completedHandler)
            resolve(result)
          }

          this._emitter.on("failed", failedHandler)
          this._emitter.on("completed", completedHandler)
        }),
    } as Job<T>)
  }

  /**
   * Replicates queue shutdown by clearing scheduled jobs.
   */
  async close() {
    for (const timer of this._scheduledRepeatables.values()) {
      clearTimeout(timer)
    }
    this._scheduledRepeatables.clear()
    for (const timer of this._scheduledDelayedJobs) {
      clearTimeout(timer)
    }
    this._scheduledDelayedJobs.clear()
  }

  async removeRepeatableByKey(id: string) {
    const timer = this._scheduledRepeatables.get(id)
    if (timer) {
      clearTimeout(timer)
      this._scheduledRepeatables.delete(id)
    }
    for (const [idx, message] of this._messages.entries()) {
      if (message.id?.toString() === id.toString()) {
        this._messages.splice(idx, 1)
        const jobId = message.opts?.jobId?.toString()
        if (jobId) {
          this._queuedJobIds.delete(jobId)
        }
        this._emitter.emit("removed", message)
        return
      }
    }
  }

  async removeJobs(_pattern: string) {
    for (let idx = this._messages.length - 1; idx >= 0; idx--) {
      const message = this._messages[idx]
      if (message.id?.toString() === _pattern.toString()) {
        this._messages.splice(idx, 1)
        this._pending = this._pending.filter(
          p => p.id?.toString() !== _pattern.toString()
        )
        const timer = this._scheduledRepeatables.get(_pattern.toString())
        if (timer) {
          clearTimeout(timer)
          this._scheduledRepeatables.delete(_pattern.toString())
        }
        const jobId = message.opts?.jobId?.toString()
        if (jobId) {
          this._queuedJobIds.delete(jobId)
        }
      }
    }
  }

  /**
   * Implemented for tests
   */
  async clean() {
    this._emitter.emit("cleaned", [], "completed")
    return []
  }

  async getJob(id: JobId) {
    for (const message of this._messages) {
      if (message.id === id) {
        return message as Job<T>
      }
    }
    return null
  }

  manualTrigger(id: JobId) {
    for (const message of this._messages) {
      if (message.id === id) {
        this.enqueue(
          this.withQueueRef({
            ...message,
            manualTrigger: true,
          } as TestQueueMessage<T>)
        )
        return
      }
    }
    throw new Error(`Job with id ${id} not found`)
  }

  on(event: string, callback: (...args: any[]) => void): Queue {
    this._emitter.on(event, callback)
    return this as unknown as Queue
  }

  off(event: string, callback: (...args: any[]) => void): Queue {
    this._emitter.off(event, callback)
    return this as unknown as Queue
  }

  async count() {
    return this._messages.filter(message => !message.opts?.repeat).length
  }

  async getCompletedCount() {
    return this._runCount
  }

  async getRepeatableJobs() {
    return this._messages
      .filter(job => job.opts?.repeat != null)
      .map(job => jobToJobInformation(job as Job<T>))
  }

  async getWaiting(start = 0, end = this._pending.length - 1) {
    return this._pending.slice(start, end + 1) as Job<T>[]
  }

  async whenCurrentJobsFinished() {
    do {
      await timeout(50)
    } while (this.hasRunningJobs() || this._pending.length > 0)
  }

  private hasRunningJobs() {
    return this._runningCount > 0 || this._scheduledDelayedJobs.size > 0
  }

  async pause() {
    this._paused = true
    this._emitter.emit("paused")
  }

  async resume() {
    this._paused = false
    this._emitter.emit("resumed")
    this.drain()
  }

  private enqueue(message: TestQueueMessage<T>) {
    this._pending.push(message)
    this._emitter.emit("waiting", message.id)
    this.drain()
  }

  private drain() {
    if (!this._processor || this._paused) {
      return
    }

    while (
      this._runningCount < this._concurrency &&
      this._pending.length > 0 &&
      !this._paused
    ) {
      const message = this._pending.shift()
      if (!message) {
        return
      }
      this.executeMessage(message)
    }
  }

  private async executeMessage(message: TestQueueMessage<T>) {
    if (!this._processor) {
      return
    }

    this._runningCount++
    try {
      try {
        await this.executeWithRetry(message)
        this._runCount++
        if (!message.opts?.repeat) {
          this.removeMessageById(message.id)
        }
        this._emitter.emit("drained")
      } catch {
        // Failure state has already been emitted by executeWithRetry.
      }
    } finally {
      this._runningCount--
      this.drain()
    }
  }

  private async executeWithRetry(message: TestQueueMessage<T>) {
    const maxAttempts =
      message.opts?.attempts ?? this._opts?.defaultJobOptions?.attempts ?? 1
    const job = this.withQueueRef({
      ...message,
      attemptsMade: 0,
      discard: async () => {
        job._isDiscarded = true
      },
      remove: async () => {
        this.removeMessageById(job.id)
      },
    } as TestQueueMessage<T>)

    const execute = () => {
      if (!this._processor) {
        throw new Error("Queue processor not configured")
      }
      this._emitter.emit("active", job)
      if (this._processor.length <= 1) {
        return this._processor(job as Job<T>)
      }
      return new Promise((resolve, reject) => {
        const done: DoneCallback = (err?: Error | null, result?: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
        this._processor?.(job as Job<T>, done).catch(reject)
      })
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        job.attemptsMade = attempt
        const result = await execute()
        this._completedResults.set(job.id.toString(), result)
        this._failedResults.delete(job.id.toString())
        this._emitter.emit("completed", job, result)
        this.removeQueuedIdOnCompletion(job)
        return
      } catch (err: any) {
        job.failedReason = err?.message || `${err}`
        const isFinalAttempt = attempt + 1 >= maxAttempts
        if (!isFinalAttempt && !job._isDiscarded) {
          await helpers.wait(this.getRetryDelay(job, attempt + 1))
          continue
        }
        this._failedResults.set(job.id.toString(), err)
        this._completedResults.delete(job.id.toString())
        this._emitter.emit("failed", job, err)
        this._emitter.emit("error", err)
        this.removeQueuedIdOnFailure(job)
        throw err
      }
    }
  }

  private removeQueuedIdOnCompletion(job: TestQueueMessage<T>) {
    const jobId = job.opts?.jobId?.toString()
    if (jobId && job.opts?.removeOnComplete) {
      this._queuedJobIds.delete(jobId)
    }
  }

  private removeQueuedIdOnFailure(job: TestQueueMessage<T>) {
    const jobId = job.opts?.jobId?.toString()
    if (jobId && job.opts?.removeOnFail) {
      this._queuedJobIds.delete(jobId)
    }
    if (!job.opts?.repeat && job.opts?.removeOnFail !== false) {
      this.removeMessageById(job.id)
    }
  }

  private removeMessageById(id: JobId) {
    const idx = this._messages.findIndex(job => job.id?.toString() === `${id}`)
    if (idx !== -1) {
      this._messages.splice(idx, 1)
    }
    this._pending = this._pending.filter(job => job.id?.toString() !== `${id}`)
  }

  private getRetryDelay(job: TestQueueMessage<T>, attempt: number) {
    const backoff = job.opts?.backoff
    if (typeof backoff === "number") {
      return backoff
    }
    if (
      backoff &&
      typeof backoff === "object" &&
      backoff.type === "exponential"
    ) {
      const delay = backoff.delay || 100
      return delay * Math.max(1, attempt)
    }
    if (backoff && typeof backoff === "object" && backoff.delay) {
      return backoff.delay
    }
    return 100 * Math.max(1, attempt)
  }

  private scheduleNextRepeat(message: TestQueueMessage<T>) {
    const id = message.id.toString()
    const existing = this._scheduledRepeatables.get(id)
    if (existing) {
      clearTimeout(existing)
    }

    const delay = this.getNextRepeatDelay(message.opts)
    if (delay == null) {
      return
    }

    const timer = setTimeout(() => {
      this.enqueue(message)
      this.scheduleNextRepeat(message)
    }, delay)
    this._scheduledRepeatables.set(id, timer)
  }

  private getNextRepeatDelay(opts?: JobOptions): number | null {
    const repeat = opts?.repeat
    if (!repeat) {
      return null
    }

    if (typeof repeat.every === "number" && repeat.every > 0) {
      return repeat.every
    }

    if (repeat.cron) {
      const expression = cronParser.parseExpression(repeat.cron)
      const next = expression.next().getTime()
      return Math.max(0, next - Date.now())
    }

    return null
  }
}

export default InMemoryQueue
