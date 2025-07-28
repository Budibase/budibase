import { AppNavigation } from "../../../documents"

export interface WorkspaceAppResponse {
  _id: string
  _rev: string
  name: string
  url: string
  navigation: AppNavigation
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface InsertWorkspaceAppRequest {
  name: string
  url: string
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
}

export interface UpdateWorkspaceAppResponse {
  workspaceApp: WorkspaceAppResponse
}

export interface FetchWorkspaceAppResponse {
  workspaceApps: WorkspaceAppResponse[]
}

export interface FindWorkspaceAppResponse extends WorkspaceAppResponse {}
