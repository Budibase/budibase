import { queue } from "@budibase/backend-core"
import { AutomationData } from "@budibase/types"
import Router from "@koa/router"
import * as automation from "../threads/automation"

export const automationQueue = new queue.BudibaseQueue<AutomationData>(
  queue.JobQueue.AUTOMATION,
  {
    removeStalledCb: job => automation.removeStalled(job),
    jobTags: (job: AutomationData) => {
      return {
        "automation.id": job.automation._id,
        "automation.name": job.automation.name,
        "automation.appId": job.automation.appId,
        "automation.createdAt": job.automation.createdAt,
        "automation.trigger": job.automation.definition.trigger.stepId,
      }
    },
  }
)

const PATH_PREFIX = "/bulladmin"
const DEFAULT_TRIGGER_UI = "http://localhost:3040"

export async function init() {
  const router = new Router()
  const triggerAdminUrl = process.env.TRIGGER_API_URL || DEFAULT_TRIGGER_UI

  router.get(/^\/bulladmin(?:\/.*)?$/, ctx => {
    ctx.redirect(triggerAdminUrl)
  })

  return router.routes()
}

export async function shutdown() {
  await queue.shutdown()
}
