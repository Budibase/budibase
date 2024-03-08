import { Role } from "../../documents"

export interface SaveRoleRequest {
  _id?: string
  _rev?: string
  name: string
  inherits: string
  permissionId: string
  version: string
}

export interface SaveRoleResponse extends Role {}

export interface FindRoleResponse extends Role {}

export type FetchRolesResponse = Role[]

export interface DestroyRoleResponse {
  message: string
}

export type AccessibleRolesResponse = string[]
