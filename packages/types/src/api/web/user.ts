import { AccountMetadata, PlatformUser, User } from "../../documents"
import { SearchFilters } from "../../sdk"

export interface Invite {
  email: string
  info: any
}

export interface InviteWithCode extends Invite {
  code: string
}

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

export type UnsavedUser = Omit<User, "tenantId">

export interface BulkUserRequest {
  delete?: {
    users: Array<{
      userId: string
      email: string
    }>
  }
  create?: {
    roles?: any[]
    users: UnsavedUser[]
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
export interface InviteUserResponse {
  message: string
  successful: { email: string }[]
  unsuccessful: { email: string; reason: string }[]
}

export interface DeleteInviteUserRequest {
  code: string
}

export type InviteUsersRequest = InviteUserRequest[]
export type DeleteInviteUsersRequest = DeleteInviteUserRequest[]
export interface DeleteInviteUsersResponse {
  message: string
}

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
export interface SearchUsersResponse {
  data: User[]
  hasNextPage?: boolean
  nextPage?: string
}

export type FetchUsersResponse = User[]

export interface FindUserResponse extends User {}

export type LookupTenantUserResponse = PlatformUser

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
export interface AddSSoUserResponse {
  message: string
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
  lastName?: string
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

export interface DeleteUserResponse {
  message: string
}

export interface CountUserResponse {
  userCount: number
}

export interface CheckInviteResponse {
  email: string
}

export type GetUserInvitesResponse = InviteWithCode[]

export interface UpdateInviteRequest extends Omit<Invite, "email"> {
  email?: string
  builder?: {
    apps: string[]
  }
  apps: string[]
}
export interface UpdateInviteResponse extends Invite {}

export type LookupAccountHolderResponse = AccountMetadata | null
