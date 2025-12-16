import { context, db as dbCore } from "@budibase/backend-core"
import {
  Automation,
  CronTriggerInputs,
  isCronTrigger,
  isEmailTrigger,
} from "@budibase/types"
import { getAutomationParams } from "../db/utils"
import env from "../environment"
import { automationQueue } from "./bullboard"
import { enableCronOrEmailTrigger, isRebootTrigger } from "./utils"

function scheduledKey(
  jobId: string,
  repeat: { cron?: string; every?: number }
) {
  if (repeat.cron) {
    return `${jobId}:cron:${repeat.cron}`
  }
  return `${jobId}:every:${repeat.every}`
}

async function getAllAutomations() {
  const db = context.getWorkspaceDB()
  const docs = await db.allDocs<Automation>(
    getAutomationParams(null, { include_docs: true })
  )
  return docs.rows.map(row => row.doc!)
}

/**
 * In many self-hosted setups, Redis is ephemeral. After a restart Bull no longer has any
 * repeatable jobs, so CRON/Email automations won't fire again until the workspace is
 * republished (which re-enables triggers).
 *
 * On startup we rehydrate repeatable jobs for all production workspaces.
 */
export async function rehydrateScheduledTriggers() {
  // only run in the main thread at startup and only in self host / single tenant
  if (env.isInThread() || !env.SELF_HOSTED || env.MULTI_TENANCY) {
    return
  }

  const queue = automationQueue.getBullQueue()
  const repeatableJobs = await queue.getRepeatableJobs()

  const scheduled = new Set<string>()
  for (const job of repeatableJobs) {
    if (!job.id) {
      continue
    }
    scheduled.add(
      scheduledKey(job.id, {
        cron: job.cron,
        every: job.every,
      })
    )
  }

  const workspaceIds = await dbCore.getAllWorkspaces({
    dev: false,
    idsOnly: true,
  })

  for (const prodId of workspaceIds) {
    await context.doInWorkspaceContext(prodId, async () => {
      const automations = await getAllAutomations()
      const promises = []

      for (const automation of automations) {
        const trigger = automation.definition.trigger
        if (!trigger || automation.disabled || isRebootTrigger(automation)) {
          continue
        }

        if (isCronTrigger(trigger)) {
          const inputs = trigger.inputs as CronTriggerInputs
          const cron = inputs.cron || ""
          const jobId = trigger.cronJobId?.toString()
          const key = jobId ? scheduledKey(jobId, { cron }) : null
          if (!key || !scheduled.has(key)) {
            promises.push(
              enableCronOrEmailTrigger(prodId, automation).then(result => {
                const scheduledJobId =
                  result.automation.definition.trigger.cronJobId?.toString()
                if (scheduledJobId) {
                  scheduled.add(scheduledKey(scheduledJobId, { cron }))
                }
              })
            )
          }
        } else if (isEmailTrigger(trigger)) {
          const every = 30_000
          const jobId = trigger.cronJobId?.toString()
          const key = jobId ? scheduledKey(jobId, { every }) : null
          if (!key || !scheduled.has(key)) {
            promises.push(
              enableCronOrEmailTrigger(prodId, automation).then(result => {
                const scheduledJobId =
                  result.automation.definition.trigger.cronJobId?.toString()
                if (scheduledJobId) {
                  scheduled.add(scheduledKey(scheduledJobId, { every }))
                }
              })
            )
          }
        }
      }

      if (promises.length) {
        console.log(
          `Rehydrating ${promises.length} scheduled automation triggers for workspace ${prodId}`
        )
      }
      await Promise.all(promises)
    })
  }
}
