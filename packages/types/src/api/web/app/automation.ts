import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationTriggerDefinition,
  AutomationTriggerStepId,
} from "../../../documents"

export type GetAutomationTriggerDefinitionsResponse = Record<
  keyof typeof AutomationTriggerStepId,
  AutomationTriggerDefinition
>

export type GetAutomationActionDefinitionsResponse = Record<
  keyof typeof AutomationActionStepId,
  AutomationStepDefinition
>

export interface GetAutomationStepDefinitionsResponse {
  trigger: GetAutomationTriggerDefinitionsResponse
  action: GetAutomationActionDefinitionsResponse
}
