import { prefixed, DocumentType } from "@budibase/types"
export {
  SEPARATOR,
  UNICODE_MAX,
  DocumentType,
  InternalTable,
} from "@budibase/types"

/**
 * Can be used to create a few different forms of querying a view.
 */
export enum AutomationViewMode {
  ALL = "all",
  AUTOMATION = "automation",
  STATUS = "status",
}

export enum ViewName {
  USER_BY_APP = "by_app",
  USER_BY_EMAIL = "by_email2",
  BY_API_KEY = "by_api_key",
  LINK = "by_link",
  ROUTING = "screen_routes",
  AUTOMATION_LOGS = "automation_logs",
  ACCOUNT_BY_EMAIL = "account_by_email",
  PLATFORM_USERS_LOWERCASE = "platform_users_lowercase_2",
  USER_BY_GROUP = "user_by_group",
  APP_BACKUP_BY_TRIGGER = "by_trigger",
}

export const DeprecatedViews = {
  [ViewName.USER_BY_EMAIL]: [
    // removed due to inaccuracy in view doc filter logic
    "by_email",
  ],
}

export const StaticDatabases = {
  GLOBAL: {
    name: "global-db",
    docs: {
      apiKeys: "apikeys",
      usageQuota: "usage_quota",
      licenseInfo: "license_info",
      environmentVariables: "environmentvariables",
    },
  },
  // contains information about tenancy and so on
  PLATFORM_INFO: {
    name: "global-info",
    docs: {
      tenants: "tenants",
      install: "install",
    },
  },
  AUDIT_LOGS: {
    name: "audit-logs",
  },
}

export const APP_PREFIX = prefixed(DocumentType.APP)
export const APP_DEV = prefixed(DocumentType.APP_DEV)
export const APP_DEV_PREFIX = APP_DEV
export const BUDIBASE_DATASOURCE_TYPE = "budibase"
