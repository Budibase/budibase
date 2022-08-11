declare const _exports: {
    getUrlInfo: (url?: string) => {
        url: string | undefined;
        auth: {
            username: string | undefined;
            password: string | undefined;
        };
    };
    getCouchInfo: () => {
        url: string | undefined;
        auth: {
            username: string | undefined;
            password: string | undefined;
        };
        cookie: string;
    };
    getPouch: (opts?: {}) => new <Content extends {} = {}>(name?: string | undefined, options?: PouchDB.Configuration.DatabaseConfiguration | undefined) => PouchDB.Database<Content>;
    createNewUserEmailView: () => Promise<void>;
    createUserAppView: () => Promise<void>;
    createApiKeyView: () => Promise<void>;
    createUserBuildersView: () => Promise<void>;
    queryGlobalView: (viewName: any, params: any, db?: null) => any;
    init: (opts: any) => void;
    dangerousGetDB: (dbName: any, opts: any) => any;
    closeDB: (db: any) => Promise<any>;
    doWithDB: (dbName: any, cb: any, opts?: {}) => Promise<any>;
    allDbs: () => any[];
    SEPARATOR: "_";
    UNICODE_MAX: "￰";
    AutomationViewModes: typeof import("./src/db/constants").AutomationViewModes;
    ViewNames: typeof import("./src/db/constants").ViewNames;
    DeprecatedViews: {
        by_email2: string[];
    };
    DocumentTypes: typeof import("./src/db/constants").DocumentTypes;
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
    getDocParams(docType: any, docId?: any, otherProps?: any): any;
    getQueryIndex(viewName: import("./src/db/constants").ViewNames): string;
    generateWorkspaceID(): string;
    getWorkspaceParams(id?: string, otherProps?: {}): {
        startkey: string;
        endkey: string;
    };
    generateGlobalUserID(id?: any): string;
    getGlobalUserParams(globalId: any, otherProps?: any): any;
    getUsersByAppParams(appId: any, otherProps?: any): any;
    generateTemplateID(ownerId: any): string;
    generateAppUserID(prodAppId: string, userId: string): string;
    getTemplateParams(ownerId: any, templateId: any, otherProps?: {}): {
        startkey: any;
        endkey: string;
    };
    generateRoleID(id: any): string;
    getRoleParams(roleId?: null, otherProps?: {}): any;
    getStartEndKeyURL(base: any, baseKey: any, tenantId?: null): string;
    getAllDbs(opts?: {
        efficient: boolean;
    }): Promise<any[]>;
    getAllApps({ dev, all, idsOnly, efficient }?: any): Promise<any[]>;
    getProdAppIDs(): Promise<any[]>;
    getDevAppIDs(): Promise<any[]>;
    dbExists(dbName: any): Promise<any>;
    pagination(data: any[], pageSize: number, { paginate, property, getKey, }?: {
        paginate: boolean;
        property: string;
        getKey?: ((doc: any) => string | undefined) | undefined;
    }): {
        data: any[];
        hasNextPage: boolean;
        nextPage?: undefined;
    } | {
        data: any[];
        hasNextPage: boolean;
        nextPage: string | undefined;
    };
    getScopedConfig(db: any, params: any): Promise<any>;
    Replication: typeof import("./src/db/Replication").default;
    generateAppID: (tenantId?: null) => string;
    generateConfigID: ({ type, workspace, user }: any) => string;
    getConfigParams: ({ type, workspace, user }: any, otherProps?: {}) => {
        startkey: string;
        endkey: string;
    };
    generateDevInfoID: (userId: any) => string;
    getScopedFullConfig: (db: any, { type, user, workspace }: any) => Promise<any>;
    getPlatformUrl: (opts?: {
        tenantAware: boolean;
    }) => Promise<string>;
    isDevAppID: (appId: any) => any;
    isProdAppID: (appId: any) => any;
    isDevApp: (app: any) => any;
    getDevelopmentAppID: (appId: any) => string;
    getProdAppID: (appId: any) => any;
    extractAppUUID: (id: any) => any;
};
export = _exports;
