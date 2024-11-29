import { DeploymentDoc, DeploymentStatus } from "../../documents"

export interface PublishAppResponse extends DeploymentDoc {}

export type DeploymentProgressResponse =
  | {
      _id: string
      appId: string
      status?: DeploymentStatus
      updatedAt: number
    }
  | undefined

export type FetchDeploymentResponse = DeploymentProgressResponse[]
