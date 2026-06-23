import { Document } from "../../"

export type AgentRequestStatus = "completed"

export interface AgentRequestEntry {
  sessionId: string
  source: string
  operationNames: string[]
  createdAt: string
  updatedAt: string
  status: AgentRequestStatus
}

export interface AgentRequest extends Document {
  title?: string
  agentId: string
  userId: string
  entries: AgentRequestEntry[]
  status: AgentRequestStatus
}
