import { Document } from "../../"
import type { UIMessage } from "ai"

export enum ToolType {
  INTERNAL_TABLE = "INTERNAL_TABLE",
  EXTERNAL_TABLE = "EXTERNAL_TABLE",
  AUTOMATION = "AUTOMATION",
  REST_QUERY = "REST_QUERY",
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

export interface DiscordAgentIntegration {
  applicationId?: string
  publicKey?: string
  botToken?: string
  guildId?: string
  chatAppId?: string
  idleTimeoutMinutes?: number
  interactionsEndpointUrl?: string
}

export interface TeamsAgentIntegration {
  appId?: string
  appPassword?: string
  tenantId?: string
  chatAppId?: string
  messagingEndpointUrl?: string
  idleTimeoutMinutes?: number
}

export interface Agent extends Document {
  name: string
  description?: string
  aiconfig: string
  promptInstructions?: string
  goal?: string
  live?: boolean
  icon?: string
  iconColor?: string
  createdBy?: string
  enabledTools?: string[]
  embeddingModel?: string
  vectorDb?: string
  ragMinDistance?: number
  ragTopK?: number
  discordIntegration?: DiscordAgentIntegration
  teamsIntegration?: TeamsAgentIntegration
}

export interface AgentMessageRagSource {
  sourceId: string
  fileId?: string
  filename?: string
  chunkCount: number
}

export interface AgentMessageMetadata {
  ragSources?: AgentMessageRagSource[]
  createdAt?: number
  completedAt?: number
  error?: string
}

export interface AgentChat extends Document {
  agentId?: string
  title: string
  messages: UIMessage<AgentMessageMetadata>[]
}

export enum AgentFileStatus {
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}

export interface AgentFile extends Document {
  agentId: string
  filename: string
  mimetype?: string
  size?: number
  ragSourceId: string
  status: AgentFileStatus
  chunkCount: number
  uploadedBy: string
  errorMessage?: string
  processedAt?: string
}
