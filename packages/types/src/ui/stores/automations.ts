import {
  GetAutomationActionDefinitionsResponse,
  GetAutomationTriggerDefinitionsResponse,
  PublishStatusResource,
} from "../../api"
import { Automation } from "../../documents"

export interface BlockPath {
  stepIdx: number
  branchIdx: number
  branchStepId: string
  id: string
}

export interface BlockRef {
  id: string
  looped?: string
  pathTo: BlockPath[]
  terminating?: boolean
}

export enum BlockDefinitionTypes {
  TRIGGER = "TRIGGER",
  CREATABLE_TRIGGER = "CREATABLE_TRIGGER",
  ACTION = "ACTION",
}

export interface BlockDefinitions {
  [BlockDefinitionTypes.TRIGGER]: Partial<GetAutomationTriggerDefinitionsResponse>
  [BlockDefinitionTypes.CREATABLE_TRIGGER]: Partial<GetAutomationTriggerDefinitionsResponse>
  [BlockDefinitionTypes.ACTION]: Partial<GetAutomationActionDefinitionsResponse>
}

export interface UIAutomation extends Automation {
  publishStatus: PublishStatusResource
}
