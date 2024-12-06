import { Role } from "../../../documents"

interface GlobalRoleResponse {
  roles: Role[]
  name: string
  version: string
  url?: string
}

export interface FetchGlobalRolesResponse
  extends Record<string, GlobalRoleResponse> {}

export interface FindGlobalRoleResponse extends GlobalRoleResponse {}

export interface RemoveAppRoleResponse {
  message: string
}
