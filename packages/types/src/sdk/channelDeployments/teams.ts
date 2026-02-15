export interface TeamsChannelInfo {
  id?: string
}

export interface TeamsTeamInfo {
  id?: string
}

export interface TeamsTenantInfo {
  id?: string
}

export interface TeamsChannelData {
  channel?: TeamsChannelInfo
  team?: TeamsTeamInfo
  tenant?: TeamsTenantInfo
}

export interface TeamsChannelAccount {
  id?: string
  aadObjectId?: string
  name?: string
  tenantId?: string
}

export interface TeamsConversationAccount {
  id?: string
  conversationType?: string
}

export interface TeamsActivity {
  type?: string
  text?: string
  channelId?: string
  serviceUrl?: string
  from?: TeamsChannelAccount
  conversation?: TeamsConversationAccount
  channelData?: TeamsChannelData
}

export interface TeamsConversationScope {
  chatAppId: string
  agentId: string
  conversationId: string
  channelId?: string
  externalUserId: string
}

export type TeamsCommand = "ask" | "new" | "unsupported"

export interface ResolvedTeamsIntegration {
  appId: string
  appPassword: string
  tenantId?: string
  chatAppId?: string
}
