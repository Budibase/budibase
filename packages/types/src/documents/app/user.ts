import { Document } from "../document"

export interface UserMetadata extends Document {
  roleId: string
  email?: string
}
