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
  agentId: string
  title: string
  messages: UIMessage[]
}

export interface BaseToolSourceAuth {
  guidelines?: string
}

export interface GitHubToolAuth extends BaseToolSourceAuth {
  apiKey: string
  baseUrl?: string
}

export interface ConfluenceToolAuth extends BaseToolSourceAuth {
  apiKey: string
  email: string
  baseUrl?: string
}

export interface BambooHRToolAuth extends BaseToolSourceAuth {
  apiKey: string
  subdomain: string
}

export interface BudibaseToolAuth extends BaseToolSourceAuth {}

export type AgentToolSourceAuth =
  | GitHubToolAuth
  | ConfluenceToolAuth
  | BudibaseToolAuth
  | BambooHRToolAuth

export interface GitHubToolSource extends Document {
  id?: string
  type: "GITHUB"
  disabledTools: string[]
  auth: GitHubToolAuth
}

export interface ConfluenceToolSource extends Document {
  id?: string
  type: "CONFLUENCE"
  disabledTools: string[]
  auth: ConfluenceToolAuth
}

export interface BudibaseToolSource extends Document {
  id?: string
  type: "BUDIBASE"
  disabledTools: string[]
  auth: BudibaseToolAuth
}

export interface BambooHRToolSource extends Document {
  id?: string
  type: "BAMBOOHR"
  disabledTools: string[]
  auth: BambooHRToolAuth
}

export type AgentToolSource =
  | GitHubToolSource
  | ConfluenceToolSource
  | BudibaseToolSource
  | BambooHRToolSource

export type AgentToolSourceWithTools = (
  | GitHubToolSource
  | ConfluenceToolSource
  | BudibaseToolSource
  | BambooHRToolSource
) & {
  tools: Tool[]
}
