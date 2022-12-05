export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum Cookie {
  CurrentApp = "budibase:currentapp",
  Auth = "budibase:auth",
  Init = "budibase:init",
  ACCOUNT_RETURN_URL = "budibase:account:returnurl",
  DatasourceAuth = "budibase:datasourceauth",
  OIDC_CONFIG = "budibase:oidc:config",
}

export enum Header {
  API_KEY = "x-budibase-api-key",
  LICENSE_KEY = "x-budibase-license-key",
  API_VER = "x-budibase-api-version",
  APP_ID = "x-budibase-app-id",
  TYPE = "x-budibase-type",
  PREVIEW_ROLE = "x-budibase-role",
  TENANT_ID = "x-budibase-tenant-id",
  TOKEN = "x-budibase-token",
  CSRF_TOKEN = "x-csrf-token",
}

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
}

export const MAX_VALID_DATE = new Date(2147483647000)
export const DEFAULT_TENANT_ID = "default"
