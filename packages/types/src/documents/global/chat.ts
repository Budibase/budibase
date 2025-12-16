import { Document } from "../../"
import type { UIMessage } from "ai"

export interface ChatApp extends Document {
  title?: string
  greeting?: string
  description?: string
  theme?: string
  agentId: string
  live?: boolean
  settings?: Record<string, any>
}

export interface ChatConversationRequest extends Document {
  chatAppId: string
  userId?: string
  title?: string
  messages: UIMessage[]
}

export interface ChatConversation extends ChatConversationRequest {
  userId: string
}
