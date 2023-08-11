import { context } from "@budibase/backend-core"
import { Automation, AutomationState, DocumentType } from "@budibase/types"
import { definitions } from "../../../automations/triggerInfo"

const REBOOT_CRON = "@reboot"

export async function exists(automationId: string) {
  if (!automationId?.startsWith(DocumentType.AUTOMATION)) {
    throw new Error("Invalid automation ID.")
  }
  const db = context.getAppDB()
  return db.docExists(automationId)
}

export async function get(automationId: string) {
  const db = context.getAppDB()
  return (await db.get(automationId)) as Automation
}

export function disabled(automation: Automation) {
  return automation.state === AutomationState.DISABLED || !hasSteps(automation)
}

export function isCron(automation: Automation) {
  return (
    automation?.definition.trigger &&
    automation?.definition.trigger.stepId === definitions.CRON.stepId
  )
}

export function isReboot(automation: Automation) {
  const trigger = automation?.definition.trigger
  return isCron(automation) && trigger?.inputs.cron === REBOOT_CRON
}

export function hasSteps(automation: Automation) {
  return automation?.definition?.steps?.length > 0
}
