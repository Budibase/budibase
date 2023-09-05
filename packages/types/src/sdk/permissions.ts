export enum PermissionLevel {
  READ = "read",
  WRITE = "write",
  EXECUTE = "execute",
  ADMIN = "admin",
}

// these are the global types, that govern the underlying default behaviour
export enum PermissionType {
  APP = "app",
  TABLE = "table",
  USER = "user",
  AUTOMATION = "automation",
  WEBHOOK = "webhook",
  BUILDER = "builder",
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
