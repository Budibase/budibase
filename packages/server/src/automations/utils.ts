import { context, db as dbCore, utils } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { helpers, REBOOT_CRON } from "@budibase/shared-core"
import {
  Automation,
  AutomationJob,
  CronTriggerInputs,
  isCronTrigger,
  isEmailTrigger,
  MetadataType,
  TestAutomationRequest,
} from "@budibase/types"
import { JobId } from "bull"
import tracer from "dd-trace"
import { getAutomationMetadataParams } from "../db/utils"
import { automationsEnabled } from "../features"
import { Thread, ThreadType } from "../threads"
import { updateEntityMetadata } from "../utilities"
import { automationQueue } from "./bullboard"
import { checkMail } from "./email"
import { cloneDeep } from "lodash"

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
  return tracer.trace("processEvent", async span => {
    const workspaceId = job.data.event.appId!
    const automationId = job.data.automation._id!

    span.addTags({
      appId: workspaceId,
      automationId,
      job: {
        id: job.id,
        name: job.name,
        attemptsMade: job.attemptsMade,
        attempts: job.opts.attempts,
        priority: job.opts.priority,
        delay: job.opts.delay,
        repeat: job.opts.repeat,
        backoff: job.opts.backoff,
        lifo: job.opts.lifo,
        timeout: job.opts.timeout,
        jobId: job.opts.jobId,
        removeOnComplete: job.opts.removeOnComplete,
        removeOnFail: job.opts.removeOnFail,
        stackTraceLimit: job.opts.stackTraceLimit,
        preventParsingData: job.opts.preventParsingData,
      },
    })

    const trigger = job.data.automation
      ? job.data.automation.definition.trigger
      : null

    const task = async () => {
      try {
        return await tracer.trace("task", async () => {
          if (isEmailTrigger(trigger)) {
            const { proceed, ...checkMailResult } = await checkMail(
              trigger,
              job.data.automation._id!
            )
            if (proceed === false) {
              return { skipped: true }
            }

            const { messages } = checkMailResult

            if (!messages) return { skipped: true }

            await Promise.all(
              messages?.map(async m => {
                const jobClone = cloneDeep(job)
                jobClone.data.event = { ...jobClone.data.event, ...m }
                const runFn = () => Runner.run(jobClone)
                await quotas.addAutomation(runFn, {
                  automationId,
                })
              })
            )
            return {}
          }
          const isCron = trigger && isCronTrigger(trigger)
          if (isCron && !job.data.event.timestamp) {
            // Requires the timestamp at run time
            job.data.event.timestamp = Date.now()
          }
          // need to actually await these so that an error can be captured properly
          console.log("automation running", ...loggingArgs(job))

          const runFn = () => Runner.run(job)
          const result = await quotas.addAutomation(runFn, { automationId })
          console.log("automation completed", ...loggingArgs(job))
          return result
        })
      } catch (err) {
        span.addTags({ error: true })
        console.error(`automation was unable to run`, err, ...loggingArgs(job))
        return { err }
      }
    }

    return await context.doInAutomationContext({
      workspaceId,
      automationId,
      task,
    })
  })
}

export async function updateTestHistory(
  automation: Automation,
  history: TestAutomationRequest & { occurredAt: number }
) {
  return updateEntityMetadata(
    MetadataType.AUTOMATION_TEST_HISTORY,
    automation._id as string,
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

// end the repetition and the job itself
export async function disableAllCrons(appId: string) {
  const promises = []
  const jobs = await automationQueue.getBullQueue().getRepeatableJobs()
  for (let job of jobs) {
    if (
      job.key.includes(`${appId}_cron`) ||
      job.key.includes(`${appId}_email`)
    ) {
      promises.push(
        automationQueue.getBullQueue().removeRepeatableByKey(job.key)
      )
      if (job.id) {
        promises.push(automationQueue.getBullQueue().removeJobs(job.id))
      }
    }
  }
  const results = await Promise.all(promises)
  return { count: results.length / 2 }
}

export async function disableCronById(jobId: JobId) {
  const jobs = await automationQueue.getBullQueue().getRepeatableJobs()
  for (const job of jobs) {
    if (job.id === jobId) {
      await automationQueue.getBullQueue().removeRepeatableByKey(job.key)
    }
  }
  console.log(`jobId=${jobId} disabled`)
}

export async function clearMetadata() {
  const db = context.getProdWorkspaceDB()
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

export function isRebootTrigger(auto: Automation) {
  const trigger = auto ? auto.definition.trigger : null
  const isCron = trigger && isCronTrigger(trigger)
  if (!isCron) {
    return false
  }
  const inputs = trigger?.inputs as CronTriggerInputs
  return inputs.cron === REBOOT_CRON
}

/**
 * This function handles checking of any cron or email jobs that need to be enabled/updated.
 * @param appId The ID of the app in which we are checking for webhooks
 * @param automation The automation object to be updated.
 */
export async function enableCronOrEmailTrigger(
  appId: string,
  automation: Automation
) {
  const trigger = automation ? automation.definition.trigger : null
  let enabled = false

  if (!trigger || automation.disabled || isRebootTrigger(automation)) {
    return { enabled, automation }
  }

  if (isCronTrigger(trigger)) {
    const inputs = trigger.inputs as CronTriggerInputs
    const cronExp = inputs.cron || ""
    const validation = helpers.cron.validate(cronExp)
    if (!validation.valid) {
      throw new Error(
        `Invalid automation CRON "${cronExp}" - ${validation.err.join(", ")}`
      )
    }

    const existingJobId = trigger.cronJobId
    const jobId = existingJobId || `${appId}_cron_${utils.newid()}`
    await automationQueue.add(
      {
        automation,
        event: { appId },
      },
      { repeat: { cron: cronExp }, jobId }
    )

    trigger.cronJobId = jobId

    await dbCore.doWithDB(appId, async db => {
      const response = await db.put(automation)
      automation._id = response.id
      automation._rev = response.rev
    })

    enabled = true
    return { enabled, automation }
  }

  if (isEmailTrigger(trigger)) {
    const existingJobId = trigger.cronJobId
    const jobId = existingJobId || `${appId}_email_${utils.newid()}`
    await automationQueue.add(
      {
        automation,
        event: { appId },
      },
      { repeat: { every: 30_000 }, jobId }
    )

    trigger.cronJobId = jobId

    if (trigger.cronJobId !== existingJobId) {
      await dbCore.doWithDB(appId, async db => {
        const response = await db.put(automation)
        automation._id = response.id
        automation._rev = response.rev
      })
    }

    enabled = true
    return { enabled, automation }
  }

  return { enabled, automation }
}

/**
 * When removing an app/unpublishing it need to make sure automations are cleaned up (cron).
 * @param appId the app that is being removed.
 * @return clean is complete if this succeeds.
 */
export async function cleanupAutomations(appId: any) {
  await disableAllCrons(appId)
}
