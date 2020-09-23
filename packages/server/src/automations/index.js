const triggers = require("./triggers")
const actions = require("./actions")
const environment = require("../environment")
const workerFarm = require("worker-farm")
const singleThread = require("./thread")

let workers = workerFarm(require.resolve("./thread"))

function runWorker(job) {
  return new Promise((resolve, reject) => {
    workers(job, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

/**
 * This module is built purely to kick off the worker farm and manage the inputs/outputs
 */
module.exports.init = function() {
  actions.init().then(() => {
    triggers.automationQueue.process(async job => {
      if (environment.BUDIBASE_ENVIRONMENT === "PRODUCTION") {
        await runWorker(job)
      } else {
        await singleThread(job)
      }
    })
  })
}
