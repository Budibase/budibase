import {
  AutomationTriggerStepId,
  Automation,
  GetAutomationStepDefinitionsResponse,
  AutomationTrigger,
} from "@budibase/types"
import { Helpers } from "@budibase/bbui"
import { generate } from "shortid"

import { automations } from "@budibase/shared-core"

const triggerDefs = automations.triggers.definitions
const stepDefs = automations.steps.definitions

export function apiDefinitions(): GetAutomationStepDefinitionsResponse {
  return {
    trigger: triggerDefs,
    action: stepDefs,
  }
}

export function baseAutomation(
  triggerDef: keyof typeof AutomationTriggerStepId = AutomationTriggerStepId.APP,
  appId: string = "testApp"
): Automation {
  return {
    _id: Helpers.uuid(),
    _rev: Helpers.uuid(),
    name: "Base Automation",
    definition: {
      trigger: {
        id: generate(),
        ...(triggerDef ? triggerDefs[triggerDef] : {}),
      } as AutomationTrigger,
      steps: [],
    },
    type: "automation",
    appId,
  }
}
