import events from "events"
import { timeout } from "../utils"

/**
 * Bull works with a Job wrapper around all messages that contains a lot more information about
 * the state of the message, this object constructor implements the same schema of Bull jobs
 * for the sake of maintaining API consistency.
 * @param {string} queue The name of the queue which the message will be carried on.
 * @param {object} message The JSON message which will be passed back to the consumer.
 * @returns {Object} A new job which can now be put onto the queue, this is mostly an
 * internal structure so that an in memory queue can be easily swapped for a Bull queue.
 */
function newJob(queue: string, message: any) {
  return {
    timestamp: Date.now(),
    queue: queue,
    data: message,
  }
}

/**
 * This is designed to replicate Bull (https://github.com/OptimalBits/bull) in memory as a sort of mock.
 * It is relatively simple, using an event emitter internally to register when messages are available
 * to the consumers - in can support many inputs and many consumers.
 */
class InMemoryQueue {
  _name: string
  _opts?: any
  _messages: any[]
  _emitter: EventEmitter
  _runCount: number
  _addCount: number
  /**
   * The constructor the queue, exactly the same as that of Bulls.
   * @param {string} name The name of the queue which is being configured.
   * @param {object|null} opts This is not used by the in memory queue as there is no real use
   * case when in memory, but is the same API as Bull
   */
  constructor(name: string, opts = null) {
    this._name = name
    this._opts = opts
    this._messages = []
    this._emitter = new events.EventEmitter()
    this._runCount = 0
    this._addCount = 0
  }

  /**
   * Same callback API as Bull, each callback passed to this will consume messages as they are
   * available. Please note this is a queue service, not a notification service, so each
   * consumer will receive different messages.
   * @param {function<object>} func The callback function which will return a "Job", the same
   * as the Bull API, within this job the property "data" contains the JSON message. Please
   * note this is incredibly limited compared to Bull as in reality the Job would contain
   * a lot more information about the queue and current status of Bull cluster.
   */
  process(func: any) {
    this._emitter.on("message", async () => {
      if (this._messages.length <= 0) {
        return
      }
      let msg = this._messages.shift()
      let resp = func(msg)
      if (resp.then != null) {
        await resp
      }
      this._runCount++
    })
  }

  // simply puts a message to the queue and emits to the queue for processing
  /**
   * Simple function to replicate the add message functionality of Bull, putting
   * a new message on the queue. This then emits an event which will be used to
   * return the message to a consumer (if one is attached).
   * @param {object} msg A message to be transported over the queue, this should be
   * a JSON message as this is required by Bull.
   * @param {boolean} repeat serves no purpose for the import queue.
   */
  // eslint-disable-next-line no-unused-vars
  add(msg: any, repeat: boolean) {
    if (typeof msg !== "object") {
      throw "Queue only supports carrying JSON."
    }
    this._messages.push(newJob(this._name, msg))
    this._addCount++
    this._emitter.emit("message")
  }

  /**
   * replicating the close function from bull, which waits for jobs to finish.
   */
  async close() {
    return []
  }

  /**
   * This removes a cron which has been implemented, this is part of Bull API.
   * @param {string} cronJobId The cron which is to be removed.
   */
  removeRepeatableByKey(cronJobId: string) {
    // TODO: implement for testing
    console.log(cronJobId)
  }

  /**
   * Implemented for tests
   */
  getRepeatableJobs() {
    return []
  }

  // eslint-disable-next-line no-unused-vars
  removeJobs(pattern: string) {
    // no-op
  }

  /**
   * Implemented for tests
   */
  async clean() {
    return []
  }

  async getJob() {
    return {}
  }

  on() {
    // do nothing
    return this
  }

  async waitForCompletion() {
    do {
      await timeout(50)
    } while (this._addCount < this._runCount)
  }
}

export default InMemoryQueue
