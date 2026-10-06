export enum DeploymentStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILURE = "FAILURE",
}

// the deployment doc is rewritten in full on every publish, so the server caps
// how many entries it keeps - clients read the whole bounded history in one page
export const MAX_DEPLOYMENT_HISTORY = 50

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
