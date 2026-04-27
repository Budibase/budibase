import { Document } from "../document"
import { Automation, AutomationStepResult } from "./automation"

// This does need a degree of flexibility
// {accepted: boolean} is a given for now, but response text
// are reasonable additions here. Also, the notification channel api
// could have fields for capture or processing. Like slack.
export type EscalationResponse = Record<string, any>

export function isEscalationResponse(v: unknown): v is EscalationResponse {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

export interface SuspendedAutomationContext {
  // Snapshot of the automation definition at suspension time - preserved because
  // the builder could modify the automation between suspension and resolution.
  automation: Automation
  // User stored as ID only - full user object excluded to avoid stale data
  // (role changes, email updates etc). Rehydrate from DB at resolution time.
  userId?: string
  stepResults: AutomationStepResult[]
  state: Record<string, any>
}

export interface EscalationContextDoc extends Document {
  automationId: string
  stepId: string
  appId: string
  tenantId: string
  context?: SuspendedAutomationContext
  contextCompressed?: string
  delay: number
  resolution: "pending" | "resolved" | "expired" | "cancelled"
  // Wondering if this should be resolutionResult or result?
  response?: EscalationResponse
  resolvedAt?: string
  isTest?: boolean
  recipients?: EscalationRecipient[]
  resolutionStrategy?: string
}

export enum EscalationNotificationChannel {
  BUDIBASE = "budibase", // budibase agent chat maybe??
  SLACK = "slack",
  MSTEAMS = "msteams",
  DISCORD = "discord",
}

export interface EscalationRecipient {
  type: EscalationNotificationChannel
  config: Record<string, any>
}

export interface EscalationRespondResult {
  status: "recorded" | "closed"
}

export interface EscalationNotificationDoc extends Document {
  escalationId: string
  appId: string
  tenantId: string
  recipient: EscalationRecipient
  sentAt: string
  response?: EscalationResponse
  respondedAt?: string
}
