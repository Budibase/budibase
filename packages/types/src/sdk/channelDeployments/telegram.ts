export interface TelegramConversationScope {
  chatAppId: string
  agentId: string
  channelId: string
  threadId?: string
  externalUserId: string
}

export interface ResolvedTelegramIntegration {
  botToken: string
  webhookSecretToken?: string
  botUserName?: string
  chatAppId?: string
}
