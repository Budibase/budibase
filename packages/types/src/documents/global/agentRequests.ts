import { Document } from "../../"

export type AgentRequestStatus = "waiting" | "completed"

export interface AgentRequest extends Document {
  agentId: string
  chatConversationId: string
  userId: string
  promptHistory: string[]
  status: AgentRequestStatus
  interactionCount: number
}
