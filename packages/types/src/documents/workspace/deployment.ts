export enum DeploymentStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILURE = "FAILURE",
}

export interface DeploymentHistoryEntry {
  _id: string
  appId: string
  status?: DeploymentStatus
  err?: string
  updatedAt: number
}

export interface DeploymentDoc {
  _id: string
  verification?: any
  status?: DeploymentStatus
  history?: Record<string, DeploymentHistoryEntry>
  err?: any
  appUrl?: string
}
