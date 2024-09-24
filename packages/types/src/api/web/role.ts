import { Role, RoleUIMetadata } from "../../documents"

export interface SaveRoleRequest {
  _id?: string
  _rev?: string
  name: string
  inherits: string
  permissionId: string
  version: string
  uiMetadata?: RoleUIMetadata
}

export interface SaveRoleResponse extends Role {}

export interface FindRoleResponse extends Role {}

export type FetchRolesResponse = Role[]

export interface DestroyRoleResponse {
  message: string
}

export type AccessibleRolesResponse = string[]
