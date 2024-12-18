"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationName = exports.MigrationType = void 0;
var MigrationType;
(function (MigrationType) {
    // run once per tenant, recorded in global db, global db is provided as an argument
    MigrationType["GLOBAL"] = "global";
    // run per app, recorded in each app db, app db is provided as an argument
    MigrationType["APP"] = "app";
    // run once, recorded in global info db, global info db is provided as an argument
    MigrationType["INSTALLATION"] = "installation";
})(MigrationType || (exports.MigrationType = MigrationType = {}));
var MigrationName;
(function (MigrationName) {
    MigrationName["USER_EMAIL_VIEW_CASING"] = "user_email_view_casing";
    MigrationName["APP_URLS"] = "app_urls";
    MigrationName["EVENT_APP_BACKFILL"] = "event_app_backfill";
    MigrationName["EVENT_GLOBAL_BACKFILL"] = "event_global_backfill";
    MigrationName["EVENT_INSTALLATION_BACKFILL"] = "event_installation_backfill";
    MigrationName["GLOBAL_INFO_SYNC_USERS"] = "global_info_sync_users";
    MigrationName["TABLE_SETTINGS_LINKS_TO_ACTIONS"] = "table_settings_links_to_actions";
    // increment this number to re-activate this migration
    MigrationName["SYNC_QUOTAS"] = "sync_quotas_2";
})(MigrationName || (exports.MigrationName = MigrationName = {}));
