export interface Migration extends MigrationDefinition {
    appOpts?: object;
    fn: Function;
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
    QUOTAS_1 = "quotas_1",
    APP_URLS = "app_urls",
    DEVELOPER_QUOTA = "developer_quota",
    PUBLISHED_APP_QUOTA = "published_apps_quota",
    EVENT_APP_BACKFILL = "event_app_backfill",
    EVENT_GLOBAL_BACKFILL = "event_global_backfill",
    EVENT_INSTALLATION_BACKFILL = "event_installation_backfill",
    GLOBAL_INFO_SYNC_USERS = "global_info_sync_users"
}
export interface MigrationDefinition {
    type: MigrationType;
    name: MigrationName;
}
