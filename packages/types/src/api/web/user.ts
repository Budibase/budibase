import { User } from "../../documents"

export interface CreateUserResponse {
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
