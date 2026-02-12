import type { PublishResourceState } from "../../api"
import type { Agent, WorkspaceFavourite } from "../../documents"
import type { UIAutomation } from "../stores/automations"
import type { UIWorkspaceApp } from "../workspaceApps"

export type HomeType = "all" | "app" | "automation" | "agent"
export type HomeRowType = "app" | "automation" | "agent"

export type HomeSortColumn = "name" | "type" | "status" | "created"
export type HomeSortOrder = "asc" | "desc"

interface HomeRowBase {
  _id: string
  id: string
  name: string
  type: HomeRowType
  updatedAt?: string
  createdAt?: string
  favourite: WorkspaceFavourite
  icon: string
  iconColor: string
}

export interface AppRow extends HomeRowBase {
  type: "app"
  resource: UIWorkspaceApp
  status: PublishResourceState
}

export interface AutomationRow extends HomeRowBase {
  type: "automation"
  resource: UIAutomation
  status: PublishResourceState
}

export interface AgentRow extends HomeRowBase {
  type: "agent"
  resource: Agent
  live: boolean
}

export type HomeRow = AppRow | AutomationRow | AgentRow
