import { Document } from "../../"
import { EscalationNotificationChannel } from "../workspace"

export const AGENT_REQUEST_STATUSES = [
  "active",
  "needs_input",
  "completed",
  "failed",
] as const

export type AgentRequestStatus = (typeof AGENT_REQUEST_STATUSES)[number]

export interface AgentRequestEntry {
  sessionId: string
  source: string
  operationNames: string[]
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
}

export interface EscalationRaisedAction extends AgentRequestActionBase {
  type: "escalation_raised"
  escalationId: string
  recipients: Array<{
    type: EscalationNotificationChannel
    label: string
  }>
}

export type AgentRequestAction =
  | UserMessageAction
  | StatusChangedAction
  | ToolCallAction
  | EscalationRaisedAction

export interface AgentRequest extends Document {
  title?: string
  agentId: string
  userId: string
  entries: AgentRequestEntry[]
  actions?: AgentRequestAction[]
  status: AgentRequestStatus
  error?: string
  completedAt?: string
}
