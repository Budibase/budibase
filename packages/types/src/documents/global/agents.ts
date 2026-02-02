import { Document } from "../../"
import type { UIMessage } from "ai"

export enum ToolType {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL",
  AUTOMATION = "AUTOMATION",
  REST_QUERY = "REST_QUERY",
  SEARCH = "SEARCH",
}

export interface ToolMetadata {
  name: string
  readableName?: string
  description?: string
  sourceType: ToolType
  sourceLabel?: string
  sourceIconType?: string
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
  embeddingModel?: string
  vectorDb?: string
  ragMinDistance?: number
  ragTopK?: number
}

export interface AgentMessageRagSource {
  sourceId: string
  fileId?: string
  filename?: string
  chunkCount: number
}

export interface AgentMessageMetadata {
  ragSources?: AgentMessageRagSource[]
  createdAt?: number
  completedAt?: number
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
