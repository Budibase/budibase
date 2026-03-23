export interface SlackConversationScope {
  chatAppId: string
  agentId: string
  channelId: string
  threadId?: string
  externalUserId: string
}

export interface ResolvedSlackIntegration {
  botToken: string
  signingSecret: string
  chatAppId?: string
}
