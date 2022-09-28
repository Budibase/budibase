import { Document } from "../document"

export interface UserGroup extends Document {
  name: string
  icon: string
  color: string
  users?: GroupUser[]
  roles?: UserGroupRoles
  createdAt?: number
}

export interface GroupUser {
  _id: string
  email: string
}

export interface UserGroupRoles {
  [key: string]: string
}
