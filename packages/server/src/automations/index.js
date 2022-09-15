const { processEvent } = require("./utils")
const { queue, shutdown } = require("./bullboard")
const { TRIGGER_DEFINITIONS, rebootTrigger } = require("./triggers")
const { ACTION_DEFINITIONS } = require("./actions")

/**
 * This module is built purely to kick off the worker farm and manage the inputs/outputs
 */
exports.init = async function () {
  // this promise will not complete
  const promise = queue.process(async job => {
    await processEvent(job)
  })
  // on init we need to trigger any reboot automations
  await rebootTrigger()
  return promise
}

exports.getQueues = () => {
  return [queue]
}

exports.shutdown = () => {
  return shutdown()
}

exports.queue = queue
exports.TRIGGER_DEFINITIONS = TRIGGER_DEFINITIONS
exports.ACTION_DEFINITIONS = ACTION_DEFINITIONS
