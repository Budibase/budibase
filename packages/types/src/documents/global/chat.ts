import { AgentMessageMetadata, Document } from "../../"
import type { UIMessage } from "ai"

export type ChatIdentityLinkProvider = "discord" | "msteams" | "slack"

export interface ConversationStarter {
  prompt: string
}

export interface ChatAppAgent {
  agentId: string
  isEnabled: boolean
  isDefault: boolean
  roleId?: string
  conversationStarters?: ConversationStarter[]
}

export interface ChatApp extends Document {
  title?: string
  greeting?: string
  description?: string
  agents: ChatAppAgent[]
  live?: boolean
  settings?: Record<string, any>
}

export interface ChatConversationChannel {
  provider: string
  conversationId?: string
  conversationType?: string
  guildId?: string
  teamId?: string
  tenantId?: string
  channelId?: string
  threadId?: string
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
  sessionId?: string
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

export interface ChatIdentityLink extends Document {
  tenantId: string
  provider: ChatIdentityLinkProvider
  externalUserId: string
  globalUserId: string
  linkedAt: string
  linkedBy?: string
  externalUserName?: string
  teamId?: string
  guildId?: string
  providerTenantId?: string
}
