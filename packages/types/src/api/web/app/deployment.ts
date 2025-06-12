import { DeploymentDoc, DeploymentStatus } from "../../../documents"

export interface PublishAppRequest {
  automationIds?: string[]
  workspaceAppIds?: string[]
}

export interface PublishAppResponse extends DeploymentDoc {}

export interface PublishStatusResponse {
  workspaceApps: Record<string, { published: boolean; name: string }>
  automations: Record<string, { published: boolean; name: string }>
}

export interface DeploymentProgressResponse {
  _id: string
  appId: string
  status?: DeploymentStatus
  updatedAt: number
}

export type FetchDeploymentResponse = DeploymentProgressResponse[]
