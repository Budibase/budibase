import { queue } from "@budibase/backend-core"
import { AutomationData } from "@budibase/types"
import { processEvent } from "./utils"
import { automationQueue } from "./bullboard"
import { rebootTrigger } from "./triggers"
import { rehydrateScheduledTriggers } from "./rehydrate"
import { automationsEnabled } from "../features"

export { automationQueue } from "./bullboard"
export { shutdown } from "./bullboard"
export { TRIGGER_DEFINITIONS } from "./triggers"
export { BUILTIN_ACTION_DEFINITIONS, getActionDefinitions } from "./actions"

interface TriggerDispatchQueue {
  isTriggerTaskAvailable: () => boolean
  trigger: (
    data: AutomationData,
    opts?: queue.JobOptions
  ) => Promise<queue.Job<AutomationData>>
}

function getTriggerDispatchQueue(): TriggerDispatchQueue | null {
  const candidate = automationQueue as unknown as Partial<TriggerDispatchQueue>
  if (
    typeof candidate.isTriggerTaskAvailable !== "function" ||
    typeof candidate.trigger !== "function"
  ) {
    return null
  }
  return candidate as TriggerDispatchQueue
}

/**
 * This module is built purely to kick off the worker farm and manage the inputs/outputs
 */
export async function init() {
  if (!automationsEnabled()) {
    return
  }
  // this promise will not complete
  const promise = automationQueue.process(async job => {
    const triggerDispatchQueue = getTriggerDispatchQueue()
    if (
      job.opts?.repeat &&
      triggerDispatchQueue?.isTriggerTaskAvailable() === true
    ) {
      const triggerJobOpts = { ...job.opts }
      delete triggerJobOpts.repeat
      delete triggerJobOpts.delay
      delete triggerJobOpts.jobId
      await triggerDispatchQueue.trigger(job.data, triggerJobOpts)
      return
    }
    await processEvent(job)
  })
  // on init we need to rehydrate any scheduled triggers that may have been lost
  // due to reddis being ephemeral in some self hosted deployments.
  await rehydrateScheduledTriggers()
  // on init we need to trigger any reboot automations
  await rebootTrigger()
  return promise
}

export function getQueue() {
  return automationQueue
}
