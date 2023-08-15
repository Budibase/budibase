export interface RoleAssignmentRequest {
  role?: {
    appId: string
    roleId: string
  }
  appBuilder?: {
    appId: string
  }
  builder?: boolean
  admin?: boolean
  userIds: string[]
}

export interface RoleAssignmentResponse {
  userIds: string[]
}
