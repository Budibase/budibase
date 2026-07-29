import { BasicPaginationRequest, PaginationResponse } from "../"
import { AgentConversationLogRole, User, Workspace } from "../../../"

export interface AgentConversationLogSearchParams {
  userIds?: string[]
  appIds?: string[]
  agentIds?: string[]
  channelProviders?: string[]
  startDate?: string
  endDate?: string
  fullSearch?: string
  bookmark?: string
}

export interface SearchAgentConversationLogsRequest
  extends BasicPaginationRequest,
    AgentConversationLogSearchParams {}

export interface DownloadAgentConversationLogsRequest
  extends AgentConversationLogSearchParams {}

export interface AgentConversationLogEntry {
  messageId: string
  entryId: string
  timestamp: string
  role: AgentConversationLogRole
  text: string
  metadata?: Record<string, unknown>
}

export interface AgentConversationLogConversation {
  conversationId: string
  agentId: string
  appId?: string
  userId: string
  user?: User
  app?: Workspace
  channelProvider?: string
  transient?: boolean
  startTime: string
  lastActivityAt: string
  entries: AgentConversationLogEntry[]
}

export interface SearchAgentConversationLogsResponse
  extends PaginationResponse {
  data: AgentConversationLogConversation[]
}
