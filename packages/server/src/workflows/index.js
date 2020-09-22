const triggers = require("./triggers")
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
  triggers.workflowQueue.process(async job => {
    if (environment.BUDIBASE_ENVIRONMENT === "PRODUCTION") {
      //await runWorker(job)
      await singleThread(job)
    } else {
      await singleThread(job)
    }
  })
}
