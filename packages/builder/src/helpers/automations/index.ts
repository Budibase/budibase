import { automationStore } from "@/stores/builder"
import { Automation, AutomationTriggerStepId } from "@budibase/types"
import { get } from "svelte/store"

export function getTriggerFriendlyName(automation: Automation) {
  const triggerType = automation.definition.trigger.stepId
  if (triggerType === AutomationTriggerStepId.ROW_ACTION) {
    return "Row Action"
  }

  const $automationStore = get(automationStore)
  const definition =
    $automationStore.blockDefinitions.CREATABLE_TRIGGER[
      automation.definition.trigger.stepId
    ]
  return definition?.name
}
