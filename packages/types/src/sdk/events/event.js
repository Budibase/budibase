"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditedEventFriendlyName = exports.AsyncEvents = exports.UserGroupSyncEvents = exports.Event = void 0;
var Event;
(function (Event) {
    // USER
    Event["USER_CREATED"] = "user:created";
    Event["USER_UPDATED"] = "user:updated";
    Event["USER_DELETED"] = "user:deleted";
    // USER / ONBOARDING
    Event["USER_ONBOARDING_COMPLETE"] = "user:onboarding:complete";
    // USER / PERMISSIONS
    Event["USER_PERMISSION_ADMIN_ASSIGNED"] = "user:admin:assigned";
    Event["USER_PERMISSION_ADMIN_REMOVED"] = "user:admin:removed";
    Event["USER_PERMISSION_BUILDER_ASSIGNED"] = "user:builder:assigned";
    Event["USER_PERMISSION_BUILDER_REMOVED"] = "user:builder:removed";
    // USER / INVITE
    Event["USER_INVITED"] = "user:invited";
    Event["USER_INVITED_ACCEPTED"] = "user:invite:accepted";
    // USER / PASSWORD
    Event["USER_PASSWORD_FORCE_RESET"] = "user:password:force:reset";
    Event["USER_PASSWORD_UPDATED"] = "user:password:updated";
    Event["USER_PASSWORD_RESET_REQUESTED"] = "user:password:reset:requested";
    Event["USER_PASSWORD_RESET"] = "user:password:reset";
    // USER / COLLABORATION
    Event["USER_DATA_COLLABORATION"] = "user:data:collaboration";
    // EMAIL
    Event["EMAIL_SMTP_CREATED"] = "email:smtp:created";
    Event["EMAIL_SMTP_UPDATED"] = "email:smtp:updated";
    // AI
    Event["AI_CONFIG_CREATED"] = "ai:config:created";
    Event["AI_CONFIG_UPDATED"] = "ai:config:updated";
    // AUTH
    Event["AUTH_SSO_CREATED"] = "auth:sso:created";
    Event["AUTH_SSO_UPDATED"] = "auth:sso:updated";
    Event["AUTH_SSO_ACTIVATED"] = "auth:sso:activated";
    Event["AUTH_SSO_DEACTIVATED"] = "auth:sso:deactivated";
    Event["AUTH_LOGIN"] = "auth:login";
    Event["AUTH_LOGOUT"] = "auth:logout";
    // ORG
    Event["ORG_NAME_UPDATED"] = "org:info:name:updated";
    Event["ORG_LOGO_UPDATED"] = "org:info:logo:updated";
    Event["ORG_PLATFORM_URL_UPDATED"] = "org:platformurl:updated";
    // INSTALLATION
    Event["INSTALLATION_VERSION_CHECKED"] = "installation:version:checked";
    Event["INSTALLATION_VERSION_UPGRADED"] = "installation:version:upgraded";
    Event["INSTALLATION_VERSION_DOWNGRADED"] = "installation:version:downgraded";
    Event["INSTALLATION_FIRST_STARTUP"] = "installation:firstStartup";
    // ORG / ANALYTICS
    Event["ANALYTICS_OPT_OUT"] = "analytics:opt:out";
    Event["ANALYTICS_OPT_IN"] = "analytics:opt:in";
    // APP
    Event["APP_CREATED"] = "app:created";
    Event["APP_UPDATED"] = "app:updated";
    Event["APP_DELETED"] = "app:deleted";
    Event["APP_DUPLICATED"] = "app:duplicated";
    Event["APP_PUBLISHED"] = "app:published";
    Event["APP_UNPUBLISHED"] = "app:unpublished";
    Event["APP_TEMPLATE_IMPORTED"] = "app:template:imported";
    Event["APP_FILE_IMPORTED"] = "app:file:imported";
    Event["APP_VERSION_UPDATED"] = "app:version:updated";
    Event["APP_VERSION_REVERTED"] = "app:version:reverted";
    Event["APP_REVERTED"] = "app:reverted";
    Event["APP_EXPORTED"] = "app:exported";
    // ROLE
    Event["ROLE_CREATED"] = "role:created";
    Event["ROLE_UPDATED"] = "role:updated";
    Event["ROLE_DELETED"] = "role:deleted";
    Event["ROLE_ASSIGNED"] = "role:assigned";
    Event["ROLE_UNASSIGNED"] = "role:unassigned";
    // SERVE
    Event["SERVED_BUILDER"] = "served:builder";
    Event["SERVED_APP"] = "served:app";
    Event["SERVED_APP_PREVIEW"] = "served:app:preview";
    // DATASOURCE
    Event["DATASOURCE_CREATED"] = "datasource:created";
    Event["DATASOURCE_UPDATED"] = "datasource:updated";
    Event["DATASOURCE_DELETED"] = "datasource:deleted";
    // QUERY
    Event["QUERY_CREATED"] = "query:created";
    Event["QUERY_UPDATED"] = "query:updated";
    Event["QUERY_DELETED"] = "query:deleted";
    Event["QUERY_IMPORT"] = "query:import";
    Event["QUERIES_RUN"] = "queries:run";
    Event["QUERY_PREVIEWED"] = "query:previewed";
    // TABLE
    Event["TABLE_CREATED"] = "table:created";
    Event["TABLE_UPDATED"] = "table:updated";
    Event["TABLE_DELETED"] = "table:deleted";
    Event["TABLE_EXPORTED"] = "table:exported";
    Event["TABLE_IMPORTED"] = "table:imported";
    Event["TABLE_DATA_IMPORTED"] = "table:data:imported";
    // VIEW
    Event["VIEW_CREATED"] = "view:created";
    Event["VIEW_UPDATED"] = "view:updated";
    Event["VIEW_DELETED"] = "view:deleted";
    Event["VIEW_EXPORTED"] = "view:exported";
    Event["VIEW_FILTER_CREATED"] = "view:filter:created";
    Event["VIEW_FILTER_UPDATED"] = "view:filter:updated";
    Event["VIEW_FILTER_DELETED"] = "view:filter:deleted";
    Event["VIEW_CALCULATION_CREATED"] = "view:calculation:created";
    Event["VIEW_CALCULATION_UPDATED"] = "view:calculation:updated";
    Event["VIEW_CALCULATION_DELETED"] = "view:calculation:deleted";
    Event["VIEW_JOIN_CREATED"] = "view:join:created";
    // ROWS
    Event["ROWS_CREATED"] = "rows:created";
    Event["ROWS_IMPORTED"] = "rows:imported";
    // COMPONENT
    Event["COMPONENT_CREATED"] = "component:created";
    Event["COMPONENT_DELETED"] = "component:deleted";
    // SCREEN
    Event["SCREEN_CREATED"] = "screen:created";
    Event["SCREEN_DELETED"] = "screen:deleted";
    // LAYOUT
    Event["LAYOUT_CREATED"] = "layout:created";
    Event["LAYOUT_DELETED"] = "layout:deleted";
    // AUTOMATION
    Event["AUTOMATION_CREATED"] = "automation:created";
    Event["AUTOMATION_DELETED"] = "automation:deleted";
    Event["AUTOMATION_TESTED"] = "automation:tested";
    Event["AUTOMATIONS_RUN"] = "automations:run";
    Event["AUTOMATION_STEP_CREATED"] = "automation:step:created";
    Event["AUTOMATION_STEP_DELETED"] = "automation:step:deleted";
    Event["AUTOMATION_TRIGGER_UPDATED"] = "automation:trigger:updated";
    // LICENSE
    Event["LICENSE_PLAN_CHANGED"] = "license:plan:changed";
    Event["LICENSE_ACTIVATED"] = "license:activated";
    Event["LICENSE_PAYMENT_FAILED"] = "license:payment:failed";
    Event["LICENSE_PAYMENT_RECOVERED"] = "license:payment:recovered";
    Event["LICENSE_CHECKOUT_OPENED"] = "license:checkout:opened";
    Event["LICENSE_CHECKOUT_SUCCESS"] = "license:checkout:success";
    Event["LICENSE_PORTAL_OPENED"] = "license:portal:opened";
    // ACCOUNT
    Event["ACCOUNT_CREATED"] = "account:created";
    Event["ACCOUNT_DELETED"] = "account:deleted";
    Event["ACCOUNT_VERIFIED"] = "account:verified";
    // BACKFILL
    Event["APP_BACKFILL_SUCCEEDED"] = "app:backfill:succeeded";
    Event["APP_BACKFILL_FAILED"] = "app:backfill:failed";
    Event["TENANT_BACKFILL_SUCCEEDED"] = "tenant:backfill:succeeded";
    Event["TENANT_BACKFILL_FAILED"] = "tenant:backfill:failed";
    Event["INSTALLATION_BACKFILL_SUCCEEDED"] = "installation:backfill:succeeded";
    Event["INSTALLATION_BACKFILL_FAILED"] = "installation:backfill:failed";
    // USER
    Event["USER_GROUP_CREATED"] = "user_group:created";
    Event["USER_GROUP_UPDATED"] = "user_group:updated";
    Event["USER_GROUP_DELETED"] = "user_group:deleted";
    Event["USER_GROUP_USERS_ADDED"] = "user_group:user_added";
    Event["USER_GROUP_USERS_REMOVED"] = "user_group:users_deleted";
    Event["USER_GROUP_PERMISSIONS_EDITED"] = "user_group:permissions_edited";
    Event["USER_GROUP_ONBOARDING"] = "user_group:onboarding_added";
    // PLUGIN
    Event["PLUGIN_INIT"] = "plugin:init";
    Event["PLUGIN_IMPORTED"] = "plugin:imported";
    Event["PLUGIN_DELETED"] = "plugin:deleted";
    // BACKUP
    Event["APP_BACKUP_RESTORED"] = "app:backup:restored";
    Event["APP_BACKUP_TRIGGERED"] = "app:backup:triggered";
    // ENVIRONMENT VARIABLE
    Event["ENVIRONMENT_VARIABLE_CREATED"] = "environment_variable:created";
    Event["ENVIRONMENT_VARIABLE_DELETED"] = "environment_variable:deleted";
    Event["ENVIRONMENT_VARIABLE_UPGRADE_PANEL_OPENED"] = "environment_variable:upgrade_panel_opened";
    // AUDIT LOG
    Event["AUDIT_LOGS_FILTERED"] = "audit_log:filtered";
    Event["AUDIT_LOGS_DOWNLOADED"] = "audit_log:downloaded";
    // ROW ACTION
    Event["ROW_ACTION_CREATED"] = "row_action:created";
})(Event || (exports.Event = Event = {}));
exports.UserGroupSyncEvents = [
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
];
exports.AsyncEvents = [...exports.UserGroupSyncEvents];
// all events that are not audited have been added to this record as undefined, this means
// that Typescript can protect us against new events being added and auditing of those
// events not being considered. This might be a little ugly, but provides a level of
// Typescript build protection for the audit log feature, any new event also needs to be
// added to this map, during which the developer will need to consider if it should be
// a user facing event or not.
exports.AuditedEventFriendlyName = {
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
    // AI
    [Event.AI_CONFIG_CREATED]: `AI configuration created`,
    [Event.AI_CONFIG_UPDATED]: `AI configuration updated`,
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
    [Event.APP_DUPLICATED]: `App "{{ name }}" duplicated`,
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
    [Event.VIEW_JOIN_CREATED]: undefined,
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
    // ROW ACTIONS - NOT AUDITED
    [Event.ROW_ACTION_CREATED]: undefined,
};
