import { PermissionLevel, PlanType } from "../../../sdk"

export interface ResourcePermissionInfo {
  role: string
  permissionType: string
  inheritablePermission?: string
}

export interface GetResourcePermsResponse {
  permissions: Record<string, ResourcePermissionInfo>
  requiresPlanToModify?: PlanType
}

export interface GetDependantResourcesResponse {
  resourceByType?: Record<string, number>
}

export interface AddedPermission {
  _id?: string
  rev?: string
  error?: string
  reason?: string
}

export type AddPermissionResponse = AddedPermission[]

export interface AddPermissionRequest {
  roleId: string
  resourceId: string
  level: PermissionLevel
}

export interface RemovePermissionRequest extends AddPermissionRequest {}
export interface RemovePermissionResponse extends AddPermissionResponse {}
