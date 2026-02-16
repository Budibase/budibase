export interface DiscordUser {
  id: string
  username?: string
  global_name?: string
}

export interface DiscordInteractionOption {
  name?: string
  value?: string | number | boolean
}

export interface DiscordInteractionComponent {
  value?: string
  components?: DiscordInteractionComponent[]
}

export interface DiscordInteractionData {
  name?: string
  options?: DiscordInteractionOption[]
  components?: DiscordInteractionComponent[]
}

export interface DiscordInteraction {
  id: string
  type: number
  token: string
  application_id: string
  channel_id?: string
  thread_id?: string
  guild_id?: string
  data?: DiscordInteractionData
  member?: { user?: DiscordUser }
  user?: DiscordUser
}

export interface DiscordConversationScope {
  chatAppId: string
  agentId: string
  channelId: string
  threadId?: string
  externalUserId: string
}

export type DiscordCommand = "ask" | "new" | "unsupported"

export interface ResolvedDiscordIntegration {
  applicationId: string
  botToken: string
  guildId: string
  chatAppId?: string
}
