import {
  AgentRequest,
  AgentRequestStatus,
  EscalationAction,
  EscalationRaisedAction,
  RequestEscalationState,
} from "../../../documents"

export type AgentRequestsSummary = Record<AgentRequestStatus, number> & {
  total: number
}

export interface FetchAgentRequestsResponse {
  requests: AgentRequest[]
  summary: AgentRequestsSummary
  bookmark?: string
}

export interface RequestRow {
  requestId: string
  workspaceId: string
  title?: string
  agentId: string
  operationId?: string
  status: AgentRequestStatus
  isRequester: boolean
  isApprover: boolean
  awaitingMe: boolean
  awaitingOthers: boolean
  responded: boolean
  expiresAt?: string
  createdAt?: string | number
}

export interface FetchRequestsResponse {
  requests: RequestRow[]
  page: number
  hasNextPage: boolean
}

export interface RequestDetailApproval {
  userId: string
  name: string
  actionId: string
  respondedAt: string
  note?: string
}

export interface RequestDetailEscalation {
  escalationId: string
  title?: string
  operationId?: string
  recipients: EscalationRaisedAction["recipients"]
  state: RequestEscalationState
  expiresAt?: string
  isApprover: boolean
  responded: boolean
  approverCount: number
  approvals: RequestDetailApproval[]
}

export interface FindRequestResponse {
  requestId: string
  workspaceId: string
  workspaceName?: string
  title?: string
  agentId: string
  operationId?: string
  status: AgentRequestStatus
  createdAt?: string | number
  submittedBy: string
  source?: string
  isRequester: boolean
  escalations: RequestDetailEscalation[]
}

export interface RespondToEscalationRequest {
  actionId: EscalationAction
  note?: string
}
