import { Document } from "../document"
import { PermissionLevel } from "../../sdk"

export interface Role extends Document {
  permissionId: string
  inherits?: string
  permissions: Record<string, PermissionLevel[]>
  version?: string
  name: string
}
