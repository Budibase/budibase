const env = require("../environment")
const workerFarm = require("worker-farm")
const { getAPIKey, update, Properties } = require("../utilities/usageQuota")
const singleThread = require("./thread")

let workers = workerFarm(require.resolve("./thread"))

function runWorker(job) {
  return new Promise((resolve, reject) => {
    workers(job, (err, output) => {
      if (err) {
        reject(err)
      } else {
        resolve(output)
      }
    })
  })
}

function runSingleThread(job) {
  return new Promise((resolve, reject) => {
    singleThread(job, (err, output) => {
      if (err) {
        reject(err)
      } else {
        resolve(output)
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

exports.processEvent = async job => {
  try {
    if (env.USE_QUOTAS) {
      job.data.automation.apiKey = await updateQuota(job.data.automation)
    }
    if (!env.isProd()) {
      return runSingleThread(job)
    } else {
      return runWorker(job)
    }
  } catch (err) {
    console.error(
      `${job.data.automation.appId} automation ${job.data.automation._id} was unable to run - ${err}`
    )
    return err
  }
}
