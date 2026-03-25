import { Document } from "../../"
import type { UIMessage } from "ai"

export enum ToolType {
  INTERNAL_TABLE = "INTERNAL_TABLE",
  EXTERNAL_TABLE = "EXTERNAL_TABLE",
  AUTOMATION = "AUTOMATION",
  REST_QUERY = "REST_QUERY",
  DATASOURCE_QUERY = "DATASOURCE_QUERY",
  SEARCH = "SEARCH",
}

export interface ToolMetadata {
  name: string
  readableName?: string
  description?: string
  sourceType: ToolType
  sourceLabel?: string
  sourceIconType?: string
}

interface ChatAgentIntegration {
  chatAppId?: string
  idleTimeoutMinutes?: number
}

export interface DiscordAgentIntegration extends ChatAgentIntegration {
  applicationId?: string
  publicKey?: string
  botToken?: string
  guildId?: string
  interactionsEndpointUrl?: string
}

export interface MSTeamsAgentIntegration extends ChatAgentIntegration {
  appId?: string
  appPassword?: string
  tenantId?: string
  messagingEndpointUrl?: string
}

export interface SlackAgentIntegration extends ChatAgentIntegration {
  botToken?: string
  signingSecret?: string
  messagingEndpointUrl?: string
}

export interface Agent extends Document {
  name: string
  description?: string
  aiconfig: string
  promptInstructions?: string
  goal?: string
  live?: boolean
  publishedAt?: string
  icon?: string
  iconColor?: string
  createdBy?: string
  enabledTools?: string[]
  knowledgeBases?: string[]
  discordIntegration?: DiscordAgentIntegration
  MSTeamsIntegration?: MSTeamsAgentIntegration
  slackIntegration?: SlackAgentIntegration
}

export interface AgentMessageRagSource {
  sourceId: string
  fileId?: string
  filename?: string
  chunkCount: number
}

export interface AgentMessageMetadata {
  ragSources?: AgentMessageRagSource[]
  toolDisplayNames?: Record<string, string>
  createdAt?: number
  completedAt?: number
  error?: string
}

export interface AgentChat extends Document {
  agentId?: string
  title: string
  messages: UIMessage<AgentMessageMetadata>[]
}
