import { Document } from "../../"
import type { UIMessage } from "ai"

export interface ChatApp extends Document {
  title?: string
  greeting?: string
  description?: string
  theme?: string
  agentIds: string[]
  live?: boolean
  settings?: Record<string, any>
}

export interface ChatConversation extends Document {
  chatAppId: string
  userId?: string
  title?: string
  messages: UIMessage[]
}
