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
  ragMinDistance: number
}

export interface AgentMessageRagSource {
  sourceId: string
  fileId?: string
  filename?: string
  chunkCount: number
}

export interface AgentMessageMetadata {
  ragSources?: AgentMessageRagSource[]
}

export interface AgentChat extends Document {
  agentId?: string
  title: string
  messages: UIMessage<AgentMessageMetadata>[]
}

export enum AgentFileStatus {
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}

export interface AgentFile extends Document {
  agentId: string
  filename: string
  mimetype?: string
  size?: number
  ragSourceId: string
  status: AgentFileStatus
  chunkCount: number
  uploadedBy: string
  errorMessage?: string
  processedAt?: string
}
