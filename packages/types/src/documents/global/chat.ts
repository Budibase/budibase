import { AgentMessageMetadata, Document } from "../../"
import type { UIMessage } from "ai"

export interface ChatAppEnabledAgent {
  agentId: string
  default?: boolean
}

export interface ChatApp extends Document {
  title?: string
  greeting?: string
  description?: string
  theme?: string
  enabledAgents: ChatAppEnabledAgent[]
  live?: boolean
  settings?: Record<string, any>
}

export interface ChatConversationRequest extends Document {
  chatAppId: string
  agentId: string
  title?: string
  messages: UIMessage<AgentMessageMetadata>[]
}

export type CreateChatConversationRequest = Pick<
  ChatConversationRequest,
  "chatAppId" | "agentId" | "title"
>

export type DraftChatConversation = Omit<ChatConversationRequest, "agentId"> & {
  agentId?: string
}

export interface ChatConversation extends ChatConversationRequest {
  userId: string
}
