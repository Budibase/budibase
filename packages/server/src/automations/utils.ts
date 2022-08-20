import { Thread, ThreadType } from "../threads"
import { definitions } from "./triggerInfo"
import * as webhooks from "../api/controllers/webhook"
import { queue } from "./bullboard"
import newid from "../db/newid"
import { updateEntityMetadata } from "../utilities"
import { MetadataTypes, WebhookType } from "../constants"
import { getProdAppID, doWithDB } from "@budibase/backend-core/db"
import { getAutomationMetadataParams } from "../db/utils"
import { cloneDeep } from "lodash/fp"
import {
  getAppDB,
  getAppId,
  getProdAppDB,
} from "@budibase/backend-core/context"
import { tenancy } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { Automation } from "@budibase/types"

const WH_STEP_ID = definitions.WEBHOOK.stepId
const CRON_STEP_ID = definitions.CRON.stepId
const Runner = new Thread(ThreadType.AUTOMATION)

const jobMessage = (job: any, message: string) => {
  return `app=${job.data.event.appId} automation=${job.data.automation._id} jobId=${job.id} trigger=${job.data.automation.definition.trigger.event} : ${message}`
}

export async function processEvent(job: any) {
  try {
    console.log(jobMessage(job, "running"))
    // need to actually await these so that an error can be captured properly
    const tenantId = tenancy.getTenantIDFromAppID(job.data.event.appId)
    return await tenancy.doInTenant(tenantId, async () => {
      const runFn = () => Runner.run(job)
      return quotas.addAutomation(runFn)
    })
  } catch (err) {
    const errJson = JSON.stringify(err)
    console.error(jobMessage(job, `was unable to run - ${errJson}`))
    console.trace(err)
    return { err }
  }
}

export async function updateTestHistory(
  appId: any,
  automation: any,
  history: any
) {
  return updateEntityMetadata(
    MetadataTypes.AUTOMATION_TEST_HISTORY,
    automation._id,
    (metadata: any) => {
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

export function removeDeprecated(definitions: any) {
  const base = cloneDeep(definitions)
  for (let key of Object.keys(base)) {
    if (base[key].deprecated) {
      delete base[key]
    }
  }
  return base
}

// end the repetition and the job itself
export async function disableAllCrons(appId: any) {
  const promises = []
  const jobs = await queue.getRepeatableJobs()
  for (let job of jobs) {
    if (job.key.includes(`${appId}_cron`)) {
      promises.push(queue.removeRepeatableByKey(job.key))
      if (job.id) {
        promises.push(queue.removeJobs(job.id))
      }
    }
  }
  return Promise.all(promises)
}

export async function disableCron(jobId: string, jobKey: string) {
  await queue.removeRepeatableByKey(jobKey)
  await queue.removeJobs(jobId)
  console.log(`jobId=${jobId} disabled`)
}

export async function clearMetadata() {
  const db = getProdAppDB()
  const automationMetadata = (
    await db.allDocs(
      getAutomationMetadataParams({
        include_docs: true,
      })
    )
  ).rows.map((row: any) => row.doc)
  for (let metadata of automationMetadata) {
    metadata._deleted = true
  }
  await db.bulkDocs(automationMetadata)
}

/**
 * This function handles checking of any cron jobs that need to be enabled/updated.
 * @param {string} appId The ID of the app in which we are checking for webhooks
 * @param {object|undefined} automation The automation object to be updated.
 */
export async function enableCronTrigger(appId: any, automation: any) {
  const trigger = automation ? automation.definition.trigger : null
  function isCronTrigger(auto: any) {
    return (
      auto &&
      auto.definition.trigger &&
      auto.definition.trigger.stepId === CRON_STEP_ID
    )
  }
  // need to create cron job
  if (isCronTrigger(automation) && trigger?.inputs.cron) {
    // make a job id rather than letting Bull decide, makes it easier to handle on way out
    const jobId = `${appId}_cron_${newid()}`
    const job: any = await queue.add(
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
    await doWithDB(appId, async (db: any) => {
      const response = await db.put(automation)
      automation._id = response.id
      automation._rev = response.rev
    })
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
export async function checkForWebhooks({ oldAuto, newAuto }: any) {
  const appId = getAppId()
  const oldTrigger = oldAuto ? oldAuto.definition.trigger : null
  const newTrigger = newAuto ? newAuto.definition.trigger : null
  const triggerChanged =
    oldTrigger && newTrigger && oldTrigger.id !== newTrigger.id
  function isWebhookTrigger(auto: any) {
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
    const ctx: any = {
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
export async function cleanupAutomations(appId: any) {
  await disableAllCrons(appId)
}

/**
 * Checks if the supplied automation is of a recurring type.
 * @param automation The automation to check.
 * @return {boolean} if it is recurring (cron).
 */
export function isRecurring(automation: Automation) {
  return automation.definition.trigger.stepId === definitions.CRON.stepId
}

export function isErrorInOutput(output: {
  steps: { outputs?: { success: boolean } }[]
}) {
  let first = true,
    error = false
  for (let step of output.steps) {
    // skip the trigger, its always successful if automation ran
    if (first) {
      first = false
      continue
    }
    if (!step.outputs?.success) {
      error = true
    }
  }
  return error
}
