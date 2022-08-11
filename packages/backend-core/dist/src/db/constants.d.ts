export declare const SEPARATOR = "_";
export declare const UNICODE_MAX = "\uFFF0";
/**
 * Can be used to create a few different forms of querying a view.
 */
export declare enum AutomationViewModes {
    ALL = "all",
    AUTOMATION = "automation",
    STATUS = "status"
}
export declare enum ViewNames {
    USER_BY_APP = "by_app",
    USER_BY_EMAIL = "by_email2",
    BY_API_KEY = "by_api_key",
    USER_BY_BUILDERS = "by_builders",
    LINK = "by_link",
    ROUTING = "screen_routes",
    AUTOMATION_LOGS = "automation_logs"
}
export declare const DeprecatedViews: {
    by_email2: string[];
};
export declare enum DocumentTypes {
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
    AUTOMATION_LOG = "log_au"
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
export declare const APP_PREFIX: any;
export declare const APP_DEV: any;
export declare const APP_DEV_PREFIX: any;
