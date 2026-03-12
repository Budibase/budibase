import { Optional } from "../../../shared"
import {
  Agent,
  ChatApp,
  ChatConversation,
  ChatConversationRequest,
  CreateChatConversationRequest,
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
  Omit<Agent, "_id" | "_rev" | "createdAt" | "updatedAt">,
  "aiconfig"
>
export type CreateAgentResponse = Agent
export type DuplicateAgentResponse = Agent

export type UpdateAgentRequest = Omit<
  Agent,
  "createdAt" | "updatedAt" | "_deleted" | "createdBy"
>
export type UpdateAgentResponse = Agent
