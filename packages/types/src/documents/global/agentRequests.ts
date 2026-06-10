import { Document } from "../../"

export type AgentRequestStatus = "waiting" | "completed"

export interface AgentRequest extends Document {
  agentId: string
  sessionId: string
  userId: string
  promptHistory: string[]
  status: AgentRequestStatus
  interactionCount: number
}
