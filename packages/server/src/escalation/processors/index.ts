import {
  EscalationRecipient,
  EscalationResponse,
  SuspendedAutomationContext,
} from "@budibase/types"

export interface CreateEscalationInput {
  automationId: string
  stepId: string
  appId: string
  tenantId: string
  message: string
  context: SuspendedAutomationContext
  delay: number
  // Allow an explicit ID to be provided (e.g. for idempotent test runs)
  escalationId?: string
  recipients?: EscalationRecipient[]
  resolutionStrategy?: string
}

export interface CreateEscalationResult {
  escalationId: string
  expiresAt: string
}

// Dean: useful to have calculated values in the queue
// to minimise db reads. Like expires at
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
  // Re-enqueues any pending escalations whose Bull jobs are missing - used to
  // recover after a Redis flush or queue loss.
  resync(): Promise<{ resynced: number }>
}

// DEAN: I'm thinking all this ecalation queue/process should be outside the escalation
// automation step. It should be entirely reusable??
