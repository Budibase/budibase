import {
  GetAutomationActionDefinitionsResponse,
  GetAutomationTriggerDefinitionsResponse,
} from "../../api"

export interface BranchPath {
  stepIdx: number
  branchIdx: number
  branchStepId: string
  id: string
}

export interface BlockDefinitions {
  TRIGGER: Partial<GetAutomationTriggerDefinitionsResponse>
  CREATABLE_TRIGGER: Partial<GetAutomationTriggerDefinitionsResponse>
  ACTION: Partial<GetAutomationActionDefinitionsResponse>
}
