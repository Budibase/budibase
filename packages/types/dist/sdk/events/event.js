"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
var Event;
(function (Event) {
    // USER
    Event["USER_CREATED"] = "user:created";
    Event["USER_UPDATED"] = "user:updated";
    Event["USER_DELETED"] = "user:deleted";
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
    // EMAIL
    Event["EMAIL_SMTP_CREATED"] = "email:smtp:created";
    Event["EMAIL_SMTP_UPDATED"] = "email:smtp:updated";
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
    Event["LICENSE_UPGRADED"] = "license:upgraded";
    Event["LICENSE_DOWNGRADED"] = "license:downgraded";
    Event["LICENSE_ACTIVATED"] = "license:activated";
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
})(Event = exports.Event || (exports.Event = {}));
//# sourceMappingURL=event.js.map