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

export interface AgentLogSession {
  sessionId: string
  firstInput: string
  trigger: "Chat" | "Automation"
  startTime: string
  operations: number
  status: "success" | "error"
  entries: AgentLogEntry[]
}

export interface FetchAgentLogsResponse {
  sessions: AgentLogSession[]
  currentPage: number
  hasMore: boolean
}

export interface AgentLogMessage {
  role: string
  content: string
}

export interface AgentLogToolCall {
  name: string
  arguments: string
  result?: string
}

export interface AgentLogRequestDetail {
  requestId: string
  model: string
  messages: AgentLogMessage[]
  response: string
  toolCalls: AgentLogToolCall[]
  inputTokens: number
  outputTokens: number
  startTime: string
  endTime: string
}
