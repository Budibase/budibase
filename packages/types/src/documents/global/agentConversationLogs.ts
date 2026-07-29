import { Document } from "../document"

export const AGENT_CONVERSATION_LOG_TYPE = "agentConversationLog"

export type AgentConversationLogRole =
  | "user"
  | "assistant"
  | "tool_call"
  | "tool_result"

export interface AgentConversationLogDoc extends Document {
  type: typeof AGENT_CONVERSATION_LOG_TYPE
  conversationId: string
  messageId: string
  entryId: string
  agentId: string
  appId?: string
  userId: string
  timestamp: string
  role: AgentConversationLogRole
  text: string
  channelProvider?: string
  transient?: boolean
  metadata?: Record<string, unknown>
}
