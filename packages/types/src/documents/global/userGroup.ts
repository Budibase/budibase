import { Document } from "../document"

export interface UserGroup extends Document {
  name: string
  icon: string
  color: string
  users?: GroupUser[]
  roles?: UserGroupRoles
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
  [key: string]: string
}
