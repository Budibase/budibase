export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum Cookie {
  Auth = "budibase:auth",
  Init = "budibase:init",
  ACCOUNT_RETURN_URL = "budibase:account:returnurl",
  DatasourceAuth = "budibase:datasourceauth",
  OIDC_CONFIG = "budibase:oidc:config",
}

export { Header } from "@budibase/shared-core"

export enum GlobalRole {
  OWNER = "owner",
  ADMIN = "admin",
  BUILDER = "builder",
  WORKSPACE_MANAGER = "workspace_manager",
}

export enum Config {
  SETTINGS = "settings",
  ACCOUNT = "account",
  SMTP = "smtp",
  GOOGLE = "google",
  OIDC = "oidc",
  OIDC_LOGOS = "logos_oidc",
  SCIM = "scim",
  AI = "AI",
}

export const MIN_VALID_DATE = new Date(-2147483647000)
export const MAX_VALID_DATE = new Date(2147483647000)
export const DEFAULT_TENANT_ID = "default"
