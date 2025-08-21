import { BaseEvent } from "./event"
import { QueryVerb } from "../../documents"

export interface ActionAutomationStepExecuted extends BaseEvent {
  stepId: string
}

export interface ActionCrudExecuted extends BaseEvent {
  type: QueryVerb
}

export interface ActionAiAgentExecuted extends BaseEvent {
  agentId: string
}
