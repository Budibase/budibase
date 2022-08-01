import { Hosting } from "../hosting"

export enum Event {
  // USER
  USER_CREATED = "user:created",
  USER_UPDATED = "user:updated",
  USER_DELETED = "user:deleted",

  // USER / PERMISSIONS
  USER_PERMISSION_ADMIN_ASSIGNED = "user:admin:assigned",
  USER_PERMISSION_ADMIN_REMOVED = "user:admin:removed",
  USER_PERMISSION_BUILDER_ASSIGNED = "user:builder:assigned",
  USER_PERMISSION_BUILDER_REMOVED = "user:builder:removed",

  // USER / INVITE
  USER_INVITED = "user:invited",
  USER_INVITED_ACCEPTED = "user:invite:accepted",

  // USER / PASSWORD
  USER_PASSWORD_FORCE_RESET = "user:password:force:reset",
  USER_PASSWORD_UPDATED = "user:password:updated",
  USER_PASSWORD_RESET_REQUESTED = "user:password:reset:requested",
  USER_PASSWORD_RESET = "user:password:reset",

  // EMAIL
  EMAIL_SMTP_CREATED = "email:smtp:created",
  EMAIL_SMTP_UPDATED = "email:smtp:updated",

  // AUTH
  AUTH_SSO_CREATED = "auth:sso:created",
  AUTH_SSO_UPDATED = "auth:sso:updated",
  AUTH_SSO_ACTIVATED = "auth:sso:activated",
  AUTH_SSO_DEACTIVATED = "auth:sso:deactivated",
  AUTH_LOGIN = "auth:login",
  AUTH_LOGOUT = "auth:logout",

  // ORG
  ORG_NAME_UPDATED = "org:info:name:updated",
  ORG_LOGO_UPDATED = "org:info:logo:updated",
  ORG_PLATFORM_URL_UPDATED = "org:platformurl:updated",

  // INSTALLATION
  INSTALLATION_VERSION_CHECKED = "installation:version:checked",
  INSTALLATION_VERSION_UPGRADED = "installation:version:upgraded",
  INSTALLATION_VERSION_DOWNGRADED = "installation:version:downgraded",
  INSTALLATION_FIRST_STARTUP = "installation:firstStartup",

  // ORG / ANALYTICS
  ANALYTICS_OPT_OUT = "analytics:opt:out",
  ANALYTICS_OPT_IN = "analytics:opt:in",

  // APP
  APP_CREATED = "app:created",
  APP_UPDATED = "app:updated",
  APP_DELETED = "app:deleted",
  APP_PUBLISHED = "app:published",
  APP_UNPUBLISHED = "app:unpublished",
  APP_TEMPLATE_IMPORTED = "app:template:imported",
  APP_FILE_IMPORTED = "app:file:imported",
  APP_VERSION_UPDATED = "app:version:updated",
  APP_VERSION_REVERTED = "app:version:reverted",
  APP_REVERTED = "app:reverted",
  APP_EXPORTED = "app:exported",

  // ROLE
  ROLE_CREATED = "role:created",
  ROLE_UPDATED = "role:updated",
  ROLE_DELETED = "role:deleted",
  ROLE_ASSIGNED = "role:assigned",
  ROLE_UNASSIGNED = "role:unassigned",

  // SERVE
  SERVED_BUILDER = "served:builder",
  SERVED_APP = "served:app",
  SERVED_APP_PREVIEW = "served:app:preview",

  // DATASOURCE
  DATASOURCE_CREATED = "datasource:created",
  DATASOURCE_UPDATED = "datasource:updated",
  DATASOURCE_DELETED = "datasource:deleted",

  // QUERY
  QUERY_CREATED = "query:created",
  QUERY_UPDATED = "query:updated",
  QUERY_DELETED = "query:deleted",
  QUERY_IMPORT = "query:import",
  QUERIES_RUN = "queries:run",
  QUERY_PREVIEWED = "query:previewed",

  // TABLE
  TABLE_CREATED = "table:created",
  TABLE_UPDATED = "table:updated",
  TABLE_DELETED = "table:deleted",
  TABLE_EXPORTED = "table:exported",
  TABLE_IMPORTED = "table:imported",
  TABLE_DATA_IMPORTED = "table:data:imported",

  // VIEW
  VIEW_CREATED = "view:created",
  VIEW_UPDATED = "view:updated",
  VIEW_DELETED = "view:deleted",
  VIEW_EXPORTED = "view:exported",
  VIEW_FILTER_CREATED = "view:filter:created",
  VIEW_FILTER_UPDATED = "view:filter:updated",
  VIEW_FILTER_DELETED = "view:filter:deleted",
  VIEW_CALCULATION_CREATED = "view:calculation:created",
  VIEW_CALCULATION_UPDATED = "view:calculation:updated",
  VIEW_CALCULATION_DELETED = "view:calculation:deleted",

  // ROWS
  ROWS_CREATED = "rows:created",
  ROWS_IMPORTED = "rows:imported",

  // COMPONENT
  COMPONENT_CREATED = "component:created",
  COMPONENT_DELETED = "component:deleted",

  // SCREEN
  SCREEN_CREATED = "screen:created",
  SCREEN_DELETED = "screen:deleted",

  // LAYOUT
  LAYOUT_CREATED = "layout:created",
  LAYOUT_DELETED = "layout:deleted",

  // AUTOMATION
  AUTOMATION_CREATED = "automation:created",
  AUTOMATION_DELETED = "automation:deleted",
  AUTOMATION_TESTED = "automation:tested",
  AUTOMATIONS_RUN = "automations:run",
  AUTOMATION_STEP_CREATED = "automation:step:created",
  AUTOMATION_STEP_DELETED = "automation:step:deleted",
  AUTOMATION_TRIGGER_UPDATED = "automation:trigger:updated",

  // LICENSE
  LICENSE_UPGRADED = "license:upgraded",
  LICENSE_DOWNGRADED = "license:downgraded",
  LICENSE_UPDATED = "license:updated",
  LICENSE_ACTIVATED = "license:activated",

  // ACCOUNT
  ACCOUNT_CREATED = "account:created",
  ACCOUNT_DELETED = "account:deleted",
  ACCOUNT_VERIFIED = "account:verified",

  // BACKFILL
  APP_BACKFILL_SUCCEEDED = "app:backfill:succeeded",
  APP_BACKFILL_FAILED = "app:backfill:failed",
  TENANT_BACKFILL_SUCCEEDED = "tenant:backfill:succeeded",
  TENANT_BACKFILL_FAILED = "tenant:backfill:failed",
  INSTALLATION_BACKFILL_SUCCEEDED = "installation:backfill:succeeded",
  INSTALLATION_BACKFILL_FAILED = "installation:backfill:failed",

  // USER
  USER_GROUP_CREATED = "user_group:created",
  USER_GROUP_UPDATED = "user_group:updated",
  USER_GROUP_DELETED = "user_group:deleted",
  USER_GROUP_USERS_ADDED = "user_group:user_added",
  USER_GROUP_USERS_REMOVED = "user_group:users_deleted",
  USER_GROUP_PERMISSIONS_EDITED = "user_group:permissions_edited",
  USER_GROUP_ONBOARDING = "user_group:onboarding_added",
}

// properties added at the final stage of the event pipeline
export interface BaseEvent {
  version?: string
  service?: string
  environment?: string
  appId?: string
  installationId?: string
  tenantId?: string
  hosting?: Hosting
}

export type RowImportFormat = "csv"
export type TableExportFormat = "json" | "csv"
export type TableImportFormat = "csv"
