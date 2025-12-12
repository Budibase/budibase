import {
  GetAutomationActionDefinitionsResponse,
  GetAutomationTriggerDefinitionsResponse,
  PublishStatusResource,
  TestAutomationResponse,
} from "../../api"
import {
  Automation,
  AutomationStepResult,
  AutomationTriggerResult,
} from "../../documents"

export interface BlockPath {
  stepIdx: number
  branchIdx: number
  branchStepId: string
  loopStepId?: string
  id: string
}

export interface BlockRef {
  id: string
  looped?: string
  pathTo: BlockPath[]
  terminating?: boolean
  isLoopV2Child?: boolean
  insertIntoLoopV2?: boolean
  loopStepId?: string
  loopChildInsertIndex?: number
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

export type AutomationTestProgressStatus =
  | "running"
  | "success"
  | "error"
  | "stopped"
  | "complete"

export interface AutomationTestProgressEntry {
  status: AutomationTestProgressStatus
  occurredAt: number
  result?:
    | AutomationStepResult
    | AutomationTriggerResult
    | TestAutomationResponse
  message?: string
}

export interface AutomationTestProgressEvent {
  automationId: string
  appId?: string
  blockId?: string
  stepId?: string
  status: AutomationTestProgressStatus
  occurredAt: number
  result?:
    | AutomationStepResult
    | AutomationTriggerResult
    | TestAutomationResponse
  message?: string
  loop?: {
    current: number
    total: number
  }
}

export interface InProgressTestState {
  automationId: string
  startedAt: number
}

export type TestProgressState = {
  lastUpdated: number
  events: Record<string, AutomationTestProgressEvent>
  completed?: boolean
  result?: AutomationTestProgressEvent["result"]
  error?: string
}
