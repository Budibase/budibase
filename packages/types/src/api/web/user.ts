import { User } from "../../documents"

export interface CreateUserResponse {
  _id: string
  _rev: string
  email: string
}

export interface BulkCreateUsersRequest {
  users: User[]
  groups: any[]
}

export interface UserDetails {
  _id: string
  email: string
}

export interface BulkCreateUsersResponse {
  successful: UserDetails[]
  unsuccessful: { email: string; reason: string }[]
}

export interface BulkDeleteUsersRequest {
  userIds: string[]
}

export interface BulkDeleteUsersResponse {
  successful: UserDetails[]
  unsuccessful: { _id: string; email: string; reason: string }[]
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
