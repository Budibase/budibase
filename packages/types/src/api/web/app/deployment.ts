import { DeploymentDoc, DeploymentStatus } from "../../../documents"

export interface PublishAppResponse extends DeploymentDoc {}

export interface DeploymentProgressResponse {
  _id: string
  appId: string
  status?: DeploymentStatus
  updatedAt: number
}

export type FetchDeploymentResponse = DeploymentProgressResponse[]
