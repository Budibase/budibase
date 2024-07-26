import { Automation, AutomationTriggerStepId } from "@budibase/types"

export function isRowAction(automation: Automation) {
  const result =
    automation.definition.trigger.stepId === AutomationTriggerStepId.ROW_ACTION
  return result
}

export function isAppAction(automation: Automation) {
  const result =
    automation.definition.trigger.stepId === AutomationTriggerStepId.APP
  return result
}
