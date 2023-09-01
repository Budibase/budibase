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
