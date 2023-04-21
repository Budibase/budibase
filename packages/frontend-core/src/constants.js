/**
 * Operator options for lucene queries
 */
export { OperatorOptions, SqlNumberTypeRangeMap } from "@budibase/shared-core"

// Cookie names
export const Cookies = {
  Auth: "budibase:auth",
  CurrentApp: "budibase:currentapp",
  ReturnUrl: "budibase:returnurl",
  AccountReturnUrl: "budibase:account:returnurl",
}

// Table names
export const TableNames = {
  USERS: "ta_users",
}

export const BudibaseRoles = {
  AppUser: "appUser",
  Developer: "developer",
  Admin: "admin",
}

export const BudibaseRoleOptions = [
  { label: "App User", value: BudibaseRoles.AppUser },
  { label: "Developer", value: BudibaseRoles.Developer },
  { label: "Admin", value: BudibaseRoles.Admin },
]

export const BuilderRoleDescriptions = [
  {
    value: BudibaseRoles.AppUser,
    icon: "User",
    label: "App user - Only has access to published apps",
  },
  {
    value: BudibaseRoles.Developer,
    icon: "Hammer",
    label: "Developer - Access to the app builder",
  },
  {
    value: BudibaseRoles.Admin,
    icon: "Draw",
    label: "Admin - Full access",
  },
]

export const PlanType = {
  FREE: "free",
  TEAM: "team",
  PRO: "pro",
  BUSINESS: "business",
  ENTERPRISE: "enterprise",
}

/**
 * API version header attached to all requests.
 * Version changelog:
 * v1:
 *   - Coerce types for search endpoint
 */
export const ApiVersion = "1"

export const Features = {
  USER_GROUPS: "userGroups",
  BACKUPS: "appBackups",
  ENVIRONMENT_VARIABLES: "environmentVariables",
  AUDIT_LOGS: "auditLogs",
  ENFORCEABLE_SSO: "enforceableSSO",
  BRANDING: "branding",
  SCIM: "scim",
}

// Role IDs
export const Roles = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
}

export const Themes = [
  {
    class: "lightest",
    name: "Lightest",
  },
  {
    class: "light",
    name: "Light",
  },
  {
    class: "dark",
    name: "Dark",
  },
  {
    class: "darkest",
    name: "Darkest",
  },
  {
    class: "nord",
    name: "Nord",
    base: "darkest",
  },
  {
    class: "midnight",
    name: "Midnight",
    base: "darkest",
  },
]

export const EventPublishType = {
  ENV_VAR_UPGRADE_PANEL_OPENED: "environment_variable_upgrade_panel_opened",
}
