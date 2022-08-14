import { Document } from "../document"

export interface User extends Document {
  tenantId: string
  email: string
  roles: UserRoles
  builder?: {
    global: boolean
  }
  admin?: {
    global: boolean
  }
  providerType?: string
  password?: string
  status?: string
  createdAt?: number // override the default createdAt behaviour - users sdk historically set this to Date.now()
  userGroups?: string[]
}

export interface UserRoles {
  [key: string]: string
}
