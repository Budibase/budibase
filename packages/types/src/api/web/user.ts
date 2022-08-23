import { User } from "../../documents"

export interface BulkCreateUsersRequest {
  users: User[]
  groups: any[]
}

export interface BulkDeleteUsersRequest {
  userIds: string[]
}