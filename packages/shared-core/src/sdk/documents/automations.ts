import {
  Automation,
  AutomationActionStepId,
  AutomationStep,
  AutomationTriggerStepId,
} from "@budibase/types"

export function isRowAction(automation: Automation) {
  const result =
    automation.definition.trigger?.stepId === AutomationTriggerStepId.ROW_ACTION
  return result
}

export function isAppAction(automation: Automation) {
  const result =
    automation.definition.trigger?.stepId === AutomationTriggerStepId.APP
  return result
}

export function countActionSteps(steps: AutomationStep[]): number {
  return steps.reduce((count, step) => {
    if (
      step.stepId === AutomationActionStepId.BRANCH &&
      step.inputs?.children
    ) {
      const branchSteps = Object.values(step.inputs.children).flat()
      return count + countActionSteps(branchSteps)
    }
    if (
      step.stepId !== AutomationActionStepId.BRANCH &&
      step.stepId !== AutomationActionStepId.LOOP
    ) {
      return count + 1
    }
    return count
  }, 0)
}

export function isStepLimitExceeded(
  automation: Automation,
  stepLimit: number
): boolean {
  return countActionSteps(automation.definition.steps) > stepLimit
}
