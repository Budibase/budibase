let events = require("events")

// Bull works with a Job wrapper around all messages that contains a lot more information about
// the state of the message, implement this for the sake of maintaining API consistency
function newJob(queue, message) {
  return {
    timestamp: Date.now(),
    queue: queue,
    data: message,
  }
}

// designed to replicate Bull (https://github.com/OptimalBits/bull) in memory as a sort of mock
class InMemoryQueue {
  // opts is not used by this as there is no real use case when in memory, but is the same API as Bull
  constructor(name, opts) {
    this._name = name
    this._opts = opts
    this._messages = []
    this._emitter = new events.EventEmitter()
  }

  // same API as bull, provide a callback and it will respond when messages are available
  process(func) {
    this._emitter.on("message", async () => {
      if (this._messages.length <= 0) {
        return
      }
      let msg = this._messages.shift()
      let resp = func(msg)
      if (resp.then != null) {
        await resp
      }
    })
  }

  // simply puts a message to the queue and emits to the queue for processing
  add(msg) {
    this._messages.push(newJob(this._name, msg))
    this._emitter.emit("message")
  }
}

module.exports = InMemoryQueue
