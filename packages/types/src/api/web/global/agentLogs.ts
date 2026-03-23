export interface AgentLogEntry {
  requestId: string
  sessionId: string
  model: string
  inputTokens: number
  outputTokens: number
  spend: number
  startTime: string
  endTime: string
  status: "success" | "error"
}

export type AgentLogEnvironment = "development" | "production"

export interface AgentLogSession {
  sessionId: string
  environment: AgentLogEnvironment
  firstInput: string
  trigger: string
  isPreview: boolean
  startTime: string
  operations: number
  status: "success" | "error"
  entries: AgentLogEntry[]
}

export interface FetchAgentLogsResponse {
  sessions: AgentLogSession[]
  hasMore: boolean
  nextBookmark?: string
}

export interface AgentLogMessage {
  role: string
  content: string
}

export interface AgentLogToolCall {
  id?: string
  name: string
  displayName?: string
  arguments: string
}

export interface AgentLogToolResult {
  toolCallId?: string
  name: string
  displayName?: string
  content: string
}

export interface AgentLogRequestError {
  message: string
  code?: string
  errorClass?: string
  provider?: string
  traceback?: string
}

export interface AgentLogRequestDetail {
  requestId: string
  model: string
  messages: AgentLogMessage[]
  response: string
  error?: AgentLogRequestError
  inputToolCalls: AgentLogToolCall[]
  toolCalls: AgentLogToolCall[]
  toolResults: AgentLogToolResult[]
  inputTokens: number
  outputTokens: number
  spend: number
  startTime: string
  endTime: string
}
