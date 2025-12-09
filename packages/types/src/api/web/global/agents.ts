import {
  Agent,
  ChatApp,
  ChatConversation,
  BudibaseToolSource,
  RestQueryToolSource,
} from "../../../documents"

export type ChatAgentRequest = ChatConversation

export type FetchAgentHistoryResponse = ChatConversation[]

export type CreateChatAppRequest = Omit<
  ChatApp,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>
export type UpdateChatAppRequest = ChatApp

export interface FetchAgentsResponse {
  agents: Agent[]
}

type CreateBudibaseToolSourceRequest = Omit<
  BudibaseToolSource,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>

type CreateRestQueryToolSourceRequest = Omit<
  RestQueryToolSource,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>

export type CreateToolSourceRequest =
  | CreateBudibaseToolSourceRequest
  | CreateRestQueryToolSourceRequest

type UpdateBudibaseToolSourceRequest = Omit<
  BudibaseToolSource,
  "createdAt" | "updatedAt"
>

type UpdateRestQueryToolSourceRequest = Omit<
  RestQueryToolSource,
  "createdAt" | "updatedAt"
>

export type UpdateToolSourceRequest =
  | (UpdateBudibaseToolSourceRequest & { agentId: string })
  | (UpdateRestQueryToolSourceRequest & { agentId: string })

export type CreateAgentRequest = Omit<
  Agent,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>
export type CreateAgentResponse = Agent

export type UpdateAgentRequest = Omit<Agent, "createdAt" | "updatedAt">
export type UpdateAgentResponse = Agent
