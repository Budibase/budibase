export declare const SEPARATOR = "_";
export declare const UNICODE_MAX = "\uFFF0";
/**
 * Can be used to create a few different forms of querying a view.
 */
export declare enum AutomationViewMode {
    ALL = "all",
    AUTOMATION = "automation",
    STATUS = "status"
}
export declare enum ViewName {
    USER_BY_APP = "by_app",
    USER_BY_EMAIL = "by_email2",
    BY_API_KEY = "by_api_key",
    USER_BY_BUILDERS = "by_builders",
    LINK = "by_link",
    ROUTING = "screen_routes",
    AUTOMATION_LOGS = "automation_logs",
    ACCOUNT_BY_EMAIL = "account_by_email",
    PLATFORM_USERS_LOWERCASE = "platform_users_lowercase",
    USER_BY_GROUP = "by_group_user",
    APP_BACKUP_BY_TRIGGER = "by_trigger"
}
export declare const DeprecatedViews: {
    by_email2: string[];
};
export declare enum InternalTable {
    USER_METADATA = "ta_users"
}
export declare enum DocumentType {
    USER = "us",
    GROUP = "gr",
    WORKSPACE = "workspace",
    CONFIG = "config",
    TEMPLATE = "template",
    APP = "app",
    DEV = "dev",
    APP_DEV = "app_dev",
    APP_METADATA = "app_metadata",
    ROLE = "role",
    MIGRATIONS = "migrations",
    DEV_INFO = "devinfo",
    AUTOMATION_LOG = "log_au",
    ACCOUNT_METADATA = "acc_metadata",
    PLUGIN = "plg",
    DATASOURCE = "datasource",
    DATASOURCE_PLUS = "datasource_plus",
    APP_BACKUP = "backup",
    TABLE = "ta",
    ROW = "ro",
    AUTOMATION = "au",
    LINK = "li",
    WEBHOOK = "wh",
    INSTANCE = "inst",
    LAYOUT = "layout",
    SCREEN = "screen",
    QUERY = "query",
    DEPLOYMENTS = "deployments",
    METADATA = "metadata",
    MEM_VIEW = "view",
    USER_FLAG = "flag",
    AUTOMATION_METADATA = "meta_au"
}
export declare const StaticDatabases: {
    GLOBAL: {
        name: string;
        docs: {
            apiKeys: string;
            usageQuota: string;
            licenseInfo: string;
        };
    };
    PLATFORM_INFO: {
        name: string;
        docs: {
            tenants: string;
            install: string;
        };
    };
};
export declare const APP_PREFIX: string;
export declare const APP_DEV: string;
export declare const APP_DEV_PREFIX: string;
export declare const BUDIBASE_DATASOURCE_TYPE = "budibase";
