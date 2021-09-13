const env = require("../environment")
const workerFarm = require("worker-farm")
const { getAPIKey, update, Properties } = require("../utilities/usageQuota")
const singleThread = require("./thread")
const { definitions } = require("./triggerInfo")
const webhooks = require("../api/controllers/webhook")
const CouchDB = require("../db")
const { queue } = require("./bullboard")
const newid = require("../db/newid")
const { updateEntityMetadata } = require("../utilities")
const { MetadataTypes } = require("../constants")

const WH_STEP_ID = definitions.WEBHOOK.stepId
const CRON_STEP_ID = definitions.CRON.stepId

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
    // need to actually await these so that an error can be captured properly
    let response
    if (!env.isProd()) {
      response = await runSingleThread(job)
    } else {
      response = await runWorker(job)
    }
    return response
  } catch (err) {
    console.error(
      `${job.data.automation.appId} automation ${job.data.automation._id} was unable to run - ${err}`
    )
    return { err }
  }
}

exports.updateTestHistory = async (appId, automation, history) => {
  return updateEntityMetadata(
    appId,
    MetadataTypes.AUTOMATION_TEST_HISTORY,
    automation._id,
    metadata => {
      if (metadata && Array.isArray(metadata.history)) {
        metadata.history.push(history)
      } else {
        metadata = {
          history: [history],
        }
      }
      return metadata
    }
  )
}

// end the repetition and the job itself
exports.disableAllCrons = async appId => {
  const promises = []
  const jobs = await queue.getRepeatableJobs()
  for (let job of jobs) {
    if (job.key.includes(`${appId}_cron`)) {
      promises.push(queue.removeRepeatableByKey(job.key))
      promises.push(queue.removeJobs(job.id))
    }
  }
  return Promise.all(promises)
}

/**
 * This function handles checking of any cron jobs that need to be enabled/updated.
 * @param {string} appId The ID of the app in which we are checking for webhooks
 * @param {object|undefined} automation The automation object to be updated.
 */
exports.enableCronTrigger = async (appId, automation) => {
  const trigger = automation ? automation.definition.trigger : null
  function isCronTrigger(auto) {
    return (
      auto &&
      auto.definition.trigger &&
      auto.definition.trigger.stepId === CRON_STEP_ID
    )
  }
  // need to create cron job
  if (isCronTrigger(automation)) {
    // make a job id rather than letting Bull decide, makes it easier to handle on way out
    const jobId = `${appId}_cron_${newid()}`
    const job = await queue.add(
      {
        automation,
        event: { appId, timestamp: Date.now() },
      },
      { repeat: { cron: trigger.inputs.cron }, jobId }
    )
    // Assign cron job ID from bull so we can remove it later if the cron trigger is removed
    trigger.cronJobId = job.id
    const db = new CouchDB(appId)
    const response = await db.put(automation)
    automation._id = response.id
    automation._rev = response.rev
  }
  return automation
}

/**
 * This function handles checking if any webhooks need to be created or deleted for automations.
 * @param {string} appId The ID of the app in which we are checking for webhooks
 * @param {object|undefined} oldAuto The old automation object if updating/deleting
 * @param {object|undefined} newAuto The new automation object if creating/updating
 * @returns {Promise<object|undefined>} After this is complete the new automation object may have been updated and should be
 * written to DB (this does not write to DB as it would be wasteful to repeat).
 */
exports.checkForWebhooks = async ({ appId, oldAuto, newAuto }) => {
  const oldTrigger = oldAuto ? oldAuto.definition.trigger : null
  const newTrigger = newAuto ? newAuto.definition.trigger : null
  const triggerChanged =
    oldTrigger && newTrigger && oldTrigger.id !== newTrigger.id
  function isWebhookTrigger(auto) {
    return (
      auto &&
      auto.definition.trigger &&
      auto.definition.trigger.stepId === WH_STEP_ID
    )
  }
  // need to delete webhook
  if (
    isWebhookTrigger(oldAuto) &&
    (!isWebhookTrigger(newAuto) || triggerChanged) &&
    oldTrigger.webhookId
  ) {
    try {
      let db = new CouchDB(appId)
      // need to get the webhook to get the rev
      const webhook = await db.get(oldTrigger.webhookId)
      const ctx = {
        appId,
        params: { id: webhook._id, rev: webhook._rev },
      }
      // might be updating - reset the inputs to remove the URLs
      if (newTrigger) {
        delete newTrigger.webhookId
        newTrigger.inputs = {}
      }
      await webhooks.destroy(ctx)
    } catch (err) {
      // don't worry about not being able to delete, if it doesn't exist all good
    }
  }
  // need to create webhook
  if (
    (!isWebhookTrigger(oldAuto) || triggerChanged) &&
    isWebhookTrigger(newAuto)
  ) {
    const ctx = {
      appId,
      request: {
        body: new webhooks.Webhook(
          "Automation webhook",
          webhooks.WebhookType.AUTOMATION,
          newAuto._id
        ),
      },
    }
    await webhooks.save(ctx)
    const id = ctx.body.webhook._id
    newTrigger.webhookId = id
    newTrigger.inputs = {
      schemaUrl: `api/webhooks/schema/${appId}/${id}`,
      triggerUrl: `api/webhooks/trigger/${appId}/${id}`,
    }
  }
  return newAuto
}
