import type { Automation } from "@budibase/types"
import { TriggerStepID } from "@/constants/backend/automations"

export const filterTriggerableAutomations = (
  automations: Automation[]
): Automation[] => {
  return automations
    .filter(a => a.definition.trigger?.stepId === TriggerStepID.APP)
    .filter((a, i, arr) => arr.findIndex(b => b._id === a._id) === i)
}
