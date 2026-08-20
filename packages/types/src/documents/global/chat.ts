import { AgentMessageMetadata, Document } from "../../"
import type { UIMessage } from "ai"

export enum AgentChannelProvider {
  MSTEAMS = "msteams",
  SLACK = "slack",
}

export type ChatIdentityLinkProvider = AgentChannelProvider

/** Maps provider to deployment UI channel id (e.g. MSTeams for display) */
export const DEPLOYMENT_CHANNEL_IDS: Record<AgentChannelProvider, string> = {
  [AgentChannelProvider.MSTEAMS]: "MSTeams",
  [AgentChannelProvider.SLACK]: "slack",
}

export const DEPLOYMENT_ID_TO_PROVIDER: Record<string, AgentChannelProvider> = {
  MSTeams: AgentChannelProvider.MSTEAMS,
  slack: AgentChannelProvider.SLACK,
}

export interface ChatAppAgent {
  agentId: string
}

export interface ChatApp extends Document {
  agents: ChatAppAgent[]
}

export interface ChatConversationChannel {
  provider: AgentChannelProvider
  conversationId?: string
  conversationType?: string
  teamId?: string
  tenantId?: string
  channelId?: string
  threadId?: string
  externalUserId?: string
  externalUserName?: string
  serviceUrl?: string
}

export interface ChatConversationRequest extends Document {
  chatAppId: string
  agentId: string
  title?: string
  messages: UIMessage<AgentMessageMetadata>[]
  timezone?: string
  isPreview?: boolean
  previewRoleId?: string
  sessionId?: string
  channel?: ChatConversationChannel
}

export interface WebhookChatCompleteResult {
  messages: ChatConversation["messages"]
  assistantText: string
  ragSources?: AgentMessageMetadata["ragSources"]
  allowKnowledgeSourceDownload?: boolean
  title?: string
}

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
  providerTenantId?: string
  serviceUrl?: string
}
