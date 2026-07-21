import type { CreateProjectRequest, PublishResourceState } from "../../api"
import type {
  Agent,
  Datasource,
  Table,
  WorkspaceFavourite,
} from "../../documents"
import type { UIAutomation } from "../stores/automations"
import type { UIWorkspaceApp } from "../workspaceApps"

export type HomeType = "all" | "app" | "automation" | "agent" | "data"
export type HomeRowType =
  | "app"
  | "automation"
  | "agent"
  | "datasource"
  | "table"

export type HomeSortColumn = "name" | "type" | "projects" | "status" | "updated"
export type HomeSortOrder = "asc" | "desc"

interface HomeRowBase {
  _id: string
  id: string
  name: string
  type: HomeRowType
  projectIds?: string[]
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

export interface DatasourceRow extends HomeRowBase {
  type: "datasource"
  resource: Datasource
}

export interface TableRow extends HomeRowBase {
  type: "table"
  resource: Table
}

export type HomeRow =
  | AppRow
  | AutomationRow
  | AgentRow
  | DatasourceRow
  | TableRow

export type ProjectFormPayload = CreateProjectRequest
