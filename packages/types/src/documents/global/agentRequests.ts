import { Document } from "../../"

export type AgentRequestStatus = "active" | "completed" | "failed"

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
