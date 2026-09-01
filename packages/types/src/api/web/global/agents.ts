import { Optional } from "../../../shared"
import {
  Agent,
  AgentSharePointKnowledgeSourceScope,
  AgentKnowledgeSourceSyncRunStatus,
  AgentOperation,
  ChatConversationRequest,
  KnowledgeBaseFile,
} from "../../../documents"

export type ChatAgentRequest = ChatConversationRequest

export interface AgentKnowledgeConfiguration {
  knowledgeSearchConfigured: boolean
}

export interface FetchAgentsResponse {
  agents: Agent[]
}

export interface AgentFileUploadResponse {
  file: KnowledgeBaseFile
}

export interface FetchAgentFileUrlResponse {
  url: string
}

export interface KnowledgeSourceOption {
  id: string
  name?: string
  webUrl?: string
}

export interface FetchAgentKnowledgeSourceOptionsResponse {
  options: KnowledgeSourceOption[]
}

export interface SharePointKnowledgeSourceSnapshot {
  sourceId: string
  name?: string
  webUrl?: string
  runStatus?: AgentKnowledgeSourceSyncRunStatus
  lastRunAt?: string
  lastStartedAt?: string
  errorMessage?: string
  syncedCount: number
  failedCount: number
  processingCount: number
  totalCount: number
}

export interface FetchAgentKnowledgeResponse {
  files: KnowledgeBaseFile[]
  sharePointSources: SharePointKnowledgeSourceSnapshot[]
}

export interface FetchAgentKnowledgeIndexResponse {
  operations: Record<string, FetchAgentKnowledgeResponse>
  configuration: AgentKnowledgeConfiguration
}

export interface KnowledgeSourceEntry {
  id: string
  name: string
  path: string
  type: "drive" | "folder" | "file" | "list"
  driveId?: string
  itemId?: string
  listId?: string
  hasChildren?: boolean
  webUrl?: string
}

export interface FetchAgentKnowledgeSourceEntriesResponse {
  entries: KnowledgeSourceEntry[]
}

export interface KnowledgeSourceSyncRun {
  sourceId: string
  lastRunAt?: string
  lastStartedAt?: string
  errorMessage?: string
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
  sourceId: string
  status: AgentKnowledgeSourceSyncRunStatus.QUEUED
}

export interface ConnectAgentSharePointSiteRequest {
  site: KnowledgeSourceOption
  datasourceId: string
  authConfigId: string
  scope: AgentSharePointKnowledgeSourceScope
}

export type ConnectAgentSharePointSiteResponse =
  FetchAgentKnowledgeSourceOptionsResponse

export interface UpdateAgentSharePointSiteRequest {
  scope: AgentSharePointKnowledgeSourceScope
}

export type UpdateAgentSharePointSiteResponse =
  FetchAgentKnowledgeSourceOptionsResponse

export interface DisconnectAgentSharePointSiteResponse {
  agentId: string
  disconnected: true
  siteId: string
}

interface ConfigureAgentDeploymentChannelResponse {
  success: boolean
}

export type ProvisionAgentMSTeamsChannelRequest = Record<string, never>

export interface ProvisionAgentMSTeamsChannelResponse
  extends ConfigureAgentDeploymentChannelResponse {
  messagingEndpointUrl: string
}

export type ProvisionAgentSlackChannelRequest = Record<string, never>

export interface ProvisionAgentSlackChannelResponse
  extends ConfigureAgentDeploymentChannelResponse {
  messagingEndpointUrl: string
}

export type CreateAgentSlackAppRequest = Record<string, never>

export interface CreateAgentSlackAppResponse
  extends ConfigureAgentDeploymentChannelResponse {
  appId: string
  oauthAuthorizeUrl: string
  messagingEndpointUrl: string
}

export interface SlackAppConfigResponse {
  configured: boolean
  updatedAt?: string
  expiresAt?: string
  needsReconfiguration?: boolean
}

export interface SaveSlackAppConfigRequest {
  configToken: string
  refreshToken: string
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
    "_id" | "_rev" | "createdAt" | "updatedAt" | "publishedAt" | "operations"
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
  "createdAt" | "updatedAt" | "_deleted" | "createdBy" | "operations"
>
export type UpdateAgentResponse = Omit<
  Agent,
  "knowledgeSources" | "knowledgeBases"
>

export type AgentOperationConfigRequest = Pick<
  AgentOperation,
  | "name"
  | "live"
  | "promptInstructions"
  | "enabledTools"
  | "approvalPolicies"
  | "allowKnowledgeSourceDownload"
  | "escalation"
>

export type CreateAgentOperationRequest = AgentOperationConfigRequest &
  Pick<AgentOperation, "id">

export type UpdateAgentOperationRequest = Partial<AgentOperationConfigRequest>

export type AgentOperationMutationResponse = Omit<
  Agent,
  "knowledgeSources" | "knowledgeBases"
>
