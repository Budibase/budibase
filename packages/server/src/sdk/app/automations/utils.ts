import { Automation, AutomationActionStepId } from "@budibase/types"

export function checkForCollectStep(automation: Automation) {
  return automation.definition.steps.some(
    (step: any) => step.stepId === AutomationActionStepId.COLLECT
  )
}
