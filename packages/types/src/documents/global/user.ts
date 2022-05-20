import { Document } from "../document"

export interface User extends Document {
  roles: UserRoles
  builder?: {
    global: boolean
  }
  admin?: {
    global: boolean
  }
}

export interface UserRoles {
  [key: string]: string
}
