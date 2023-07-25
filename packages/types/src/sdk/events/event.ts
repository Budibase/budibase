import { Hosting } from "../hosting"
import { Group, Identity } from "./identification"

export enum Event {
  // USER
  USER_CREATED = "user:created",
  USER_UPDATED = "user:updated",
  USER_DELETED = "user:deleted",

  // USER / ONBOARDING
  USER_ONBOARDING_COMPLETE = "user:onboarding:complete",

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

  // USER / COLLABORATION
  USER_DATA_COLLABORATION = "user:data:collaboration",

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
  LICENSE_PLAN_CHANGED = "license:plan:changed",
  LICENSE_ACTIVATED = "license:activated",
  LICENSE_PAYMENT_FAILED = "license:payment:failed",
  LICENSE_PAYMENT_RECOVERED = "license:payment:recovered",
  LICENSE_CHECKOUT_OPENED = "license:checkout:opened",
  LICENSE_CHECKOUT_SUCCESS = "license:checkout:success",
  LICENSE_PORTAL_OPENED = "license:portal:opened",

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

  // PLUGIN
  PLUGIN_INIT = "plugin:init",
  PLUGIN_IMPORTED = "plugin:imported",
  PLUGIN_DELETED = "plugin:deleted",

  // BACKUP
  APP_BACKUP_RESTORED = "app:backup:restored",
  APP_BACKUP_TRIGGERED = "app:backup:triggered",

  // ENVIRONMENT VARIABLE
  ENVIRONMENT_VARIABLE_CREATED = "environment_variable:created",
  ENVIRONMENT_VARIABLE_DELETED = "environment_variable:deleted",
  ENVIRONMENT_VARIABLE_UPGRADE_PANEL_OPENED = "environment_variable:upgrade_panel_opened",

  // AUDIT LOG
  AUDIT_LOGS_FILTERED = "audit_log:filtered",
  AUDIT_LOGS_DOWNLOADED = "audit_log:downloaded",
}

export const UserGroupSyncEvents: Event[] = [
  Event.USER_CREATED,
  Event.USER_UPDATED,
  Event.USER_DELETED,
  Event.USER_PERMISSION_ADMIN_ASSIGNED,
  Event.USER_PERMISSION_ADMIN_REMOVED,
  Event.USER_PERMISSION_BUILDER_ASSIGNED,
  Event.USER_PERMISSION_BUILDER_REMOVED,
  Event.USER_GROUP_CREATED,
  Event.USER_GROUP_UPDATED,
  Event.USER_GROUP_DELETED,
  Event.USER_GROUP_USERS_ADDED,
  Event.USER_GROUP_USERS_REMOVED,
  Event.USER_GROUP_PERMISSIONS_EDITED,
]

export const AsyncEvents: Event[] = [...UserGroupSyncEvents]

