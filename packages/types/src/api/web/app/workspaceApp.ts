import { AppNavigation } from "../../../documents"

export interface WorkspaceAppResponse {
  _id: string
  _rev: string
  name: string
  url: string
  navigation: AppNavigation
  isDefault: boolean
  disabled?: boolean
}

export interface InsertWorkspaceAppRequest {
  name: string
  url: string
  disabled?: boolean
}

export interface InsertWorkspaceAppResponse {
  workspaceApp: WorkspaceAppResponse
}

export interface UpdateWorkspaceAppRequest {
  _id: string
  _rev: string
  name: string
  url: string
  navigation: AppNavigation
  disabled?: boolean
}

export interface UpdateWorkspaceAppResponse {
  workspaceApp: WorkspaceAppResponse
}

export interface FetchWorkspaceAppResponse {
  workspaceApps: WorkspaceAppResponse[]
}

export interface FindWorkspaceAppResponse extends WorkspaceAppResponse {}
