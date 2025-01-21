import {
  Automation,
  AutomationActionStepId,
  AutomationLogPage,
  AutomationStatus,
  AutomationStepDefinition,
  AutomationTriggerDefinition,
  AutomationTriggerStepId,
  Row,
} from "../../../documents"
import { DocumentDestroyResponse } from "@budibase/nano"

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

export interface DeleteAutomationResponse extends DocumentDestroyResponse {}

export interface FetchAutomationResponse {
  automations: Automation[]
}

export interface FindAutomationResponse extends Automation {}

export interface UpdateAutomationRequest extends Automation {}
export interface UpdateAutomationResponse {
  message: string
  automation: Automation
}

export interface CreateAutomationRequest extends Automation {}
export interface CreateAutomationResponse {
  message: string
  automation: Automation
}

export interface SearchAutomationLogsRequest {
  startDate?: string
  status?: AutomationStatus
  automationId?: string
  page?: string
}
export interface SearchAutomationLogsResponse extends AutomationLogPage {}

export interface ClearAutomationLogRequest {
  automationId: string
  appId: string
}
export interface ClearAutomationLogResponse {
  message: string
}

export interface TriggerAutomationRequest {
  fields: Record<string, any>
  // time in seconds
  timeout: number
}
export type TriggerAutomationResponse = Record<string, any> | undefined

export interface TestAutomationRequest {
  id?: string
  revision?: string
  fields: Record<string, any>
  row?: Row
}
export interface TestAutomationResponse {}
