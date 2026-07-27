import type { ModelMessage, UIMessage } from "ai"
import { Document } from "../document"
import { Automation, AutomationStepResult } from "./automation"
import { ChatConversationChannel } from "../global"

// This does need a degree of flexibility
// {accepted: boolean} is a given for now, but response text
// are reasonable additions here. Also, the notification channel api
// could have fields for capture or processing. Like slack.
export type EscalationResponse = Record<string, any>

export function isEscalationResponse(v: unknown): v is EscalationResponse {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

export enum EscalationSource {
  AUTOMATION = "automation",
  OPERATION = "operation",
}

// The registered name of the escalate tool exposed to agent operations.
export const ESCALATE_TOOL_NAME = "escalate"

// The escalate tool's own result status, returned to the model.
export enum EscalateToolResultStatus {
  // A real escalation was raised and is awaiting a human response.
  PENDING_APPROVAL = "pending_approval",
  // No escalation could be raised (e.g. no reviewers configured). The
  // model's request was not actually handed to a human.
  UNAVAILABLE = "unavailable",
  // Resume-only: the escalation was already approved, so calling escalate
  // again is a no-op rather than a fresh escalation or a failure.
  ALREADY_APPROVED = "already_approved",
}

// Built-in resolution strategies.
export enum ResolutionStrategy {
  FIRST_RESPONSE = "first_response",
}

export interface SuspendedAutomationContext {
  // Snapshot of the automation definition at suspension time
  automation: Automation
  userId?: string
  stepResults: AutomationStepResult[]
  state: Record<string, any>
}

export interface SuspendedOperationContext {
  agentId: string
  operationId: string
  sessionId: string
  messages: ModelMessage[]
  channel?: ChatConversationChannel
  userId?: string
}

export type SuspendedContext =
  | ({ source: EscalationSource.AUTOMATION } & SuspendedAutomationContext)
  | ({ source: EscalationSource.OPERATION } & SuspendedOperationContext)

export interface EscalationContextDoc extends Document {
  source: EscalationSource
  automationId?: string
  stepId?: string
  operationId?: string
  sessionId?: string
  appId: string
  tenantId: string
  agentId?: string
  requestId?: string
  // zlib-deflated + base64 JSON of the SuspendedContext
  contextCompressed?: string
  delay: number
  resolution: "pending" | "resolved" | "expired" | "cancelled"
  // Human-facing heading + detail shown in the notification. Populated by the
  // escalation trigger
  title?: string
  summary?: string
  response?: EscalationResponse
  resolvedAt?: string
  isTest?: boolean
  recipients?: EscalationRecipient[]
  resolutionStrategy?: string
  // zlib-deflated + base64 JSON of the assistant UI message produced when the
  // operation resumed
  resumeResultCompressed?: string
}

export interface EscalationResult {
  resolution: EscalationContextDoc["resolution"]
  title?: string
  summary?: string
  resumeResult?: UIMessage
}

export enum EscalationNotificationChannel {
  BUDIBASE = "budibase",
  SLACK = "slack",
  MSTEAMS = "msteams",
  DISCORD = "discord",
  TELEGRAM = "telegram",
}

export interface EscalationRecipient {
  type: EscalationNotificationChannel
  config: Record<string, any>
}

export interface EscalationRespondResult {
  status: "recorded" | "closed"
  // Human-facing message the caller can surface (e.g. the inline card).
  message?: string
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
