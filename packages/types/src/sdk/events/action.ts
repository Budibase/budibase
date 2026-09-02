import { BaseEvent } from "./event"
import { QueryVerb } from "../../documents"
import type { ActionSourceContext } from "../platformActions"

export enum ActionFailureReason {
  ERROR = "error",
  MAX_ITERATIONS = "max_iterations",
  FAILURE_CONDITION = "failure_condition",
  INCORRECT_TYPE = "incorrect_type",
  NO_CONDITION_MET = "no_condition_met",
}

export interface ActionAutomationStepExecuted
  extends BaseEvent,
    ActionSourceContext {
  stepId: string
  automationId: string
}

export interface ActionAutomationStepFailed
  extends BaseEvent,
    ActionSourceContext {
  stepId: string
  automationId: string
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

export interface ActionAiAgentExecuted extends BaseEvent, ActionSourceContext {
  agentId: string
  sessionId: string
  requestId?: string
  awaitingEscalation?: boolean
}

export interface ActionAiAgentFailed extends BaseEvent, ActionSourceContext {
  agentId: string
  sessionId: string
  requestId?: string
  reason: ActionFailureReason
  errorMessage?: string
}
