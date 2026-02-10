export interface GetWorkspaceHomeMetricsResponse {
  totalUsers: number
  automationRunsThisMonth: number
  agentActionsThisMonth: number
  periodStart: string
  periodEnd: string
}

export interface WorkspaceHomeChat {
  _id: string
  chatAppId: string
  agentId: string
  title?: string
  createdAt?: string
  updatedAt?: string
}

export interface GetWorkspaceHomeChatsResponse {
  chats: WorkspaceHomeChat[]
}
