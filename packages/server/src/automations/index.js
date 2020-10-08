const triggers = require("./triggers")
const actions = require("./actions")
const environment = require("../environment")
const workerFarm = require("worker-farm")
const singleThread = require("./thread")
const { getAPIKey, update, Properties } = require("../utilities/usageQuota")

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

async function updateQuota(automation) {
  const appId = automation.appId
  const apiObj = await getAPIKey(appId)
  // this will fail, causing automation to escape if limits reached
  await update(apiObj.apiKey, Properties.AUTOMATION, 1)
  return apiObj.apiKey
}

/**
 * This module is built purely to kick off the worker farm and manage the inputs/outputs
 */
module.exports.init = function() {
  actions.init().then(() => {
    triggers.automationQueue.process(async job => {
      try {
        if (environment.CLOUD && job.data.automation) {
          job.data.automation.apiKey = await updateQuota(job.data.automation)
        }
        if (environment.BUDIBASE_ENVIRONMENT === "PRODUCTION") {
          await runWorker(job)
        } else {
          await singleThread(job)
        }
      } catch (err) {
        console.error(
          `${job.data.automation.appId} automation ${job.data.automation._id} was unable to run - ${err}`
        )
      }
    })
  })
}
