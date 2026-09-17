import { DeploymentDoc, DeploymentHistoryEntry } from "../../../documents"

export interface PublishWorkspaceRequest {
  automationIds?: string[]
  workspaceAppIds?: string[]
  seedProductionTables?: boolean
}

export interface PublishWorkspaceResponse extends DeploymentDoc {}

export enum PublishResourceState {
  PUBLISHED = "published",
  DISABLED = "disabled",
}

export type PublishStatusResource = {
  published: boolean
  name: string
  publishedAt?: string
  lastDeployedLiveAt?: string
  unpublishedChanges?: boolean
  state: PublishResourceState
}

export interface PublishStatusResponse {
  workspaceApps: Record<string, PublishStatusResource>
  automations: Record<string, PublishStatusResource>
  tables: Record<string, PublishStatusResource>
  agents: Record<string, PublishStatusResource>
}

export interface DeploymentProgressResponse extends DeploymentHistoryEntry {}

export type FetchDeploymentResponse = DeploymentProgressResponse[]
