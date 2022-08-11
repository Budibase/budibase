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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const user_1 = require("../cache/user");
const sessions_1 = require("../security/sessions");
const matchers_1 = require("./matchers");
const constants_2 = require("../db/constants");
const utils_2 = require("../db/utils");
const views_1 = require("../db/views");
const tenancy_1 = require("../tenancy");
const encryption_1 = require("../security/encryption");
const identity = require("../context/identity");
const env = require("../environment");
const ONE_MINUTE = env.SESSION_UPDATE_PERIOD || 60 * 1000;
function timeMinusOneMinute() {
    return new Date(Date.now() - ONE_MINUTE).toISOString();
}
function finalise(ctx, opts = {}) {
    ctx.publicEndpoint = opts.publicEndpoint || false;
    ctx.isAuthenticated = opts.authenticated || false;
    ctx.user = opts.user;
    ctx.internal = opts.internal || false;
    ctx.version = opts.version;
}
function checkApiKey(apiKey, populateUser) {
    return __awaiter(this, void 0, void 0, function* () {
        if (apiKey === env.INTERNAL_API_KEY) {
            return { valid: true };
        }
        const decrypted = (0, encryption_1.decrypt)(apiKey);
        const tenantId = decrypted.split(constants_2.SEPARATOR)[0];
        return (0, tenancy_1.doInTenant)(tenantId, () => __awaiter(this, void 0, void 0, function* () {
            const db = (0, tenancy_1.getGlobalDB)();
            // api key is encrypted in the database
            const userId = yield (0, views_1.queryGlobalView)(utils_2.ViewNames.BY_API_KEY, {
                key: apiKey,
            }, db);
            if (userId) {
                return {
                    valid: true,
                    user: yield (0, user_1.getUser)(userId, tenantId, populateUser),
                };
            }
            else {
                throw "Invalid API key";
            }
        }));
    });
}
/**
 * This middleware is tenancy aware, so that it does not depend on other middlewares being used.
 * The tenancy modules should not be used here and it should be assumed that the tenancy context
 * has not yet been populated.
 */
module.exports = (noAuthPatterns = [], opts = {
    publicAllowed: false,
}) => {
    const noAuthOptions = noAuthPatterns ? (0, matchers_1.buildMatcherRegex)(noAuthPatterns) : [];
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        let publicEndpoint = false;
        const version = ctx.request.headers[constants_1.Headers.API_VER];
        // the path is not authenticated
        const found = (0, matchers_1.matches)(ctx, noAuthOptions);
        if (found) {
            publicEndpoint = true;
        }
        try {
            // check the actual user is authenticated first, try header or cookie
            const headerToken = ctx.request.headers[constants_1.Headers.TOKEN];
            const authCookie = (0, utils_1.getCookie)(ctx, constants_1.Cookies.Auth) || (0, utils_1.openJwt)(headerToken);
            const apiKey = ctx.request.headers[constants_1.Headers.API_KEY];
            const tenantId = ctx.request.headers[constants_1.Headers.TENANT_ID];
            let authenticated = false, user = null, internal = false;
            if (authCookie && !apiKey) {
                const sessionId = authCookie.sessionId;
                const userId = authCookie.userId;
                let session;
                try {
                    // getting session handles error checking (if session exists etc)
                    session = yield (0, sessions_1.getSession)(userId, sessionId);
                    if (opts && opts.populateUser) {
                        user = yield (0, user_1.getUser)(userId, session.tenantId, opts.populateUser(ctx));
                    }
                    else {
                        user = yield (0, user_1.getUser)(userId, session.tenantId);
                    }
                    user.csrfToken = session.csrfToken;
                    if ((session === null || session === void 0 ? void 0 : session.lastAccessedAt) < timeMinusOneMinute()) {
                        // make sure we denote that the session is still in use
                        yield (0, sessions_1.updateSessionTTL)(session);
                    }
                    authenticated = true;
                }
                catch (err) {
                    authenticated = false;
                    console.error("Auth Error", (err === null || err === void 0 ? void 0 : err.message) || err);
                    // remove the cookie as the user does not exist anymore
                    (0, utils_1.clearCookie)(ctx, constants_1.Cookies.Auth);
                }
            }
            // this is an internal request, no user made it
            if (!authenticated && apiKey) {
                const populateUser = opts.populateUser ? opts.populateUser(ctx) : null;
                const { valid, user: foundUser } = yield checkApiKey(apiKey, populateUser);
                if (valid && foundUser) {
                    authenticated = true;
                    user = foundUser;
                }
                else if (valid) {
                    authenticated = true;
                    internal = true;
                }
            }
            if (!user && tenantId) {
                user = { tenantId };
            }
            else if (user) {
                delete user.password;
            }
            // be explicit
            if (authenticated !== true) {
                authenticated = false;
            }
            // isAuthenticated is a function, so use a variable to be able to check authed state
            finalise(ctx, { authenticated, user, internal, version, publicEndpoint });
            if (user && user.email) {
                return identity.doInUserContext(user, next);
            }
            else {
                return next();
            }
        }
        catch (err) {
            // invalid token, clear the cookie
            if (err && err.name === "JsonWebTokenError") {
                (0, utils_1.clearCookie)(ctx, constants_1.Cookies.Auth);
            }
            // allow configuring for public access
            if ((opts && opts.publicAllowed) || publicEndpoint) {
                finalise(ctx, { authenticated: false, version, publicEndpoint });
                return next();
            }
            else {
                ctx.throw(err.status || 403, err);
            }
        }
    });
};
//# sourceMappingURL=authenticated.js.map