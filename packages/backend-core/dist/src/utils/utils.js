"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeout = exports.platformLogout = exports.getBuildersCount = exports.isClient = exports.clearCookie = exports.setCookie = exports.getCookie = exports.openJwt = exports.getAppIdFromCtx = exports.isServingApp = void 0;
const db_1 = require("../db");
const jwt_1 = require("../middleware/passport/jwt");
const constants_1 = require("../constants");
const environment_1 = __importDefault(require("../environment"));
const userCache = __importStar(require("../cache/user"));
const sessions_1 = require("../security/sessions");
const events = __importStar(require("../events"));
const tenancy = __importStar(require("../tenancy"));
const types_1 = require("@budibase/types");
const constants_2 = require("../constants");
const jwt = require("jsonwebtoken");
const APP_PREFIX = constants_2.DocumentType.APP + constants_2.SEPARATOR;
const PROD_APP_PREFIX = "/app/";
function confirmAppId(possibleAppId) {
    return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
        ? possibleAppId
        : undefined;
}
function resolveAppUrl(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const appUrl = ctx.path.split("/")[2];
        let possibleAppUrl = `/${appUrl.toLowerCase()}`;
        let tenantId = tenancy.getTenantId();
        if (environment_1.default.MULTI_TENANCY) {
            // always use the tenant id from the subdomain in multi tenancy
            // this ensures the logged-in user tenant id doesn't overwrite
            // e.g. in the case of viewing a public app while already logged-in to another tenant
            tenantId = tenancy.getTenantIDFromCtx(ctx, {
                includeStrategies: [types_1.TenantResolutionStrategy.SUBDOMAIN],
            });
        }
        // search prod apps for a url that matches
        const apps = yield tenancy.doInTenant(tenantId, () => (0, db_1.getAllApps)({ dev: false }));
        const app = apps.filter(a => a.url && a.url.toLowerCase() === possibleAppUrl)[0];
        return app && app.appId ? app.appId : undefined;
    });
}
function isServingApp(ctx) {
    // dev app
    if (ctx.path.startsWith(`/${APP_PREFIX}`)) {
        return true;
    }
    // prod app
    if (ctx.path.startsWith(PROD_APP_PREFIX)) {
        return true;
    }
    return false;
}
exports.isServingApp = isServingApp;
/**
 * Given a request tries to find the appId, which can be located in various places
 * @param {object} ctx The main request body to look through.
 * @returns {string|undefined} If an appId was found it will be returned.
 */
function getAppIdFromCtx(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        // look in headers
        const options = [ctx.headers[constants_1.Header.APP_ID]];
        let appId;
        for (let option of options) {
            appId = confirmAppId(option);
            if (appId) {
                break;
            }
        }
        // look in body
        if (!appId && ctx.request.body && ctx.request.body.appId) {
            appId = confirmAppId(ctx.request.body.appId);
        }
        // look in the url - dev app
        let appPath = ctx.request.headers.referrer ||
            ctx.path.split("/").filter(subPath => subPath.startsWith(APP_PREFIX));
        if (!appId && appPath.length) {
            appId = confirmAppId(appPath[0]);
        }
        // look in the url - prod app
        if (!appId && ctx.path.startsWith(PROD_APP_PREFIX)) {
            appId = confirmAppId(yield resolveAppUrl(ctx));
        }
        return appId;
    });
}
exports.getAppIdFromCtx = getAppIdFromCtx;
/**
 * opens the contents of the specified encrypted JWT.
 * @return {object} the contents of the token.
 */
function openJwt(token) {
    if (!token) {
        return token;
    }
    return jwt.verify(token, jwt_1.options.secretOrKey);
}
exports.openJwt = openJwt;
/**
 * Get a cookie from context, and decrypt if necessary.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to get.
 */
function getCookie(ctx, name) {
    const cookie = ctx.cookies.get(name);
    if (!cookie) {
        return cookie;
    }
    return openJwt(cookie);
}
exports.getCookie = getCookie;
/**
 * Store a cookie for the request - it will not expire.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value of cookie which will be set.
 * @param {object} opts options like whether to sign.
 */
function setCookie(ctx, value, name = "builder", opts = { sign: true }) {
    if (value && opts && opts.sign) {
        value = jwt.sign(value, jwt_1.options.secretOrKey);
    }
    const config = {
        expires: constants_1.MAX_VALID_DATE,
        path: "/",
        httpOnly: false,
        overwrite: true,
    };
    if (environment_1.default.COOKIE_DOMAIN) {
        config.domain = environment_1.default.COOKIE_DOMAIN;
    }
    ctx.cookies.set(name, value, config);
}
exports.setCookie = setCookie;
/**
 * Utility function, simply calls setCookie with an empty string for value
 */
function clearCookie(ctx, name) {
    setCookie(ctx, null, name);
}
exports.clearCookie = clearCookie;
/**
 * Checks if the API call being made (based on the provided ctx object) is from the client. If
 * the call is not from a client app then it is from the builder.
 * @param {object} ctx The koa context object to be tested.
 * @return {boolean} returns true if the call is from the client lib (a built app rather than the builder).
 */
function isClient(ctx) {
    return ctx.headers[constants_1.Header.TYPE] === "client";
}
exports.isClient = isClient;
function getBuilders() {
    return __awaiter(this, void 0, void 0, function* () {
        const builders = yield (0, db_1.queryGlobalView)(constants_2.ViewName.USER_BY_BUILDERS, {
            include_docs: false,
        });
        if (!builders) {
            return [];
        }
        if (Array.isArray(builders)) {
            return builders;
        }
        else {
            return [builders];
        }
    });
}
function getBuildersCount() {
    return __awaiter(this, void 0, void 0, function* () {
        const builders = yield getBuilders();
        return builders.length;
    });
}
exports.getBuildersCount = getBuildersCount;
/**
 * Logs a user out from budibase. Re-used across account portal and builder.
 */
function platformLogout(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = opts.ctx;
        const userId = opts.userId;
        const keepActiveSession = opts.keepActiveSession;
        if (!ctx)
            throw new Error("Koa context must be supplied to logout.");
        const currentSession = getCookie(ctx, constants_1.Cookie.Auth);
        let sessions = yield (0, sessions_1.getSessionsForUser)(userId);
        if (keepActiveSession) {
            sessions = sessions.filter(session => session.sessionId !== currentSession.sessionId);
        }
        else {
            // clear cookies
            clearCookie(ctx, constants_1.Cookie.Auth);
            clearCookie(ctx, constants_1.Cookie.CurrentApp);
        }
        const sessionIds = sessions.map(({ sessionId }) => sessionId);
        yield (0, sessions_1.invalidateSessions)(userId, { sessionIds, reason: "logout" });
        yield events.auth.logout();
        yield userCache.invalidateUser(userId);
    });
}
exports.platformLogout = platformLogout;
function timeout(timeMs) {
    return new Promise(resolve => setTimeout(resolve, timeMs));
}
exports.timeout = timeout;
//# sourceMappingURL=utils.js.map