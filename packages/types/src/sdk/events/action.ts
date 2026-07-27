import { BaseEvent } from "./event"
import { QueryVerb } from "../../documents"

export enum ActionFailureReason {
  ERROR = "error",
  MAX_ITERATIONS = "max_iterations",
  FAILURE_CONDITION = "failure_condition",
  INCORRECT_TYPE = "incorrect_type",
  NO_CONDITION_MET = "no_condition_met",
}

export interface ActionAutomationStepExecuted extends BaseEvent {
  stepId: string
}

export interface ActionAutomationStepFailed extends BaseEvent {
  stepId: string
  reason: ActionFailureReason
  errorMessage?: string
}

export interface ActionCrudExecuted extends BaseEvent {
  type: QueryVerb
}

export interface ActionCrudFailed extends BaseEvent {
  type: QueryVerb
  reason: ActionFailureReason
  errorMessage?: string
}

export interface ActionAiAgentExecuted extends BaseEvent {
  agentId: string
}

export interface ActionAiAgentFailed extends BaseEvent {
  agentId: string
  reason: ActionFailureReason
  errorMessage?: string
}
