import { Optional } from "../../../shared"
import {
  Agent,
  AgentFile,
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

export interface SyncAgentDiscordCommandsRequest {
  chatAppId?: string
}

export interface SyncAgentDiscordCommandsResponse {
  success: true
  chatAppId: string
  interactionsEndpointUrl: string
  inviteUrl: string
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

export interface FetchAgentFilesResponse {
  files: AgentFile[]
}

export interface AgentFileUploadResponse {
  file: AgentFile
}
