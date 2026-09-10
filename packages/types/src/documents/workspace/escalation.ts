import type { ModelMessage, UIMessage } from "ai"
import { Document } from "../document"
import { Automation, AutomationStepResult } from "./automation"
import { ChatConversationChannel } from "../global"
import type { AgentRequester } from "../global/agents"

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

// The result status returned to the model by an approval gate.
export enum ApprovalToolResultStatus {
  PENDING_APPROVAL = "pending_approval",
  UNAVAILABLE = "unavailable",
  ALREADY_APPROVED = "already_approved",
}

// Built-in resolution strategies.
export enum ResolutionStrategy {
  FIRST_RESPONSE = "first_response",
  UNANIMOUS = "unanimous",
  MAJORITY = "majority",
}

export interface SuspendedAutomationContext {
  // Snapshot of the automation definition at suspension time
  automation: Automation
  userId?: string
  stepResults: AutomationStepResult[]
  state: Record<string, any>
}

export interface PendingToolCall {
  toolCallId: string
  toolName: string
  args: unknown
  sourceId?: string
}

export interface SuspendedOperationContext {
  agentId: string
  operationId: string
  sessionId: string
  messages: ModelMessage[]
  conversationId?: string
  attachmentIds?: string[]
  channel?: ChatConversationChannel
  userId?: string
  requester?: AgentRequester
  pendingToolCall: PendingToolCall
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
  conversationId?: string
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
}

export enum EscalationAction {
  APPROVE = "esc_approve",
  REJECT = "esc_reject",
}

export interface EscalationRecipient {
  type: EscalationNotificationChannel
  config: Record<string, any>
}

export interface EscalationRespondResult {
  status: "recorded" | "already_responded" | "closed"
  // Human-facing message the caller can surface (e.g. the inline card).
  message?: string
}

export type EscalationNotificationStatus = "pending" | "sent" | "failed"

export interface EscalationProviderResponse {
  code?: number
  body?: string
}

export interface EscalationNotificationDoc extends Document {
  escalationId: string
  appId: string
  tenantId: string
  recipient: EscalationRecipient
  status?: EscalationNotificationStatus
  providerResponse?: EscalationProviderResponse
  sentAt?: string
  responses?: EscalationResponse[]
}
