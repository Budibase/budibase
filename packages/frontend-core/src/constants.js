/**
 * Operator options for lucene queries
 */
export const OperatorOptions = {
  Equals: {
    value: "equal",
    label: "Equals",
  },
  NotEquals: {
    value: "notEqual",
    label: "Not equals",
  },
  Empty: {
    value: "empty",
    label: "Is empty",
  },
  NotEmpty: {
    value: "notEmpty",
    label: "Is not empty",
  },
  StartsWith: {
    value: "string",
    label: "Starts with",
  },
  Like: {
    value: "fuzzy",
    label: "Like",
  },
  MoreThan: {
    value: "rangeLow",
    label: "More than",
  },
  LessThan: {
    value: "rangeHigh",
    label: "Less than",
  },
  Contains: {
    value: "equal",
    label: "Contains",
  },
  NotContains: {
    value: "notEqual",
    label: "Does Not Contain",
  },
}

// Cookie names
export const Cookies = {
  Auth: "budibase:auth",
  CurrentApp: "budibase:currentapp",
  ReturnUrl: "budibase:returnurl",
}

// Table names
export const TableNames = {
  USERS: "ta_users",
}

export const BbRoles = [
  { label: "App User", value: "appUser" },
  { label: "Developer", value: "developer" },
  { label: "Admin", value: "admin" },
]

export const BuilderRoleDescriptions = [
  {
    value: "appUser",
    icon: "User",
    label: "App user - Only has access to published apps",
  },
  {
    value: "developer",
    icon: "Hammer",
    label: "Developer - Access to the app builder",
  },
  {
    value: "admin",
    icon: "Draw",
    label: "Admin - Full access",
  },
]

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
}
