import { PlanType } from "./plan"

export enum Feature {
  USER_GROUPS = "userGroups",
  APP_BACKUPS = "appBackups",
  ENVIRONMENT_VARIABLES = "environmentVariables",
  AUDIT_LOGS = "auditLogs",
  ENFORCEABLE_SSO = "enforceableSSO",
  BRANDING = "branding",
  SCIM = "scim",
}

export type PlanFeatures = { [ key in PlanType]: Feature[] | undefined }
