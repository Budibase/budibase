/**
 * Operator options for lucene queries
 */
export { OperatorOptions, SqlNumberTypeRangeMap } from "@budibase/shared-core"
export { Feature as Features } from "@budibase/types"

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
  Creator: "creator",
  Admin: "admin",
}

export const BudibaseRoleOptionsOld = [
  {
    label: "Developer",
    value: BudibaseRoles.Developer,
  },
]
export const BudibaseRoleOptions = [
  {
    label: "Account admin",
    value: BudibaseRoles.Admin,
    subtitle: "Has full access to all apps and settings in your account",
  },
  {
    label: "Creator",
    value: BudibaseRoles.Creator,
    subtitle: "Can create and edit apps they have access to",
  },
  {
    label: "App user",
    value: BudibaseRoles.AppUser,
    subtitle: "Can only use published apps they have access to",
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

// Role IDs
export const Roles = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
  CREATOR: "CREATOR",
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

export const ContextScopes = {
  Local: "local",
  Global: "global",
}

export const FieldTypeToComponentMap = {
  string: "stringfield",
  number: "numberfield",
  bigint: "bigintfield",
  options: "optionsfield",
  array: "multifieldselect",
  boolean: "booleanfield",
  longform: "longformfield",
  datetime: "datetimefield",
  attachment: "attachmentfield",
  link: "relationshipfield",
  json: "jsonfield",
  barcodeqr: "codescanner",
  bb_reference: "bbreferencefield",
}
