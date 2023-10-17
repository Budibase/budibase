import { PlanType } from "../../../sdk"

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
