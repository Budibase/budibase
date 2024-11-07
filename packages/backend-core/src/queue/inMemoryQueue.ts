import events from "events"
import { newid } from "../utils"
import { Queue, QueueOptions, JobOptions } from "./queue"

interface JobMessage {
  id: string
  timestamp: number
  queue: string
  data: any
  opts?: JobOptions
}

/**
 * Bull works with a Job wrapper around all messages that contains a lot more information about
 * the state of the message, this object constructor implements the same schema of Bull jobs
 * for the sake of maintaining API consistency.
 * @param queue The name of the queue which the message will be carried on.
 * @param message The JSON message which will be passed back to the consumer.
 * @returns A new job which can now be put onto the queue, this is mostly an
 * internal structure so that an in memory queue can be easily swapped for a Bull queue.
 */
function newJob(queue: string, message: any, opts?: JobOptions): JobMessage {
  return {
    id: newid(),
    timestamp: Date.now(),
    queue: queue,
    data: message,
    opts,
  }
}

/**
 * This is designed to replicate Bull (https://github.com/OptimalBits/bull) in memory as a sort of mock.
 * It is relatively simple, using an event emitter internally to register when messages are available
 * to the consumers - in can support many inputs and many consumers.
 */
class InMemoryQueue implements Partial<Queue> {
  _name: string
  _opts?: QueueOptions
  _messages: JobMessage[]
  _queuedJobIds: Set<string>
  _emitter: NodeJS.EventEmitter
  _runCount: number
  _addCount: number

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
    this._runCount = 0
    this._addCount = 0
    this._queuedJobIds = new Set<string>()
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
    func = typeof concurrencyOrFunc === "number" ? func : concurrencyOrFunc
    this._emitter.on("message", async () => {
      if (this._messages.length <= 0) {
        return
      }
      let msg = this._messages.shift()

      let resp = func(msg)

      async function retryFunc(fnc: any) {
        try {
          await fnc
        } catch (e: any) {
          await new Promise<void>(r => setTimeout(() => r(), 50))

          await retryFunc(func(msg))
        }
      }

      if (resp.then != null) {
        try {
          await retryFunc(resp)
        } catch (e: any) {
          console.error(e)
        }
      }
      this._runCount++
      const jobId = msg?.opts?.jobId?.toString()
      if (jobId && msg?.opts?.removeOnComplete) {
        this._queuedJobIds.delete(jobId)
      }
    })
  }

  async isReady() {
    return this as any
  }

  // simply puts a message to the queue and emits to the queue for processing
  /**
   * Simple function to replicate the add message functionality of Bull, putting
   * a new message on the queue. This then emits an event which will be used to
   * return the message to a consumer (if one is attached).
   * @param msg A message to be transported over the queue, this should be
   * a JSON message as this is required by Bull.
   * @param repeat serves no purpose for the import queue.
   */
  async add(data: any, opts?: JobOptions) {
    const jobId = opts?.jobId?.toString()
    if (jobId && this._queuedJobIds.has(jobId)) {
      console.log(`Ignoring already queued job ${jobId}`)
      return
    }

    if (typeof data !== "object") {
      throw "Queue only supports carrying JSON."
    }
    if (jobId) {
      this._queuedJobIds.add(jobId)
    }

    const pushMessage = () => {
      this._messages.push(newJob(this._name, data, opts))
      this._addCount++
      this._emitter.emit("message")
    }

    const delay = opts?.delay
    if (delay) {
      setTimeout(pushMessage, delay)
    } else {
      pushMessage()
    }
    return { id: jobId } as any
  }

  /**
   * replicating the close function from bull, which waits for jobs to finish.
   */
  async close() {}

  /**
   * This removes a cron which has been implemented, this is part of Bull API.
   * @param cronJobId The cron which is to be removed.
   */
  async removeRepeatableByKey(cronJobId: string) {
    // TODO: implement for testing
    console.log(cronJobId)
  }

  /**
   * Implemented for tests
   */
  async getRepeatableJobs() {
    return []
  }

  async removeJobs(_pattern: string) {
    // no-op
  }

  /**
   * Implemented for tests
   */
  async clean() {
    return []
  }

  async getJob() {
    return null
  }

  on() {
    // do nothing
    return this as any
  }
}

export default InMemoryQueue
