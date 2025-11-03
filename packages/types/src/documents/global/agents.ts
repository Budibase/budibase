import { Document, Message, Tool } from "../../"

export interface Agent extends Document {
  name: string
  description?: string
  aiconfig: string
  promptInstructions?: string
  allowedTools: string[]
}

export interface AgentChat extends Document {
  agentId: string
  title: string
  messages: Message[]
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
  type: "GITHUB"
  agentId: string
  disabledTools: string[]
  auth: GitHubToolAuth
}

export interface ConfluenceToolSource extends Document {
  type: "CONFLUENCE"
  agentId: string
  disabledTools: string[]
  auth: ConfluenceToolAuth
}

export interface BudibaseToolSource extends Document {
  type: "BUDIBASE"
  agentId: string
  disabledTools: string[]
  auth: BudibaseToolAuth
}

export interface BambooHRToolSource extends Document {
  type: "BAMBOOHR"
  agentId: string
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
