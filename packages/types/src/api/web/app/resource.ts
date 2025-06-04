export interface ResourceAnalysisRequest {
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
}

export interface UsedResource {
  id: string
  name: string
  type: ResourceType
  usedBy: string
  usedByType: UsedByType
}

export interface ResourceAnalysisResponse {
  resources: UsedResource[]
}
