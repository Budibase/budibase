import { processEvent } from "./utils"
import { automationQueue } from "./bullboard"
import { rebootTrigger } from "./triggers"
import BullQueue from "bull"

export { automationQueue } from "./bullboard"
export { shutdown } from "./bullboard"
export { TRIGGER_DEFINITIONS } from "./triggers"
export { ACTION_DEFINITIONS } from "./actions"

/**
 * This module is built purely to kick off the worker farm and manage the inputs/outputs
 */
export async function init() {
  // this promise will not complete
  const promise = automationQueue.process(async job => {
    await processEvent(job)
  })
  // on init we need to trigger any reboot automations
  await rebootTrigger()
  return promise
}

export function getQueues(): BullQueue.Queue[] {
  return [automationQueue]
}
