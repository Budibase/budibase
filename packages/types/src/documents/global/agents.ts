import { Document } from "../../"
import type { UIMessage } from "ai"

export enum ToolType {
  BUDIBASE = "BUDIBASE",
  REST_QUERY = "REST_QUERY",
}

export interface ToolMetadata {
  name: string
  description?: string
  sourceType: ToolType
  sourceLabel?: string
}

export interface Agent extends Document {
  name: string
  description?: string
  aiconfig: string
  promptInstructions?: string
  goal?: string
  live?: boolean
  icon?: string
  iconColor?: string
  createdBy?: string
  enabledTools?: string[]
}

export interface AgentChat extends Document {
  agentId?: string
  title: string
  messages: UIMessage[]
}
