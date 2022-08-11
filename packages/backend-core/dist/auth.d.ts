declare const _exports: {
    buildAuthMiddleware: typeof import("./src/middleware/authenticated");
    passport: any;
    google: typeof import("./src/middleware/passport/google");
    oidc: typeof import("./src/middleware/passport/oidc");
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
    joiValidator: typeof import("./src/middleware/joi-validator");
};
export = _exports;
