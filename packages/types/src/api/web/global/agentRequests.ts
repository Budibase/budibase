import { AgentRequest, AgentRequestStatus } from "../../../documents"

export type AgentRequestsSummary = Record<AgentRequestStatus, number> & {
  total: number
}

export interface FetchAgentRequestsResponse {
  requests: AgentRequest[]
  summary: AgentRequestsSummary
}