// all events that are not audited have been added to this record as undefined, this means
// that Typescript can protect us against new events being added and auditing of those
// events not being considered. This might be a little ugly, but provides a level of
// Typescript build protection for the audit log feature, any new event also needs to be
// added to this map, during which the developer will need to consider if it should be
// a user facing event or not.
export const AuditedEventFriendlyName: Record<Event, string | undefined> = {
  // USER
  [Event.USER_CREATED]: `User "{{ email }}" created{{#if viaScim}} via SCIM{{/if}}`,
  [Event.USER_UPDATED]: `User "{{ email }}" updated{{#if viaScim}} via SCIM{{/if}}`,
  [Event.USER_DELETED]: `User "{{ email }}" deleted{{#if viaScim}} via SCIM{{/if}}`,
  [Event.USER_PERMISSION_ADMIN_ASSIGNED]: `User "{{ email }}" admin role assigned`,
  [Event.USER_PERMISSION_ADMIN_REMOVED]: `User "{{ email }}" admin role removed`,
  [Event.USER_PERMISSION_BUILDER_ASSIGNED]: `User "{{ email }}" builder role assigned`,
  [Event.USER_PERMISSION_BUILDER_REMOVED]: `User "{{ email }}" builder role removed`,
  [Event.USER_INVITED]: `User "{{ email }}" invited`,
  [Event.USER_INVITED_ACCEPTED]: `User "{{ email }}" accepted invite`,
  [Event.USER_PASSWORD_UPDATED]: `User "{{ email }}" password updated`,
  [Event.USER_PASSWORD_RESET_REQUESTED]: `User "{{ email }}" password reset requested`,
  [Event.USER_PASSWORD_RESET]: `User "{{ email }}" password reset`,
  [Event.USER_GROUP_CREATED]: `User group "{{ name }}" created{{#if viaScim}} via SCIM{{/if}}`,
  [Event.USER_GROUP_UPDATED]: `User group "{{ name }}" updated{{#if viaScim}} via SCIM{{/if}}`,
  [Event.USER_GROUP_DELETED]: `User group "{{ name }}" deleted{{#if viaScim}} via SCIM{{/if}}`,
  [Event.USER_GROUP_USERS_ADDED]: `User group "{{ name }}" {{ count }} users added{{#if viaScim}} via SCIM{{/if}}`,
  [Event.USER_GROUP_USERS_REMOVED]: `User group "{{ name }}" {{ count }} users removed{{#if viaScim}} via SCIM{{/if}}`,
  [Event.USER_GROUP_PERMISSIONS_EDITED]: `User group "{{ name }}" permissions edited`,
  [Event.USER_PASSWORD_FORCE_RESET]: undefined,
  [Event.USER_GROUP_ONBOARDING]: undefined,
  [Event.USER_ONBOARDING_COMPLETE]: undefined,
  [Event.USER_DATA_COLLABORATION]: undefined,

  // EMAIL
  [Event.EMAIL_SMTP_CREATED]: `Email configuration created`,
  [Event.EMAIL_SMTP_UPDATED]: `Email configuration updated`,

  // AUTH
  [Event.AUTH_SSO_CREATED]: `SSO configuration created`,
  [Event.AUTH_SSO_UPDATED]: `SSO configuration updated`,
  [Event.AUTH_SSO_ACTIVATED]: `SSO configuration activated`,
  [Event.AUTH_SSO_DEACTIVATED]: `SSO configuration deactivated`,
  [Event.AUTH_LOGIN]: `User "{{ email }}" logged in`,
  [Event.AUTH_LOGOUT]: `User "{{ email }}" logged out`,

  // ORG
  [Event.ORG_NAME_UPDATED]: `Organisation name updated`,
  [Event.ORG_LOGO_UPDATED]: `Organisation logo updated`,
  [Event.ORG_PLATFORM_URL_UPDATED]: `Organisation platform URL updated`,

  // APP
  [Event.APP_CREATED]: `App "{{ name }}" created`,
  [Event.APP_UPDATED]: `App "{{ name }}" updated`,
  [Event.APP_DELETED]: `App "{{ name }}" deleted`,
  [Event.APP_PUBLISHED]: `App "{{ name }}" published`,
  [Event.APP_UNPUBLISHED]: `App "{{ name }}" unpublished`,
  [Event.APP_TEMPLATE_IMPORTED]: `App "{{ name }}" template imported`,
  [Event.APP_FILE_IMPORTED]: `App "{{ name }}" file imported`,
  [Event.APP_VERSION_UPDATED]: `App "{{ name }}" version updated`,
  [Event.APP_VERSION_REVERTED]: `App "{{ name }}" version reverted`,
  [Event.APP_REVERTED]: `App "{{ name }}" reverted`,
  [Event.APP_EXPORTED]: `App "{{ name }}" exported`,
  [Event.APP_BACKUP_RESTORED]: `App backup "{{ name }}" restored`,
  [Event.APP_BACKUP_TRIGGERED]: `App backup "{{ name }}" triggered`,

  // DATASOURCE
  [Event.DATASOURCE_CREATED]: `Datasource created`,
  [Event.DATASOURCE_UPDATED]: `Datasource updated`,
  [Event.DATASOURCE_DELETED]: `Datasource deleted`,

  // QUERY
  [Event.QUERY_CREATED]: `Query created`,
  [Event.QUERY_UPDATED]: `Query updated`,
  [Event.QUERY_DELETED]: `Query deleted`,
  [Event.QUERY_IMPORT]: `Query import`,
  [Event.QUERIES_RUN]: undefined,
  [Event.QUERY_PREVIEWED]: undefined,

  // TABLE
  [Event.TABLE_CREATED]: `Table "{{ name }}" created`,
  [Event.TABLE_UPDATED]: `Table "{{ name }}" updated`,
  [Event.TABLE_DELETED]: `Table "{{ name }}" deleted`,
  [Event.TABLE_EXPORTED]: `Table "{{ name }}" exported`,
  [Event.TABLE_IMPORTED]: `Table "{{ name }}" imported`,
  [Event.TABLE_DATA_IMPORTED]: `Data imported to table`,

  // ROWS
  [Event.ROWS_CREATED]: `Rows created`,
  [Event.ROWS_IMPORTED]: `Rows imported`,

  // AUTOMATION
  [Event.AUTOMATION_CREATED]: `Automation "{{ name }}" created`,
  [Event.AUTOMATION_DELETED]: `Automation "{{ name }}" deleted`,
  [Event.AUTOMATION_STEP_CREATED]: `Automation "{{ name }}" step added`,
  [Event.AUTOMATION_STEP_DELETED]: `Automation "{{ name }}" step removed`,
  [Event.AUTOMATION_TESTED]: undefined,
  [Event.AUTOMATIONS_RUN]: undefined,
  [Event.AUTOMATION_TRIGGER_UPDATED]: undefined,

  // SCREEN
  [Event.SCREEN_CREATED]: `Screen "{{ name }}" created`,
  [Event.SCREEN_DELETED]: `Screen "{{ name }}" deleted`,

  // COMPONENT
  [Event.COMPONENT_CREATED]: `Component created`,
  [Event.COMPONENT_DELETED]: `Component deleted`,

  // ENVIRONMENT VARIABLE
  [Event.ENVIRONMENT_VARIABLE_CREATED]: `Environment variable created`,
  [Event.ENVIRONMENT_VARIABLE_DELETED]: `Environment variable deleted`,
  [Event.ENVIRONMENT_VARIABLE_UPGRADE_PANEL_OPENED]: undefined,

  // PLUGIN
  [Event.PLUGIN_IMPORTED]: `Plugin imported`,
  [Event.PLUGIN_DELETED]: `Plugin deleted`,
  [Event.PLUGIN_INIT]: undefined,

  // ROLE - NOT AUDITED
  [Event.ROLE_CREATED]: undefined,
  [Event.ROLE_UPDATED]: undefined,
  [Event.ROLE_DELETED]: undefined,
  [Event.ROLE_ASSIGNED]: undefined,
  [Event.ROLE_UNASSIGNED]: undefined,

  // LICENSE - NOT AUDITED
  [Event.LICENSE_PLAN_CHANGED]: undefined,
  [Event.LICENSE_ACTIVATED]: undefined,
  [Event.LICENSE_PAYMENT_FAILED]: undefined,
  [Event.LICENSE_PAYMENT_RECOVERED]: undefined,
  [Event.LICENSE_CHECKOUT_OPENED]: undefined,
  [Event.LICENSE_CHECKOUT_SUCCESS]: undefined,
  [Event.LICENSE_PORTAL_OPENED]: undefined,

  // ACCOUNT - NOT AUDITED
  [Event.ACCOUNT_CREATED]: undefined,
  [Event.ACCOUNT_DELETED]: undefined,
  [Event.ACCOUNT_VERIFIED]: undefined,

  // BACKFILL - NOT AUDITED
  [Event.APP_BACKFILL_SUCCEEDED]: undefined,
  [Event.APP_BACKFILL_FAILED]: undefined,
  [Event.TENANT_BACKFILL_SUCCEEDED]: undefined,
  [Event.TENANT_BACKFILL_FAILED]: undefined,
  [Event.INSTALLATION_BACKFILL_SUCCEEDED]: undefined,
  [Event.INSTALLATION_BACKFILL_FAILED]: undefined,

  // LAYOUT - NOT AUDITED
  [Event.LAYOUT_CREATED]: undefined,
  [Event.LAYOUT_DELETED]: undefined,

  // VIEW - NOT AUDITED
  [Event.VIEW_CREATED]: undefined,
  [Event.VIEW_UPDATED]: undefined,
  [Event.VIEW_DELETED]: undefined,
  [Event.VIEW_EXPORTED]: undefined,
  [Event.VIEW_FILTER_CREATED]: undefined,
  [Event.VIEW_FILTER_UPDATED]: undefined,
  [Event.VIEW_FILTER_DELETED]: undefined,
  [Event.VIEW_CALCULATION_CREATED]: undefined,
  [Event.VIEW_CALCULATION_UPDATED]: undefined,
  [Event.VIEW_CALCULATION_DELETED]: undefined,

  // SERVED - NOT AUDITED
  [Event.SERVED_BUILDER]: undefined,
  [Event.SERVED_APP]: undefined,
  [Event.SERVED_APP_PREVIEW]: undefined,

  // ANALYTICS - NOT AUDITED
  [Event.ANALYTICS_OPT_OUT]: undefined,
  [Event.ANALYTICS_OPT_IN]: undefined,

  // INSTALLATION - NOT AUDITED
  [Event.INSTALLATION_VERSION_CHECKED]: undefined,
  [Event.INSTALLATION_VERSION_UPGRADED]: undefined,
  [Event.INSTALLATION_VERSION_DOWNGRADED]: undefined,
  [Event.INSTALLATION_FIRST_STARTUP]: undefined,

  // AUDIT LOG - NOT AUDITED
  [Event.AUDIT_LOGS_FILTERED]: undefined,
  [Event.AUDIT_LOGS_DOWNLOADED]: undefined,
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
  // any props in the audited section will be removed before passing events
  // up out of system (purely for use with auditing)
  audited?: {
    [key: string]: any
  }
}

export type TableExportFormat = "json" | "csv"

export type DocUpdateEvent = {
  id: string
  tenantId: string
  appId?: string
}

export interface EventProcessor {
  processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string | number
  ): Promise<void>
  identify?(identity: Identity, timestamp?: string | number): Promise<void>
  identifyGroup?(group: Group, timestamp?: string | number): Promise<void>
  shutdown?(): void
}
