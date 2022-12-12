export { auditLog, authError, internalApi, ssoCallbackUrl, adminOnly, builderOnly, builderOrAdmin, joiValidator, google, oidc, } from "../middleware";
export declare const buildAuthMiddleware: (noAuthPatterns?: import("@budibase/types").EndpointMatcher[], opts?: {
    publicAllowed?: boolean | undefined;
    populateUser?: Function | undefined;
}) => (ctx: any, next: any) => Promise<any>;
export declare const buildTenancyMiddleware: (allowQueryStringPatterns: import("@budibase/types").EndpointMatcher[], noTenancyPatterns: import("@budibase/types").EndpointMatcher[], opts?: {
    noTenancyRequired?: boolean | undefined;
}) => (ctx: any, next: any) => Promise<any>;
export declare const buildCsrfMiddleware: (opts?: {
    noCsrfPatterns: import("@budibase/types").EndpointMatcher[];
}) => (ctx: any, next: any) => Promise<any>;
export declare const passport: any;
export declare const jwt: any;
export declare function refreshOAuthToken(refreshToken: string, configType: string, configId: string): Promise<unknown>;
export declare function updateUserOAuth(userId: string, oAuthConfig: any): Promise<void>;
