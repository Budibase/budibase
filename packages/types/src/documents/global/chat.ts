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
  title?: string
  messages: UIMessage[]
}

export type CreateChatConversationRequest = Pick<
  ChatConversationRequest,
  "chatAppId" | "title"
>

export interface ChatConversation extends ChatConversationRequest {
  userId: string
}
