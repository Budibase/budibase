export interface SlackConversationScope {
  agentId: string
  channelId: string
  threadId?: string
  externalUserId: string
}

export interface ResolvedSlackIntegration {
  botToken: string
  signingSecret: string
}
