import * as events from "./events";
import * as migrations from "./migrations";
import * as users from "./users";
import * as roles from "./security/roles";
import * as accounts from "./cloud/accounts";
import * as installation from "./installation";
import featureFlags from "./featureFlags";
import * as sessions from "./security/sessions";
import deprovisioning from "./context/deprovision";
import constants from "./constants";
import * as dbConstants from "./db/constants";
import * as db from "./pkg/db";
import * as objectStore from "./pkg/objectStore";
import * as utils from "./pkg/utils";
declare const core: {
    UsageLimitError: typeof import("./errors/licensing").UsageLimitError;
    FeatureDisabledError: typeof import("./errors/licensing").FeatureDisabledError;
    HTTPError: typeof import("./errors/http").HTTPError;
    pinoSettings: () => {
        prettyPrint: {
            levelFirst: boolean;
        };
        level: string;
        autoLogging: {
            ignore: (req: any) => any;
        };
    };
    migrations: typeof migrations;
    env: {
        isTest: () => boolean;
        isDev: () => boolean;
        JWT_SECRET: string | undefined;
        COUCH_DB_URL: string;
        COUCH_DB_USERNAME: string | undefined;
        COUCH_DB_PASSWORD: string | undefined;
        GOOGLE_CLIENT_ID: string | undefined;
        GOOGLE_CLIENT_SECRET: string | undefined;
        SALT_ROUNDS: string | undefined;
        REDIS_URL: string | undefined;
        REDIS_PASSWORD: string | undefined;
        MINIO_ACCESS_KEY: string | undefined;
        MINIO_SECRET_KEY: string | undefined;
        AWS_REGION: string | undefined;
        MINIO_URL: string | undefined;
        INTERNAL_API_KEY: string | undefined;
        MULTI_TENANCY: string | undefined;
        ACCOUNT_PORTAL_URL: string;
        ACCOUNT_PORTAL_API_KEY: string | undefined;
        DISABLE_ACCOUNT_PORTAL: string | undefined;
        SELF_HOSTED: boolean;
        COOKIE_DOMAIN: string | undefined;
        PLATFORM_URL: string;
        POSTHOG_TOKEN: string | undefined;
        ENABLE_ANALYTICS: string | undefined;
        TENANT_FEATURE_FLAGS: string | undefined;
        BACKUPS_BUCKET_NAME: string;
        APPS_BUCKET_NAME: string;
        TEMPLATES_BUCKET_NAME: string;
        GLOBAL_BUCKET_NAME: string;
        GLOBAL_CLOUD_BUCKET_NAME: string;
        USE_COUCH: string | boolean;
        DISABLE_DEVELOPER_LICENSE: string | undefined;
        DEFAULT_LICENSE: string | undefined;
        SERVICE: string;
        MEMORY_LEAK_CHECK: string | boolean;
        LOG_LEVEL: string | undefined;
        SESSION_UPDATE_PERIOD: string | undefined;
        DEPLOYMENT_ENVIRONMENT: string;
        _set(key: any, value: any): void;
    };
    accounts: typeof accounts;
    tenancy: {
        addTenantToUrl: (url: string) => string;
        doesTenantExist: (tenantId: string) => Promise<any>;
        tryAddTenant: (tenantId: string, userId: string, email: string, afterCreateTenant: () => Promise<void>) => Promise<any>;
        getGlobalDBName: (tenantId?: string | undefined) => string;
        doWithGlobalDB: (tenantId: string, cb: any) => Promise<any>;
        lookupTenantId: (userId: string) => Promise<any>;
        getTenantUser: (identifier: string) => Promise<any>;
        isUserInAppTenant: (appId: string, user: any) => boolean;
        getTenantIds: () => Promise<any>;
        DEFAULT_TENANT_ID: "default";
        closeTenancy: () => Promise<void>;
        isMultiTenant: () => string | undefined;
        getTenantIDFromAppID: (appId: string) => string | null;
        doInTenant: (tenantId: string | null, task: any) => Promise<any>;
        doInAppContext: (appId: string, task: any) => Promise<any>;
        doInIdentityContext: (identity: import("@budibase/types").IdentityContext, task: any) => Promise<any>;
        getIdentity: () => import("@budibase/types").IdentityContext | undefined;
        updateTenantId: (tenantId: string | null) => void;
        updateAppId: (appId: string) => Promise<void>;
        setGlobalDB: (tenantId: string | null) => any;
        getGlobalDB: () => any;
        isTenantIdSet: () => boolean;
        getTenantId: () => any;
        getAppId: () => any;
        getAppDB: (opts?: any) => any;
        getProdAppDB: (opts?: any) => any;
        getDevAppDB: (opts?: any) => any;
    };
    context: {
        getAppDB: (opts?: any) => any;
        getDevAppDB: (opts?: any) => any;
        getProdAppDB: (opts?: any) => any;
        getAppId: () => any;
        updateAppId: (appId: string) => Promise<void>;
        doInAppContext: (appId: string, task: any) => Promise<any>;
        doInTenant: (tenantId: string | null, task: any) => Promise<any>;
        identity: typeof import("./context/identity");
    };
    featureFlags: typeof featureFlags;
    events: typeof events;
    sessions: typeof sessions;
    deprovisioning: typeof deprovisioning;
    installation: typeof installation;
    errors: {
        codes: {
            USAGE_LIMIT_EXCEEDED: string;
            FEATURE_DISABLED: string;
        };
        types: string[];
        errors: {
            UsageLimitError: typeof import("./errors/licensing").UsageLimitError;
            FeatureDisabledError: typeof import("./errors/licensing").FeatureDisabledError;
            HTTPError: typeof import("./errors/http").HTTPError;
        };
        getPublicError: (err: any) => {
            code: any;
            type: any;
        } | {
            limitName: any;
            code: any;
            type: any;
        } | {
            featureName: any;
            code: any;
            type: any;
        } | undefined;
    };
    logging: {
        logAlert: typeof import("./logging").logAlert;
        logAlertWithInfo: typeof import("./logging").logAlertWithInfo;
        logWarn: typeof import("./logging").logWarn;
    };
    roles: typeof roles;
    UserStatus: {
        ACTIVE: string;
        INACTIVE: string;
    };
    Cookies: {
        CurrentApp: string;
        Auth: string;
        Init: string;
        DatasourceAuth: string;
        OIDC_CONFIG: string;
    };
    Headers: {
        API_KEY: string;
        LICENSE_KEY: string;
        API_VER: string;
        APP_ID: string;
        TYPE: string;
        PREVIEW_ROLE: string;
        TENANT_ID: string;
        TOKEN: string;
        CSRF_TOKEN: string;
    };
    GlobalRoles: {
        OWNER: string;
        ADMIN: string;
        BUILDER: string;
        WORKSPACE_MANAGER: string;
    };
    Configs: {
        SETTINGS: string;
        ACCOUNT: string;
        SMTP: string;
        GOOGLE: string;
        OIDC: string;
        OIDC_LOGOS: string;
    };
    MAX_VALID_DATE: Date;
    DEFAULT_TENANT_ID: "default";
    redis: {
        Client: {
            new (db: string, selectDb?: number | null): {
                _db: string;
                _select: number;
                getClient(): any;
                init(): Promise<any>;
                finish(): Promise<void>;
                scan(key?: string): Promise<any>;
                keys(pattern: string): Promise<any>;
                get(key: string): Promise<any>;
                store(key: string, value: any, expirySeconds?: number | null): Promise<void>;
                getTTL(key: string): Promise<any>;
                setExpiry(key: string, expirySeconds: number | null): Promise<void>;
                delete(key: string): Promise<void>;
                clear(): Promise<void>;
            };
        };
        utils: typeof import("./redis/utils");
        clients: {
            getUserClient: () => Promise<any>;
            getSessionClient: () => Promise<any>;
            getAppClient: () => Promise<any>;
            getCacheClient: () => Promise<any>;
            getWritethroughClient: () => Promise<any>;
            getMigrationsRedlock: () => Promise<any>;
        };
    };
    objectStore: typeof objectStore;
    utils: typeof utils;
    users: typeof users;
    cache: {
        CacheKeys: {
            CHECKLIST: string;
            INSTALLATION: string;
            ANALYTICS_ENABLED: string;
            UNIQUE_TENANT_ID: string;
            EVENTS: string;
            BACKFILL_METADATA: string;
            EVENTS_RATE_LIMIT: string;
        };
        TTL: {
            ONE_MINUTE: number;
            ONE_HOUR: number;
            ONE_DAY: number;
        };
        keys: (...args: any[]) => any;
        get: (...args: any[]) => any;
        store: (...args: any[]) => any;
        delete: (...args: any[]) => any;
        withCache: (...args: any[]) => any;
        bustCache: (...args: any[]) => any;
        app: typeof import("./cache/appMetadata");
        user: typeof import("./cache/user");
    };
    auth: {
        buildAuthMiddleware: typeof import("./middleware/authenticated");
        passport: any;
        google: typeof import("./middleware/passport/google");
        oidc: typeof import("./middleware/passport/oidc");
        jwt: any;
        buildTenancyMiddleware: (allowQueryStringPatterns: any, noTenancyPatterns: any, opts?: {
            noTenancyRequired: boolean;
        }) => (ctx: any, next: any) => Promise<any>;
        buildAppTenancyMiddleware: any;
        auditLog: (ctx: any, next: any) => Promise<any>;
        authError: (done: any, message: any, err?: any) => any;
        buildCsrfMiddleware: (opts?: {
            noCsrfPatterns: never[];
        }) => (ctx: any, next: any) => Promise<any>;
        internalApi: (ctx: any, next: any) => Promise<any>;
        refreshOAuthToken: (refreshToken: any, configType: any, configId: any) => Promise<any>;
        updateUserOAuth: (userId: any, oAuthConfig: any) => Promise<void>;
        ssoCallbackUrl: (db: any, config: any, type: any) => Promise<any>;
        adminOnly: (ctx: any, next: any) => Promise<any>;
        builderOnly: (ctx: any, next: any) => Promise<any>;
        builderOrAdmin: (ctx: any, next: any) => Promise<any>;
        joiValidator: typeof import("./middleware/joi-validator");
    };
    constants: typeof constants;
    SEPARATOR: "_";
    UNICODE_MAX: "￰";
    AutomationViewModes: typeof dbConstants.AutomationViewModes;
    ViewNames: typeof dbConstants.ViewNames;
    DeprecatedViews: {
        by_email2: string[];
    };
    DocumentTypes: typeof dbConstants.DocumentTypes;
    StaticDatabases: {
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
    APP_PREFIX: any;
    APP_DEV: any;
    APP_DEV_PREFIX: any;
    init: (opts?: any) => void;
    db: typeof db;
};
export = core;
