import {
  EscalationRecipient,
  EscalationResponse,
  EscalationSource,
  SuspendedAutomationContext,
  SuspendedOperationContext,
} from "@budibase/types"

interface CreateEscalationBase {
  appId: string
  tenantId: string
  message: string
  delay: number
  // Allow an explicit ID to be provided (e.g. for idempotent test runs)
  escalationId?: string
  recipients?: EscalationRecipient[]
  resolutionStrategy?: string
  // Human-facing heading + detail rendered in the notification.
  title?: string
  summary?: string
}

export interface CreateAutomationEscalationInput extends CreateEscalationBase {
  source: EscalationSource.AUTOMATION
  automationId: string
  stepId: string
  agentId?: string
  context: SuspendedAutomationContext
}

export interface CreateOperationEscalationInput extends CreateEscalationBase {
  source: EscalationSource.OPERATION
  agentId: string
  operationId: string
  requestId?: string
  context: SuspendedOperationContext
}

export type CreateEscalationInput =
  | CreateAutomationEscalationInput
  | CreateOperationEscalationInput

export interface CreateEscalationResult {
  escalationId: string
  expiresAt: string
}

// Useful to have calculated values like expiresAt in the queue
// to minimise db reads and possibly for use in the UI
export interface EscalationSummary {
  escalationId: string
  appId: string
  tenantId: string
  message?: string
  phase: "notify" | "waiting"
  expiresAt?: string
  isTest?: boolean
}

export interface IEscalationProcessor {
  create(input: CreateEscalationInput): Promise<CreateEscalationResult>
  resolve(escalationId: string, response?: EscalationResponse): Promise<void>
  cancel(escalationId: string): Promise<void>
  list(appId: string): Promise<EscalationSummary[]>
}
