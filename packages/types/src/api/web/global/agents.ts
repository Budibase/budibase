import { Agent, AgentChat } from "../../../documents"

export type ChatAgentRequest = AgentChat

export type FetchAgentHistoryResponse = AgentChat[]

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
