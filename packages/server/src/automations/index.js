const { processEvent } = require("./utils")
const { queue } = require("./bullboard")

/**
 * This module is built purely to kick off the worker farm and manage the inputs/outputs
 */
exports.init = function () {
  // this promise will not complete
  return queue.process(async job => {
    await processEvent(job)
  })
}

exports.getQueues = () => {
  return [queue]
}
exports.queue = queue
