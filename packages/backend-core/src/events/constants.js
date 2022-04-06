exports.Events = {
  // USER
  USER_CREATED: "user:created",
  USER_UPDATED: "user:updated",
  USER_DELETED: "user:deleted",
  USER_PASSWORD_FORCE_RESET: "user:password:force:reset",

  // USER / PERMISSIONS
  USER_PERMISSION_ADMIN_ASSIGNED: "user:admin:assigned",
  USER_PERMISSION_ADMIN_REMOVED: "user:admin:removed",
  USER_PERMISSION_BUILDER_ASSIGNED: "user:builder:assigned",
  USER_PERMISSION_BUILDER_REMOVED: "userbuilder:removed",

  // USER / INVITE
  USER_INVITED: "user:invited",
  USER_INVITED_ACCEPTED: "user:invite:accepted",

  // USER / SELF
  USER_SELF_UPDATED: "user:self:updated",
  USER_SELF_PASSWORD_UPDATED: "user:self:password:updated",
  USER_PASSWORD_RESET_REQUESTED: "user:password:reset:requested",
  USER_PASSWORD_RESET: "user:password:reset",

  // EMAIL
  EMAIL_SMTP_CREATED: "email:smtp:created",
  EMAIL_SMTP_UPDATED: "email:smtp:updated",

  // AUTH
  AUTH_SSO_CREATED: "auth:sso:created",
  AUTH_SSO_UPDATED: "auth:sso:updated",
  AUTH_SSO_ACTIVATED: "auth:sso:activated",
  AUTH_SSO_DEACTIVATED: "auth:sso:deactivated",
  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT: "auth:logout",

  // ORG
  ORG_NAME_UPDATED: "org:info:name:updated",
  ORG_LOGO_UPDATED: "org:info:logo:updated",
  ORG_PLATFORM_URL_UPDATED: "org:platformurl:updated",

  // ORG / NPS
  NPS_SUBMITTED: "nps:submitted",

  // ORG / UPDATE
  UPDATE_VERSION_CHECKED: "version:checked",

  // ORG / ANALYTICS
  ANALYTICS_OPT_OUT: "analytics:opt:out",

  // APP
  APP_CREATED: "app:created",
  APP_UPDATED: "app:updated",
  APP_DELETED: "app:deleted",
  APP_PUBLISHED: "app:published",
  APP_UNPUBLISHED: "app:unpublished",
  APP_TEMPLATE_IMPORTED: "app:template:imported",
  APP_FILE_IMPORTED: "app:file:imported",
  APP_VERSION_UPDATED: "app:version:updated",
  APP_VERSION_REVERTED: "app:version:reverted",
  APP_REVERTED: "app:reverted",
  APP_EXPORTED: "app:exported",

  // ROLE
  ROLE_CREATED: "role:created",
  ROLE_DELETED: "role:deleted",
  ROLE_ASSIGNED: "role:assigned",

  // APP / CLIENT
  CLIENT_SERVED: "client:served",

  // DATASOURCE
  DATASOURCE_CREATED: "datasource:created",
  DATASOURCE_UPDATED: "datasource:updated",
  DATASOURCE_DELETED: "datasource:deleted",

  // QUERY
  QUERY_CREATED: "query:created",
  QUERY_UPDATED: "query:updated",
  QUERY_DELETED: "query:deleted",
  QUERY_IMPORTED: "query:imported",
  QUERY_RUN: "query:run",
  QUERY_PREVIEWED: "query:previewed",

  // TABLE
  TABLE_CREATED: "table:created",
  TABLE_UPDATED: "table:updated",
  TABLE_DELETED: "table:deleted",
  TABLE_EXPORTED: "table:exported",
  TABLE_IMPORTED: "table:imported",
  TABLE_DATA_IMPORTED: "table:data:imported",
  TABLE_PERMISSION_UPDATED: "table:permission:updated",

  // VIEW
  VIEW_CREATED: "view:created",
  VIEW_UPDATED: "view:updated",
  VIEW_DELETED: "view:deleted",
  VIEW_EXPORTED: "view:exported",
  VIEW_FILTER_CREATED: "view:filter:created",
  VIEW_FILTER_DELETED: "view:filter:created",
  VIEW_CALCULATION_CREATED: "view:calculation:created",
  VIEW_CALCULATION_DELETED: "view:calculation:created",

  // ROW
  ROW_CREATED: "row:created",
  ROW_UPDATED: "row:updated",
  ROW_DELETED: "row:deleted",
  ROW_IMPORTED: "row:imported",

  // BUILDER
  BUILDER_SERVED: "builder:served",

  // COMPONENT
  COMPONENT_CREATED: "component:created",
  COMPONENT_DELETED: "component:deleted",

  // SCREEN
  SCREEN_CREATED: "screen:created",
  SCREEN_DELETED: "screen:deleted",

  // LAYOUT
  LAYOUT_CREATED: "layout:created",
  LAYOUT_DELETED: "layout:deleted",

  // AUTOMATION
  AUTOMATION_CREATED: "automation:created",
  AUTOMATION_DELETED: "automation:deleted",
  AUTOMATION_TESTED: "automation:tested",
  // AUTOMATION_RUN: "automation:run",
  AUTOMATION_STEP_CREATED: "automation:step:created",
  AUTOMATION_STEP_DELETED: "automation:step:deleted",
  AUTOMATION_TRIGGER_UPDATED: "automation:trigger:updated",

  // LICENSE
  LICENSE_UPGRADED: "license:upgraded",
  LICENSE_DOWNGRADED: "license:downgraded",
  LICENSE_UPDATED: "license:updated",
  LICENSE_PAIRED: "license:paired",
  LICENSE_QUOTA_EXCEEDED: "license:quota:exceeded",

  // ACCOUNT
  ACCOUNT_CREATED: "account:created",
  ACCOUNT_DELETED: "account:deleted",
  ACCOUNT_VERIFIED: "account:verified",
}
