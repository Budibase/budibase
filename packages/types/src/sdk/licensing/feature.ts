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
  EXPANDED_PUBLIC_API = "expandedPublicApi",
  VIEW_PERMISSIONS = "viewPermissions",
}

export type PlanFeatures = { [key in PlanType]: Feature[] | undefined }
