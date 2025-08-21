import {
  Automation,
  AutomationTriggerStepId,
  AutomationActionStepId,
  AutomationStep,
  isBranchStep,
  RowActionTrigger,
} from "@budibase/types"

export function isRowAction(
  automation: Automation
): automation is Automation & {
  definition: Automation["definition"] & {
    trigger: RowActionTrigger
  }
} {
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

function hasCollectBlockRecursive(steps: AutomationStep[]): boolean {
  if (!steps || !Array.isArray(steps)) {
    return false
  }

  for (const step of steps) {
    if (step.stepId === AutomationActionStepId.COLLECT) {
      return true
    }

    if (isBranchStep(step) && step.inputs.children) {
      for (const child of Object.values(step.inputs.children)) {
        if (hasCollectBlockRecursive(child)) {
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
