export enum DeploymentStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILURE = "FAILURE",
}

export interface DeploymentDoc {
  _id: string
  verification: any
  status?: DeploymentStatus
  history?: Record<
    string,
    {
      _id: string
      appId: string
      status?: DeploymentStatus
      updatedAt: number
    }
  >
  err?: any
  appUrl?: string
}
