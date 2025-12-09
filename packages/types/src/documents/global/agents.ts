import { Document } from "../../"
import type { UIMessage } from "ai"

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
}

export interface AgentChat extends Document {
  agentId?: string
  title: string
  messages: UIMessage[]
}

export interface BaseToolSourceAuth {
  guidelines?: string
}

export interface BudibaseToolAuth extends BaseToolSourceAuth {}

export interface RestQueryToolAuth extends BaseToolSourceAuth {}

export type AgentToolSourceAuth = BudibaseToolAuth | RestQueryToolAuth

export enum ToolType {
  BUDIBASE = "BUDIBASE",
  REST_QUERY = "REST_QUERY",
}

export interface Tool extends Document {
  name: string
  description?: string
  sourceType: ToolType
  sourceLabel?: string
  auth?: AgentToolSourceAuth
}
