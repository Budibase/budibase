import { DeploymentDoc, DeploymentStatus } from "../../../documents"

export interface PublishAppRequest {
  automationIds?: string[]
  workspaceAppIds?: string[]
}

export interface PublishAppResponse extends DeploymentDoc {}

export enum PublishResourceState {
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
  DISABLED = "disabled",
}

export type PublishStatusResource = {
  published: boolean
  name: string
  publishedAt?: string
  unpublishedChanges?: boolean
  state: PublishResourceState
}

export interface PublishStatusResponse {
  workspaceApps: Record<string, PublishStatusResource>
  automations: Record<string, PublishStatusResource>
}

export interface DeploymentProgressResponse {
  _id: string
  appId: string
  status?: DeploymentStatus
  updatedAt: number
}

export type FetchDeploymentResponse = DeploymentProgressResponse[]
