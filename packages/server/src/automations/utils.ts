import { Thread, ThreadType } from "../threads"
import { definitions } from "./triggerInfo"
import { automationQueue } from "./bullboard"
import newid from "../db/newid"
import { updateEntityMetadata } from "../utilities"
import { MetadataTypes } from "../constants"
import { db as dbCore, context } from "@budibase/backend-core"
import { getAutomationMetadataParams } from "../db/utils"
import { cloneDeep } from "lodash/fp"
import { quotas } from "@budibase/pro"
import {
  Automation,
  AutomationJob,
  Webhook,
  WebhookActionType,
} from "@budibase/types"
import sdk from "../sdk"
import { automationsEnabled } from "../features"

const REBOOT_CRON = "@reboot"
const WH_STEP_ID = definitions.WEBHOOK.stepId
const CRON_STEP_ID = definitions.CRON.stepId
let Runner: Thread
if (automationsEnabled()) {
  Runner = new Thread(ThreadType.AUTOMATION)
}

function loggingArgs(job: AutomationJob) {
  return [
    {
      _logKey: "automation",
      trigger: job.data.automation.definition.trigger.event,
    },
    {
      _logKey: "bull",
      jobId: job.id,
    },
  ]
}

export async function processEvent(job: AutomationJob) {
  const appId = job.data.event.appId!
  const automationId = job.data.automation._id!
  const task = async () => {
    try {
      // need to actually await these so that an error can be captured properly
      console.log("automation running", ...loggingArgs(job))

      const runFn = () => Runner.run(job)
      const result = await quotas.addAutomation(runFn, {
        automationId,
      })
      console.log("automation completed", ...loggingArgs(job))
      return result
    } catch (err) {
      console.error(`automation was unable to run`, err, ...loggingArgs(job))
      return { err }
    }
  }

  return await context.doInAutomationContext({ appId, automationId, task })
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
  const jobs = await automationQueue.getRepeatableJobs()
  for (let job of jobs) {
    if (job.key.includes(`${appId}_cron`)) {
      promises.push(automationQueue.removeRepeatableByKey(job.key))
      if (job.id) {
        promises.push(automationQueue.removeJobs(job.id))
      }
    }
  }
  const results = await Promise.all(promises)
  return { count: results.length / 2 }
}

export async function disableCronById(jobId: number | string) {
  const repeatJobs = await automationQueue.getRepeatableJobs()
  for (let repeatJob of repeatJobs) {
    if (repeatJob.id === jobId) {
      await automationQueue.removeRepeatableByKey(repeatJob.key)
    }
  }
  console.log(`jobId=${jobId} disabled`)
}

export async function clearMetadata() {
  const db = context.getProdAppDB()
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

export function isCronTrigger(auto: Automation) {
  return (
    auto &&
    auto.definition.trigger &&
    auto.definition.trigger.stepId === CRON_STEP_ID
  )
}

export function isRebootTrigger(auto: Automation) {
  const trigger = auto ? auto.definition.trigger : null
  return isCronTrigger(auto) && trigger?.inputs.cron === REBOOT_CRON
}

/**
 * This function handles checking of any cron jobs that need to be enabled/updated.
 * @param {string} appId The ID of the app in which we are checking for webhooks
 * @param {object|undefined} automation The automation object to be updated.
 */
export async function enableCronTrigger(appId: any, automation: Automation) {
  const trigger = automation ? automation.definition.trigger : null
  let enabled = false

  // need to create cron job
  if (
    isCronTrigger(automation) &&
    !isRebootTrigger(automation) &&
    trigger?.inputs.cron
  ) {
    // make a job id rather than letting Bull decide, makes it easier to handle on way out
    const jobId = `${appId}_cron_${newid()}`
    const job: any = await automationQueue.add(
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
    await dbCore.doWithDB(appId, async (db: any) => {
      const response = await db.put(automation)
      automation._id = response.id
      automation._rev = response.rev
    })
    enabled = true
  }
  return { enabled, automation }
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
  const appId = context.getAppId()
  if (!appId) {
    throw new Error("Unable to check webhooks - no app ID in context.")
  }
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
      const db = context.getAppDB()
      // need to get the webhook to get the rev
      const webhook = await db.get<Webhook>(oldTrigger.webhookId)
      // might be updating - reset the inputs to remove the URLs
      if (newTrigger) {
        delete newTrigger.webhookId
        newTrigger.inputs = {}
      }
      await sdk.automations.webhook.destroy(webhook._id!, webhook._rev!)
    } catch (err) {
      // don't worry about not being able to delete, if it doesn't exist all good
    }
  }
  // need to create webhook
  if (
    (!isWebhookTrigger(oldAuto) || triggerChanged) &&
    isWebhookTrigger(newAuto)
  ) {
    const webhook = await sdk.automations.webhook.save(
      sdk.automations.webhook.newDoc(
        "Automation webhook",
        WebhookActionType.AUTOMATION,
        newAuto._id
      )
    )
    const id = webhook._id
    newTrigger.webhookId = id
    // the app ID has to be development for this endpoint
    // it can only be used when building the app
    // but the trigger endpoint will always be used in production
    const prodAppId = dbCore.getProdAppID(appId)
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
