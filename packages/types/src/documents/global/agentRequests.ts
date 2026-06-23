import { Document } from "../../"

export type AgentRequestStatus = "completed"

interface AgentRequestPromptOperation {
  name: string
  prompt: string
}

export interface AgentRequestPromptHistoryItem {
  message: string
  date: string
  sessionId: string
  source: string
  operations?: AgentRequestPromptOperation[]
}

export interface AgentRequestEntry {
  promptHistory: AgentRequestPromptHistoryItem[]
  status: AgentRequestStatus
}

export interface AgentRequest extends Document {
  title?: string
  agentId: string
  userId: string
  entries: AgentRequestEntry[]
  status: AgentRequestStatus
}
