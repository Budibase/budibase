import { Automation, AutomationTriggerStepId } from "@budibase/types"

export function isRowAction(automation: Automation) {
  return (
    automation.definition.trigger?.stepId === AutomationTriggerStepId.ROW_ACTION
  )
}

export function isWebhookAction(automation: Automation) {
  return (
    automation.definition.trigger?.stepId === AutomationTriggerStepId.WEBHOOK
  )
}

export function isAppAction(automation: Automation) {
  return automation.definition.trigger?.stepId === AutomationTriggerStepId.APP
}
