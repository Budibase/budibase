import { Document } from "../../"
import { EscalationNotificationChannel } from "../workspace"
import type { AgentOperation } from "./agents"

export const AGENT_REQUEST_STATUSES = [
  "active",
  "needs_input",
  "completed",
  "failed",
] as const

export type AgentRequestStatus = (typeof AGENT_REQUEST_STATUSES)[number]

export const REQUEST_ESCALATION_STATES = [
  "pending",
  "approved",
  "rejected",
  "expired",
  "cancelled",
] as const

export type RequestEscalationState = (typeof REQUEST_ESCALATION_STATES)[number]

export interface AgentRequestOperation
  extends Pick<AgentOperation, "id" | "name"> {
  prompt: string
}

export interface AgentRequestEntry {
  sessionId: string
  source: string
  createdAt: string
  updatedAt: string
  status: AgentRequestStatus
  error?: string
  completedAt?: string
}

interface AgentRequestActionBase {
  id: string
  timestamp: string
  sessionId?: string
}

export interface UserMessageAction extends AgentRequestActionBase {
  type: "user_message"
  summary: string
}

export interface StatusChangedAction extends AgentRequestActionBase {
  type: "status_changed"
  from: AgentRequestStatus
  to: AgentRequestStatus
  error?: string
}

export interface ToolCallAction extends AgentRequestActionBase {
  type: "tool_call"
  toolName: string
  readableName?: string
  status: "success" | "error"
  // Short, user-friendly description of what the call did and its outcome
  summary?: string
}

export interface EscalationRaisedAction extends AgentRequestActionBase {
  type: "escalation_raised"
  escalationId: string
  recipients: Array<{
    type: EscalationNotificationChannel
    label: string
  }>
}

export interface EscalationResolvedAction extends AgentRequestActionBase {
  type: "escalation_resolved"
  escalationId: string
  outcome: "approved" | "rejected" | "expired"
}

export type AgentRequestAction =
  | UserMessageAction
  | StatusChangedAction
  | ToolCallAction
  | EscalationRaisedAction
  | EscalationResolvedAction

export const AGENT_REQUEST_TYPE = "agentRequest"

export interface AgentRequest extends Document {
  type: typeof AGENT_REQUEST_TYPE
  workspaceId: string
  title?: string
  agentId: string
  operationId?: string
  userId: string
  entries: AgentRequestEntry[]
  actions?: AgentRequestAction[]
  status: AgentRequestStatus
  statusRank: number
  approvers: string[]
  pendingApprovers: string[]
  respondedApprovers: string[]
  expiresAt?: string
  error?: string
  completedAt?: string
}
