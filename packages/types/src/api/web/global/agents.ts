import {
  Agent,
  AgentChat,
  BudibaseToolSource,
  RestQueryToolSource,
} from "../../../documents"

export type ChatAgentRequest = AgentChat

export type FetchAgentHistoryResponse = AgentChat[]

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
