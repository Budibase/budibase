import { User } from "../../documents"

export interface SaveUserResponse {
  _id: string
  _rev: string
  email: string
}

export interface UserDetails {
  _id: string
  email: string
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

export interface BulkUserResponse {
  created?: {
    successful: UserDetails[]
    unsuccessful: { email: string; reason: string }[]
  }
  deleted?: {
    successful: UserDetails[]
    unsuccessful: { _id: string; email: string; reason: string }[]
  }
  message?: string
}

export interface InviteUserRequest {
  email: string
  userInfo: any
}

export type InviteUsersRequest = InviteUserRequest[]

export interface InviteUsersResponse {
  successful: { email: string }[]
  unsuccessful: { email: string; reason: string }[]
}

export interface SearchUsersRequest {
  page?: string
  email?: string
  appId?: string
  paginated?: boolean
}

export interface CreateAdminUserRequest {
  email: string
  password: string
  tenantId: string
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
}

export interface SyncUserRequest {
  previousUser?: User
}
