import { Agent, AgentChat, AgentToolSource } from "../../../documents"

export type ChatAgentRequest = AgentChat

export type FetchAgentHistoryResponse = AgentChat[]

export interface FetchAgentsResponse {
  agents: Agent[]
}

export type CreateToolSourceRequest = Omit<
  AgentToolSource,
  "_id" | "_rev" | "createdAt" | "updatedAt"
> & {
  agentId: string
}

export type UpdateToolSourceRequest = Omit<
  AgentToolSource,
  "createdAt" | "updatedAt"
> & {
  agentId: string
}

export type CreateAgentRequest = Omit<
  Agent,
  "_id" | "_rev" | "createdAt" | "updatedAt"
>
export type CreateAgentResponse = Agent

export type UpdateAgentRequest = Omit<Agent, "createdAt" | "updatedAt">
export type UpdateAgentResponse = Agent
