import type { ModelMessage, UIMessage } from "ai"
import { Document } from "../document"
import { Automation, AutomationStepResult } from "./automation"
import { ChatConversationChannel } from "../global/chat"

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
