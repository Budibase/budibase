export interface GetResourcePermsResponse {
  permissions: Record<string, string>
  permissionType: Record<string, string>
  inheritablePermissions?: Record<string, string>
}
