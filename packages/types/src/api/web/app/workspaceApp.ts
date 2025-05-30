import { AppNavigation } from "../../../documents"

export interface WorkspaceAppResponse {
  _id: string
  _rev: string
  name: string
  urlPrefix: string
  icon: string
  iconColor?: string
  navigation: AppNavigation
}

export interface InsertWorkspaceAppRequest {
  name: string
  urlPrefix: string
  icon: string
  iconColor?: string
}

export interface InsertWorkspaceAppResponse {
  workspaceApp: WorkspaceAppResponse
}

export interface UpdateWorkspaceAppRequest {
  _id: string
  _rev: string
  name: string
  urlPrefix: string
  icon: string
  iconColor?: string
  navigation: AppNavigation
}

export interface UpdateWorkspaceAppResponse {
  workspaceApp: WorkspaceAppResponse
}

export interface FetchWorkspaceAppResponse {
  workspaceApps: WorkspaceAppResponse[]
}
