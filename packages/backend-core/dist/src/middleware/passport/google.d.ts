export function strategyFactory(config: any, callbackUrl: any, saveUserFn: any): Promise<any>;
export function getCallbackUrl(db: any, config: any): Promise<any>;
export function buildVerifyFn(saveUserFn: any): (accessToken: any, refreshToken: any, profile: any, done: any) => Promise<any>;
