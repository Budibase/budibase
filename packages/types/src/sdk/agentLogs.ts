import type { AgentLogEntry, AgentLogSession } from "../api/web/global"
import type { Document } from "../documents"

export interface LiteLLMToolCall {
  id?: string
  function?: {
    name?: string
    arguments?: string
  }
}

export interface LiteLLMProxyMessage {
  role: string
  content?: unknown
  tool_calls?: LiteLLMToolCall[]
  tool_call_id?: string
}

export interface LiteLLMResponseMessage {
  content?: unknown
  tool_calls?: LiteLLMToolCall[] | null
}

export interface LiteLLMErrorInformation {
  traceback?: string
  error_code?: string
  error_class?: string
  llm_provider?: string
  error_message?: string
}

export interface LiteLLMRequestMetadata {
  error_information?: LiteLLMErrorInformation | null
}

export interface LiteLLMRequestRecord {
  request_id?: string
  session_id?: string
  model?: string
  prompt_tokens?: number
  completion_tokens?: number
  spend?: number
  status?: string
  startTime?: string
  endTime?: string
  end_user?: string
  user?: string
  metadata?: LiteLLMRequestMetadata
  response?: {
    model?: string
    choices?: Array<{
      message?: LiteLLMResponseMessage
    }>
  }
  proxy_server_request?: {
    user?: string
    model?: string
    messages?: LiteLLMProxyMessage[]
    metadata?: LiteLLMRequestMetadata
  }
}

export interface LiteLLMRequestListResponse {
  data?: LiteLLMRequestRecord[]
  total?: number
  total_pages?: number
}

export type LiteLLMRequestDetail = LiteLLMRequestRecord

export interface LiteLLMRequestPayload {
  response?: LiteLLMRequestDetail["response"]
  proxy_server_request?: LiteLLMRequestDetail["proxy_server_request"]
}

export interface AgentLogSessionIndexDoc extends Document {
  _id: string
  tableId: string
  type: "agent_log_session"
  agentId: string
  sessionId: string
  trigger: string
  isPreview: boolean
  firstInput: string
  startTime: string
  lastActivityAt: string
  requestIds?: string
  operations: number
  status: AgentLogSession["status"]
}

export interface AgentLogSessionSnapshot {
  agentId: string
  sessionId: string
  requestIds: string[]
  trigger: string
  isPreview: boolean
  firstInput: string
  startTime: string
  endTime: string
  status: AgentLogEntry["status"]
}

export interface IndexAgentLogOperationInput {
  agentId: string
  sessionId: string
  requestIds: string[]
  firstInput?: string
  startedAt: string
  completedAt: string
}

export interface CreateSessionLogIndexerInput {
  agentId: string
  sessionId: string
  firstInput?: string
  errorLabel: string
  startedAt?: string
}

export interface SessionLogIndexer {
  addRequestId(requestId?: string | null): void
  index(): Promise<void>
}
