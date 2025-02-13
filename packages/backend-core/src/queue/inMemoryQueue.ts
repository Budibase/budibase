import events from "events"
import { newid } from "../utils"
import { Queue, QueueOptions, JobOptions } from "./queue"
import { helpers } from "@budibase/shared-core"
import { Job, JobId, JobInformation } from "bull"

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
      cron = repeat.cron
    } else {
      every = repeat.every
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

interface JobMessage<T = any> extends Partial<Job<T>> {
  id: string
  timestamp: number
  queue: Queue<T>
  data: any
  opts?: JobOptions
}

/**
 * This is designed to replicate Bull (https://github.com/OptimalBits/bull) in
 * memory as a sort of mock.  It is relatively simple, using an event emitter
 * internally to register when messages are available to the consumers - in can
 * support many inputs and many consumers.
 */
class InMemoryQueue implements Partial<Queue> {
  _name: string
  _opts?: QueueOptions
  _messages: JobMessage[]
  _queuedJobIds: Set<string>
  _emitter: NodeJS.EventEmitter<{ message: [JobMessage]; completed: [Job] }>
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
    this._emitter.on("message", async message => {
      let resp = func(message)

      async function retryFunc(fnc: any) {
        try {
          await fnc
        } catch (e: any) {
          await helpers.wait(50)
          await retryFunc(func(message))
        }
      }

      if (resp.then != null) {
        try {
          await retryFunc(resp)
          this._emitter.emit("completed", message as Job)
        } catch (e: any) {
          console.error(e)
        }
      }
      this._runCount++
      const jobId = message.opts?.jobId?.toString()
      if (jobId && message.opts?.removeOnComplete) {
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
      const message: JobMessage = {
        id: newid(),
        timestamp: Date.now(),
        queue: this as unknown as Queue,
        data,
        opts,
      }
      this._messages.push(message)
      this._addCount++
      this._emitter.emit("message", message)
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

  async removeJobs(_pattern: string) {
    // no-op
  }

  /**
   * Implemented for tests
   */
  async clean() {
    return []
  }

  async getJob(id: JobId) {
    for (const message of this._messages) {
      if (message.id === id) {
        return message as Job
      }
    }
    return null
  }

  on(event: string, callback: (...args: any[]) => void): Queue {
    // @ts-expect-error - this callback can be one of many types
    this._emitter.on(event, callback)
    return this as unknown as Queue
  }

  off(event: string, callback: (...args: any[]) => void): Queue {
    // @ts-expect-error - this callback can be one of many types
    this._emitter.off(event, callback)
    return this as unknown as Queue
  }

  async count() {
    return this._messages.length
  }

  async getCompletedCount() {
    return this._runCount
  }

  async getRepeatableJobs() {
    return this._messages.map(job => jobToJobInformation(job as Job))
  }
}

export default InMemoryQueue
