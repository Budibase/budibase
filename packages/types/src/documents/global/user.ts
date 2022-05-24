import { Document } from "../document"

export interface User extends Document {
  roles: UserRoles
  builder?: {
    global: boolean
  }
  admin?: {
    global: boolean
  }
  providerType?: string
  tenantId: string
  email: string
  password?: string
  status?: string
}

export interface UserRoles {
  [key: string]: string
}
