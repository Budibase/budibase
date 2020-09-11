const triggers = require("./triggers")
const workerFarm = require("worker-farm")
const CouchDB = require("../db/client")
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
    if (CouchDB.preferredAdapters != null && CouchDB.preferredAdapters[0] !== "leveldb") {
      await runWorker(job)
    } else {
      await singleThread(job)
    }
  })
}
