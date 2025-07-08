import {
  Automation,
  AutomationTriggerStepId,
  AutomationActionStepId,
} from "@budibase/types"

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

function hasCollectBlockRecursive(steps: any[]): boolean {
  if (!steps || !Array.isArray(steps)) {
    return false
  }

  for (const step of steps) {
    // Check if current step is a collect block
    if (step.stepId === AutomationActionStepId.COLLECT) {
      return true
    }

    // Check if current step is a branch with children
    if (
      step.stepId === AutomationActionStepId.BRANCH &&
      step.inputs?.children
    ) {
      for (const { children } of Object.values(step.inputs.children)) {
        if (hasCollectBlockRecursive(children)) {
          return true
        }
      }
    }
  }

  return false
}

export function checkForCollectStep(automation: Automation): boolean {
  return hasCollectBlockRecursive(automation.definition.steps)
}
