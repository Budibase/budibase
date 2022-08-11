"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Headers } = require("../constants");
const { buildMatcherRegex, matches } = require("./matchers");
/**
 * GET, HEAD and OPTIONS methods are considered safe operations
 *
 * POST, PUT, PATCH, and DELETE methods, being state changing verbs,
 * should have a CSRF token attached to the request
 */
const EXCLUDED_METHODS = ["GET", "HEAD", "OPTIONS"];
/**
 * There are only three content type values that can be used in cross domain requests.
 * If any other value is used, e.g. application/json, the browser will first make a OPTIONS
 * request which will be protected by CORS.
 */
const INCLUDED_CONTENT_TYPES = [
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain",
];
/**
 * Validate the CSRF token generated aganst the user session.
 * Compare the token with the x-csrf-token header.
 *
 * If the token is not found within the request or the value provided
 * does not match the value within the user session, the request is rejected.
 *
 * CSRF protection provided using the 'Synchronizer Token Pattern'
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern
 *
 */
module.exports = (opts = { noCsrfPatterns: [] }) => {
    const noCsrfOptions = buildMatcherRegex(opts.noCsrfPatterns);
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        // don't apply for excluded paths
        const found = matches(ctx, noCsrfOptions);
        if (found) {
            return next();
        }
        // don't apply for the excluded http methods
        if (EXCLUDED_METHODS.indexOf(ctx.method) !== -1) {
            return next();
        }
        // don't apply when the content type isn't supported
        let contentType = ctx.get("content-type")
            ? ctx.get("content-type").toLowerCase()
            : "";
        if (!INCLUDED_CONTENT_TYPES.filter(type => contentType.includes(type)).length) {
            return next();
        }
        // don't apply csrf when the internal api key has been used
        if (ctx.internal) {
            return next();
        }
        // apply csrf when there is a token in the session (new logins)
        // in future there should be a hard requirement that the token is present
        const userToken = ctx.user.csrfToken;
        if (!userToken) {
            return next();
        }
        // reject if no token in request or mismatch
        const requestToken = ctx.get(Headers.CSRF_TOKEN);
        if (!requestToken || requestToken !== userToken) {
            ctx.throw(403, "Invalid CSRF token");
        }
        return next();
    });
};
//# sourceMappingURL=csrf.js.map