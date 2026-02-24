type MSTeamsIdRef = { id?: string }

export interface MSTeamsChannelData {
  channel?: MSTeamsIdRef
  team?: MSTeamsIdRef
  tenant?: MSTeamsIdRef
}

export interface MSTeamsChannelAccount {
  id?: string
  aadObjectId?: string
  name?: string
  tenantId?: string
}

export interface MSTeamsConversationAccount {
  id?: string
  conversationType?: string
}

export interface MSTeamsMentionedEntity {
  id?: string
  name?: string
}

export interface MSTeamsActivityEntity {
  type?: string
  text?: string
  mentioned?: MSTeamsMentionedEntity
}

export interface MSTeamsActivity {
  id?: string
  type?: string
  action?: string
  text?: string
  channelId?: string
  serviceUrl?: string
  from?: MSTeamsChannelAccount
  recipient?: MSTeamsChannelAccount
  membersAdded?: MSTeamsChannelAccount[]
  conversation?: MSTeamsConversationAccount
  channelData?: MSTeamsChannelData
  entities?: MSTeamsActivityEntity[]
}

export interface MSTeamsConversationScope {
  chatAppId: string
  agentId: string
  conversationId: string
  channelId?: string
  externalUserId: string
}

export type MSTeamsCommand = "ask" | "new" | "unsupported"

export interface ResolvedMSTeamsIntegration {
  appId: string
  appPassword: string
  tenantId?: string
  chatAppId?: string
}
