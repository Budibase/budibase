import {
  DocumentType,
  InternalTable,
  prefixed,
  SEPARATOR,
} from "@budibase/types"

export { DEFAULT_BB_DATASOURCE_ID } from "@budibase/shared-core"
export {
  DocumentType,
  InternalTable,
  SEPARATOR,
  UNICODE_MAX,
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
  USER_BY_WORKSPACE = "by_app",
  USER_BY_EMAIL = "by_email2",
  BY_API_KEY = "by_api_key",
  LINK = "by_link",
  ROUTING = "screen_routes_2",
  AUTOMATION_LOGS = "automation_logs",
  ACCOUNT_BY_EMAIL = "account_by_email",
  PLATFORM_USERS_LOWERCASE = "platform_users_lowercase_2",
  USER_BY_GROUP = "user_by_group",
  WORKSPACE_BACKUP_BY_TRIGGER = "by_trigger",
}

export const DeprecatedViews: Record<string, string[]> = {
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
  SCIM_LOGS: {
    name: "scim-logs",
  },
  // Used by self-host users making use of Budicloud resources. Introduced when
  // we started letting self-host users use Budibase AI in the cloud.
  SELF_HOST_CLOUD: {
    name: "self-host-cloud",
  },
}

export const WORKSPACE_PREFIX = prefixed(DocumentType.WORKSPACE)
export const WORKSPACE_DEV = prefixed(DocumentType.WORKSPACE_DEV)
export const WORKSPACE_DEV_PREFIX = WORKSPACE_DEV
export const SQS_DATASOURCE_INTERNAL = "internal"
export const BUDIBASE_DATASOURCE_TYPE = "budibase"
export const SQLITE_DESIGN_DOC_ID = "_design/sqlite"
export const DEFAULT_JOBS_TABLE_ID = "ta_bb_jobs"
export const DEFAULT_INVENTORY_TABLE_ID = "ta_bb_inventory"
export const DEFAULT_EXPENSES_TABLE_ID = "ta_bb_expenses"
export const DEFAULT_EMPLOYEE_TABLE_ID = "ta_bb_employee"
export const USER_METADATA_PREFIX = `${DocumentType.ROW}${SEPARATOR}${InternalTable.USER_METADATA}${SEPARATOR}`

export const enum DesignDocuments {
  SQLITE = SQLITE_DESIGN_DOC_ID,
  MIGRATIONS = "_design/migrations",
}
