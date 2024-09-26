import { Document } from "../document"
import { PermissionLevel } from "../../sdk"

export interface RoleUIMetadata {
  displayName?: string
  color?: string
  description?: string
}

export interface Role extends Document {
  permissionId: string
  inherits?: string | string[]
  permissions: Record<string, PermissionLevel[]>
  version?: string
  name: string
  uiMetadata?: RoleUIMetadata
}
