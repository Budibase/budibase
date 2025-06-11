export interface ResourceUsageRequest {
  workspaceAppIds?: string[]
  automationIds?: string[]
}

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
}

export interface UsedResource {
  id: string
  name?: string
  type: ResourceType
}

export interface ResourceUsageResponse {
  resources: UsedResource[]
}
