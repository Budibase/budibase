import { AgentMessageMetadata, Document } from "../../"
import type { UIMessage } from "ai"

export interface ConversationStarter {
  prompt: string
}

export interface ChatAppAgent {
  agentId: string
  isEnabled: boolean
  isDefault: boolean
  conversationStarters?: ConversationStarter[]
}

export interface ChatApp extends Document {
  title?: string
  greeting?: string
  description?: string
  theme?: string
  agents: ChatAppAgent[]
  live?: boolean
  settings?: Record<string, any>
}

export interface ChatConversationChannel {
  provider: string
  guildId?: string
  channelId?: string
  threadId?: string
  conversationId?: string
  conversationType?: string
  teamId?: string
  tenantId?: string
  externalUserId?: string
  externalUserName?: string
}

export interface ChatConversationRequest extends Document {
  chatAppId: string
  agentId: string
  title?: string
  messages: UIMessage<AgentMessageMetadata>[]
  transient?: boolean
  isPreview?: boolean
  channel?: ChatConversationChannel
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
