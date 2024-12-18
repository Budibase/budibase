import { Database } from "./db";
export interface Migration extends MigrationDefinition {
    appOpts?: object;
    fn: (db: Database) => Promise<void>;
    silent?: boolean;
    preventRetry?: boolean;
}
export declare enum MigrationType {
    GLOBAL = "global",
    APP = "app",
    INSTALLATION = "installation"
}
export interface MigrationNoOpOptions {
    type: MigrationType;
    tenantId: string;
    appId?: string;
}
/**
 * e.g.
 * {
 *   tenantIds: ['bb'],
 *   force: {
 *    global: ['quota_1']
 *   }
 * }
 */
export interface MigrationOptions {
    tenantIds?: string[];
    force?: {
        [type: string]: string[];
    };
    noOp?: MigrationNoOpOptions;
}
export declare enum MigrationName {
    USER_EMAIL_VIEW_CASING = "user_email_view_casing",
    APP_URLS = "app_urls",
    EVENT_APP_BACKFILL = "event_app_backfill",
    EVENT_GLOBAL_BACKFILL = "event_global_backfill",
    EVENT_INSTALLATION_BACKFILL = "event_installation_backfill",
    GLOBAL_INFO_SYNC_USERS = "global_info_sync_users",
    TABLE_SETTINGS_LINKS_TO_ACTIONS = "table_settings_links_to_actions",
    SYNC_QUOTAS = "sync_quotas_2"
}
export interface MigrationDefinition {
    type: MigrationType;
    name: MigrationName;
}
