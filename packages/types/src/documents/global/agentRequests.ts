import { Document } from "../../"

export type AgentRequestStatus = "completed"

export interface AgentRequestEntry {
  entryId: string
  sessionId: string
  operationName: string
  source: string
  promptHistory: string[]
  interactionCount: number
  status: AgentRequestStatus
  createdAt: string
  updatedAt: string
}

export interface AgentRequest extends Document {
  requestId: string
  title?: string
  agentId: string
  userId: string
  sessionIds: string[]
  entries: AgentRequestEntry[]
  status: AgentRequestStatus
  requestCount: number
  interactionCount: number
  latestPromptAt: string
  latestCompletedAt?: string
  latestSessionId: string
}
