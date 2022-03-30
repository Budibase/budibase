const { Thread, ThreadType } = require("../threads")
const { definitions } = require("./triggerInfo")
const webhooks = require("../api/controllers/webhook")
const CouchDB = require("../db")
const { queue } = require("./bullboard")
const newid = require("../db/newid")
const { updateEntityMetadata } = require("../utilities")
const { MetadataTypes, WebhookType } = require("../constants")
const { getProdAppID } = require("@budibase/backend-core/db")
const { cloneDeep } = require("lodash/fp")
const { getAppDB, getAppId } = require("@budibase/backend-core/context")

const WH_STEP_ID = definitions.WEBHOOK.stepId
const CRON_STEP_ID = definitions.CRON.stepId
const Runner = new Thread(ThreadType.AUTOMATION)

exports.processEvent = async job => {
  try {
    // need to actually await these so that an error can be captured properly
    console.log(
      `${job.data.automation.appId} automation ${job.data.automation._id} running`
    )
    return await Runner.run(job)
  } catch (err) {
    const errJson = JSON.stringify(err)
    console.error(
      `${job.data.automation.appId} automation ${job.data.automation._id} was unable to run - ${errJson}`
    )
    console.trace(err)
    return { err }
  }
}

exports.updateTestHistory = async (appId, automation, history) => {
  return updateEntityMetadata(
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

exports.removeDeprecated = definitions => {
  const base = cloneDeep(definitions)
  for (let key of Object.keys(base)) {
    if (base[key].deprecated) {
      delete base[key]
    }
  }
  return base
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
    // can't use getAppDB here as this is likely to be called from dev app,
    // but this call could be for dev app or prod app, need to just use what
    // was passed in
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
exports.checkForWebhooks = async ({ oldAuto, newAuto }) => {
  const appId = getAppId()
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
      let db = getAppDB()
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
          WebhookType.AUTOMATION,
          newAuto._id
        ),
      },
    }
    await webhooks.save(ctx)
    const id = ctx.body.webhook._id
    newTrigger.webhookId = id
    // the app ID has to be development for this endpoint
    // it can only be used when building the app
    // but the trigger endpoint will always be used in production
    const prodAppId = getProdAppID(appId)
    newTrigger.inputs = {
      schemaUrl: `api/webhooks/schema/${appId}/${id}`,
      triggerUrl: `api/webhooks/trigger/${prodAppId}/${id}`,
    }
  }
  return newAuto
}

/**
 * When removing an app/unpublishing it need to make sure automations are cleaned up (cron).
 * @param appId {string} the app that is being removed.
 * @return {Promise<void>} clean is complete if this succeeds.
 */
exports.cleanupAutomations = async appId => {
  await exports.disableAllCrons(appId)
}
