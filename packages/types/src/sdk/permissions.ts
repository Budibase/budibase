// used in resource permissions - permissions can be at one of these levels
// endpoints will set what type of permission they require (e.g. searching requires READ)
export enum PermissionLevel {
  READ = "read",
  WRITE = "write",
  EXECUTE = "execute",
  ADMIN = "admin",
}

// used within the role, specifies base permissions
export enum BuiltinPermissionID {
  PUBLIC = "public",
  READ_ONLY = "read_only",
  WRITE = "write",
  ADMIN = "admin",
  POWER = "power",
}

// these are the global types, that govern the underlying default behaviour
export enum PermissionType {
  APP = "app",
  TABLE = "table",
  USER = "user",
  AUTOMATION = "automation",
  WEBHOOK = "webhook",
  BUILDER = "builder",
  CREATOR = "creator",
  GLOBAL_BUILDER = "globalBuilder",
  QUERY = "query",
  VIEW = "view",
  LEGACY_VIEW = "legacy_view",
}

export enum PermissionSource {
  EXPLICIT = "EXPLICIT",
  INHERITED = "INHERITED",
  BASE = "BASE",
}

export interface Permission {
  type: PermissionType
  level: PermissionLevel
}

export interface BuiltinPermission {
  _id: BuiltinPermissionID
  name: string
  permissions: Permission[]
}

export type BuiltinPermissions = {
  [key in keyof typeof BuiltinPermissionID]: {
    _id: (typeof BuiltinPermissionID)[key]
    name: string
    permissions: Permission[]
  }
}
