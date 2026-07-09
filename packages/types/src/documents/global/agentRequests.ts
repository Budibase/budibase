import { Document } from "../../"

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

export interface AgentRequest extends Document {
  title?: string
  agentId: string
  userId: string
  entries: AgentRequestEntry[]
  status: AgentRequestStatus
  error?: string
  completedAt?: string
}
