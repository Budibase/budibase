declare const _exports: {
    google: typeof import("./src/middleware/passport/google");
    oidc: typeof import("./src/middleware/passport/oidc");
    jwt: typeof import("./src/middleware/passport/jwt");
    local: typeof import("./src/middleware/passport/local");
    authenticated: typeof import("./src/middleware/authenticated");
    auditLog: (ctx: any, next: any) => Promise<any>;
    tenancy: (allowQueryStringPatterns: any, noTenancyPatterns: any, opts?: {
        noTenancyRequired: boolean;
    }) => (ctx: any, next: any) => Promise<any>;
    authError: (done: any, message: any, err?: any) => any;
    internalApi: (ctx: any, next: any) => Promise<any>;
    ssoCallbackUrl: (db: any, config: any, type: any) => Promise<any>;
    datasource: {
        google: typeof import("./src/middleware/passport/datasource/google");
    };
    csrf: (opts?: {
        noCsrfPatterns: never[];
    }) => (ctx: any, next: any) => Promise<any>;
    adminOnly: (ctx: any, next: any) => Promise<any>;
    builderOnly: (ctx: any, next: any) => Promise<any>;
    builderOrAdmin: (ctx: any, next: any) => Promise<any>;
    joiValidator: typeof import("./src/middleware/joi-validator");
};
export = _exports;
