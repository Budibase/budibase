import { Document, Tool } from "../../"
import type { UIMessage } from "ai"

export interface Agent extends Document {
  name: string
  description?: string
  aiconfig: string
  allowedTools?: AgentToolSource[]
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

export enum ToolSourceType {
  BUDIBASE = "BUDIBASE",
  REST_QUERY = "REST_QUERY",
}

export interface BaseToolSource extends Document {
  id?: string
  label?: string
  type: ToolSourceType
  disabledTools: string[]
  agentId: string
}

export interface BudibaseToolSource extends BaseToolSource {
  id?: string
  type: ToolSourceType.BUDIBASE
  auth: BudibaseToolAuth
  agentId: string
}

export interface RestQueryToolSource extends BaseToolSource {
  type: ToolSourceType.REST_QUERY
  datasourceId: string
  queryIds: string[]
  auth: RestQueryToolAuth
}

export type AgentToolSource = BudibaseToolSource | RestQueryToolSource

export type AgentToolSourceWithTools = (
  | BudibaseToolSource
  | RestQueryToolSource
) & {
  tools: Tool[]
}
