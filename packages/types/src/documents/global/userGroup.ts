import { Document } from "../document"
import { User } from "./user"
export interface UserGroup extends Document {
  name: string
  icon: string
  color: string
  users: User[]
  apps: any[]
  roles: UserGroupRoles
  createdAt?: number
}

export interface UserGroupRoles {
  [key: string]: string
}
