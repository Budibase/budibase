export interface ResourceUsageRequest {}

export enum UsedByType {
  WORKSPACE = "workspace",
  AUTOMATION = "automation",
}

export enum ResourceType {
  DATASOURCE = "datasource",
  TABLE = "table",
  ROW_ACTION = "row_action",
  QUERY = "query",
  AUTOMATION = "automation",
  WORKSPACE_APP = "workspace_app",
}

export interface UsedResource {
  id: string
  name: string
  type: ResourceType
}

export interface ResourceUsageResponse {
  resources: Record<string, UsedResource[]>
}

export interface DuplicateResourceToWorkspaceRequest {
  toWorkspace: string
  resources: string[]
}

export interface DuplicateResourceToWorkspaceResponse {
  resources: Partial<Record<ResourceType, string[]>>
}

export interface DuplicateResourcePreviewResponse {
  toCopy: string[]
  existing: string[]
}
