import {
  Agent,
  ChatApp,
  ChatConversation,
  ChatConversationRequest,
} from "../../../documents"

export type ChatAgentRequest = ChatConversationRequest

export type FetchAgentHistoryResponse = ChatConversation[]

export type CreateChatAppRequest = Omit<
  ChatApp,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>
export type UpdateChatAppRequest = ChatApp

export interface FetchAgentsResponse {
  agents: Agent[]
}

export type CreateAgentRequest = Omit<
  Agent,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>
export type CreateAgentResponse = Agent

export type UpdateAgentRequest = Omit<Agent, "createdAt" | "updatedAt">
export type UpdateAgentResponse = Agent
