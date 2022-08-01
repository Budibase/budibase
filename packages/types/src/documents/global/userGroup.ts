import { Document } from "../document"
import { User } from "./user"
export interface UserGroup extends Document {
  name: string
  icon: string
  color: string
  users: groupUser[]
  apps: string[]
  roles: UserGroupRoles
  createdAt?: number
}

export interface groupUser {
  _id: string
  email: string[]
}
export interface UserGroupRoles {
  [key: string]: string
}
