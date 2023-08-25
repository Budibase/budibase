import { PlanType } from "./plan"

export enum Feature {
  USER_GROUPS = "userGroups",
  APP_BACKUPS = "appBackups",
  ENVIRONMENT_VARIABLES = "environmentVariables",
  AUDIT_LOGS = "auditLogs",
  ENFORCEABLE_SSO = "enforceableSSO",
  BRANDING = "branding",
  SCIM = "scim",
  SYNC_AUTOMATIONS = "syncAutomations",
  APP_BUILDERS = "appBuilders",
  OFFLINE = "offline",
  USER_ROLE_PUBLIC_API = "userRolePublicApi",
  VIEW_PERMISSIONS = "viewPermission",
}

export type PlanFeatures = { [key in PlanType]: Feature[] | undefined }
