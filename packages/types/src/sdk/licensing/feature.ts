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
  TRIGGER_AUTOMATION_RUN = "triggerAutomationRun",
  APP_BUILDERS = "appBuilders",
  OFFLINE = "offline",
  EXPANDED_PUBLIC_API = "expandedPublicApi",
  // deprecated - no longer licensed
  VIEW_PERMISSIONS = "viewPermissions",
  VIEW_READONLY_COLUMNS = "viewReadonlyColumns",
  BUDIBASE_AI = "budibaseAI",
  AI_CUSTOM_CONFIGS = "aiCustomConfigs",
}

export type PlanFeatures = { [key in PlanType]: Feature[] | undefined }
