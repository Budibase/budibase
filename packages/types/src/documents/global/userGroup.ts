import { PaginationResponse } from "../../api"
import { Document } from "../document"

export interface UserGroup extends Document {
  name: string
  icon: string
  color: string
  users?: GroupUser[]
  roles?: UserGroupRoles
  // same structure as users
  builder?: {
    apps: string[]
  }
  createdAt?: number
  scimInfo?: {
    externalId: string
    isSync: boolean
  }
}

export interface GroupUser {
  _id: string
  email: string
}

export interface UserGroupRoles {
  [key: string]: string | undefined
}

export interface SearchGroupRequest {}
export interface SearchGroupResponse {
  data: UserGroup[]
}

export interface SearchUserGroupResponse extends PaginationResponse {
  users: {
    _id: any
    email: any
  }[]
}
