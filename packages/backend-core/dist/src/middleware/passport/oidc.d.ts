export function strategyFactory(config: any, saveUserFn: any): Promise<any>;
export function fetchStrategyConfig(enrichedConfig: any, callbackUrl: any): Promise<{
    issuer: any;
    authorizationURL: any;
    tokenURL: any;
    userInfoURL: any;
    clientID: any;
    clientSecret: any;
    callbackURL: any;
}>;
export function getCallbackUrl(db: any, config: any): Promise<any>;
export function buildVerifyFn(saveUserFn: any): (issuer: any, sub: any, profile: any, jwtClaims: any, accessToken: any, refreshToken: any, idToken: any, params: any, done: any) => Promise<any>;
