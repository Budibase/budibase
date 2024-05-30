import { User } from "../../documents"
import { SearchFilters } from "../../sdk"

export interface SaveUserResponse {
  _id: string
  _rev: string
  email: string
}

export interface UserDetails {
  _id: string
  email: string
  password?: string
}

export interface BulkUserRequest {
  delete?: {
    userIds: string[]
  }
  create?: {
    roles?: any[]
    users: User[]
    groups: any[]
  }
}

export interface BulkUserCreated {
  successful: UserDetails[]
  unsuccessful: { email: string; reason: string }[]
}

export interface BulkUserDeleted {
  successful: UserDetails[]
  unsuccessful: { _id: string; email: string; reason: string }[]
}

export interface BulkUserResponse {
  created?: BulkUserCreated
  deleted?: BulkUserDeleted
  message?: string
}

export interface InviteUserRequest {
  email: string
  userInfo: any
}

export interface DeleteInviteUserRequest {
  code: string
}

export type InviteUsersRequest = InviteUserRequest[]
export type DeleteInviteUsersRequest = DeleteInviteUserRequest[]

export interface InviteUsersResponse {
  successful: { email: string }[]
  unsuccessful: { email: string; reason: string }[]
  created?: boolean
}

export interface SearchUsersRequest {
  bookmark?: string
  query?: SearchFilters
  appId?: string
  limit?: number
  paginate?: boolean
}

export interface CreateAdminUserRequest {
  email: string
  password?: string
  tenantId: string
  ssoId?: string
  familyName?: string
  givenName?: string
}

export interface AddSSoUserRequest {
  ssoId: string
  email: string
}

export interface CreateAdminUserResponse {
  _id: string
  _rev: string
  email: string
}

export interface AcceptUserInviteRequest {
  inviteCode: string
  password: string
  firstName: string
  lastName: string
}

export interface AcceptUserInviteResponse {
  _id: string
  _rev: string
  email: string
  tenantId: string
}

export interface SyncUserRequest {
  previousUser?: User
}
