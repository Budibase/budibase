const triggers = require("./triggers")
const { processEvent } = require("./utils")

/**
 * This module is built purely to kick off the worker farm and manage the inputs/outputs
 */
exports.init = async function () {
  // don't wait this promise, it'll never end
  triggers.automationQueue.process(async job => {
    await processEvent(job)
  })
}
