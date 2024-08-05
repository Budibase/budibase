import { Document } from "../document"

export interface Role extends Document {
  permissionId: string
  inherits?: string | string[]
  permissions: { [key: string]: string[] }
  version?: string
  name: string
}
