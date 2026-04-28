import { Optional } from "../../../shared"
import {
  Agent,
  AgentKnowledgeSourceFilterConfig,
  AgentKnowledgeSourceSyncRunStatus,
  ChatApp,
  ChatConversation,
  ChatConversationRequest,
  CreateChatConversationRequest,
  KnowledgeBaseFile,
} from "../../../documents"

export type ChatAgentRequest = ChatConversationRequest

export type FetchAgentHistoryResponse = ChatConversation[]

export type { CreateChatConversationRequest }

export type CreateChatAppRequest = Omit<
  ChatApp,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>
export type UpdateChatAppRequest = Omit<ChatApp, "createdAt" | "updatedAt">

export interface FetchAgentsResponse {
  agents: Agent[]
}

export interface AgentFileUploadResponse {
  file: KnowledgeBaseFile
}

export interface KnowledgeSourceOption {
  id: string
  name?: string
  webUrl?: string
}

export interface FetchAgentKnowledgeSourceOptionsResponse {
  options: KnowledgeSourceOption[]
  runs: KnowledgeSourceSyncRun[]
}

export interface SharePointKnowledgeSourceSnapshot {
  sourceId: string
  name?: string
  webUrl?: string
  runStatus?: AgentKnowledgeSourceSyncRunStatus
  lastRunAt?: string
  syncedCount: number
  failedCount: number
  processingCount: number
  totalCount: number
}

export interface FetchAgentKnowledgeResponse {
  files: KnowledgeBaseFile[]
  hasSharePointConnection: boolean
  sharePointSources: SharePointKnowledgeSourceSnapshot[]
}

export interface KnowledgeSourceEntry {
  id: string
  name: string
  path: string
  type: "folder" | "file"
}

export interface FetchAgentKnowledgeSourceEntriesResponse {
  entries: KnowledgeSourceEntry[]
}

export interface KnowledgeSourceSyncRun {
  sourceId: string
  lastRunAt: string
  synced: number
  failed: number
  skipped: number
  unsupported: number
  totalDiscovered: number
  status: AgentKnowledgeSourceSyncRunStatus
}

export interface SyncAgentKnowledgeSourcesRequest {}

export interface SyncAgentKnowledgeSourcesResponse {
  agentId: string
  synced: number
  failed: number
  alreadySynced: number
  deleted: number
  unsupported: number
  totalDiscovered: number
}

export interface ConnectAgentSharePointSiteRequest {
  siteId: string
  filters?: AgentKnowledgeSourceFilterConfig
}

export type ConnectAgentSharePointSiteResponse =
  FetchAgentKnowledgeSourceOptionsResponse

export interface UpdateAgentSharePointSiteRequest {
  filters?: AgentKnowledgeSourceFilterConfig
}

export type UpdateAgentSharePointSiteResponse =
  FetchAgentKnowledgeSourceOptionsResponse

export interface DisconnectAgentSharePointSiteResponse {
  agentId: string
  disconnected: true
  siteId: string
}

export interface FetchChatAppAgentsResponse {
  agents: Pick<Agent, "_id" | "name" | "icon" | "iconColor" | "live">[]
}

interface ConfigureAgentDeploymentChannelRequest {
  chatAppId?: string
}

interface ConfigureAgentDeploymentChannelResponse {
  success: boolean
  chatAppId: string
}

export type SyncAgentDiscordCommandsRequest =
  ConfigureAgentDeploymentChannelRequest

export interface SyncAgentDiscordCommandsResponse
  extends ConfigureAgentDeploymentChannelResponse {
  interactionsEndpointUrl: string
  inviteUrl: string
}

export type ProvisionAgentMSTeamsChannelRequest =
  ConfigureAgentDeploymentChannelRequest

export interface ProvisionAgentMSTeamsChannelResponse
  extends ConfigureAgentDeploymentChannelResponse {
  messagingEndpointUrl: string
}

export type ProvisionAgentSlackChannelRequest =
  ConfigureAgentDeploymentChannelRequest

export interface ProvisionAgentSlackChannelResponse
  extends ConfigureAgentDeploymentChannelResponse {
  messagingEndpointUrl: string
}

export interface ToggleAgentDeploymentRequest {
  enabled: boolean
}

export interface ToggleAgentDeploymentResponse {
  success: boolean
  enabled: boolean
}

export type CreateAgentRequest = Optional<
  Omit<
    Agent,
    | "_id"
    | "_rev"
    | "createdAt"
    | "updatedAt"
    | "knowledgeSources"
    | "knowledgeBases"
    | "publishedAt"
  >,
  "aiconfig"
>
export type CreateAgentResponse = Omit<
  Agent,
  "knowledgeSources" | "knowledgeBases"
>
export type DuplicateAgentResponse = Agent

export type UpdateAgentRequest = Omit<
  Agent,
  | "createdAt"
  | "updatedAt"
  | "_deleted"
  | "createdBy"
  | "knowledgeSources"
  | "knowledgeBases"
>
export type UpdateAgentResponse = Omit<
  Agent,
  "knowledgeSources" | "knowledgeBases"
>
