import { BBContext, PlatformLogoutOpts } from "@budibase/types";
export declare function isServingApp(ctx: BBContext): boolean;
/**
 * Given a request tries to find the appId, which can be located in various places
 * @param {object} ctx The main request body to look through.
 * @returns {string|undefined} If an appId was found it will be returned.
 */
export declare function getAppIdFromCtx(ctx: BBContext): Promise<string | undefined>;
/**
 * opens the contents of the specified encrypted JWT.
 * @return {object} the contents of the token.
 */
export declare function openJwt(token: string): any;
/**
 * Get a cookie from context, and decrypt if necessary.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to get.
 */
export declare function getCookie(ctx: BBContext, name: string): any;
/**
 * Store a cookie for the request - it will not expire.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value of cookie which will be set.
 * @param {object} opts options like whether to sign.
 */
export declare function setCookie(ctx: BBContext, value: any, name?: string, opts?: {
    sign: boolean;
}): void;
/**
 * Utility function, simply calls setCookie with an empty string for value
 */
export declare function clearCookie(ctx: BBContext, name: string): void;
/**
 * Checks if the API call being made (based on the provided ctx object) is from the client. If
 * the call is not from a client app then it is from the builder.
 * @param {object} ctx The koa context object to be tested.
 * @return {boolean} returns true if the call is from the client lib (a built app rather than the builder).
 */
export declare function isClient(ctx: BBContext): boolean;
export declare function getBuildersCount(): Promise<number>;
/**
 * Logs a user out from budibase. Re-used across account portal and builder.
 */
export declare function platformLogout(opts: PlatformLogoutOpts): Promise<void>;
export declare function timeout(timeMs: number): Promise<unknown>;
