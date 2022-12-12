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
exports.updateUserOAuth = exports.refreshOAuthToken = exports.jwt = exports.passport = exports.buildCsrfMiddleware = exports.buildTenancyMiddleware = exports.buildAuthMiddleware = exports.oidc = exports.google = exports.joiValidator = exports.builderOrAdmin = exports.builderOnly = exports.adminOnly = exports.ssoCallbackUrl = exports.internalApi = exports.authError = exports.auditLog = void 0;
const _passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const tenancy_1 = require("../tenancy");
const refresh = require("passport-oauth2-refresh");
const constants_1 = require("../constants");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const user_1 = require("../cache/user");
const logging_1 = require("../logging");
var middleware_2 = require("../middleware");
Object.defineProperty(exports, "auditLog", { enumerable: true, get: function () { return middleware_2.auditLog; } });
Object.defineProperty(exports, "authError", { enumerable: true, get: function () { return middleware_2.authError; } });
Object.defineProperty(exports, "internalApi", { enumerable: true, get: function () { return middleware_2.internalApi; } });
Object.defineProperty(exports, "ssoCallbackUrl", { enumerable: true, get: function () { return middleware_2.ssoCallbackUrl; } });
Object.defineProperty(exports, "adminOnly", { enumerable: true, get: function () { return middleware_2.adminOnly; } });
Object.defineProperty(exports, "builderOnly", { enumerable: true, get: function () { return middleware_2.builderOnly; } });
Object.defineProperty(exports, "builderOrAdmin", { enumerable: true, get: function () { return middleware_2.builderOrAdmin; } });
Object.defineProperty(exports, "joiValidator", { enumerable: true, get: function () { return middleware_2.joiValidator; } });
Object.defineProperty(exports, "google", { enumerable: true, get: function () { return middleware_2.google; } });
Object.defineProperty(exports, "oidc", { enumerable: true, get: function () { return middleware_2.oidc; } });
exports.buildAuthMiddleware = middleware_1.authenticated;
exports.buildTenancyMiddleware = middleware_1.tenancy;
exports.buildCsrfMiddleware = middleware_1.csrf;
exports.passport = _passport;
exports.jwt = require("jsonwebtoken");
// Strategies
_passport.use(new LocalStrategy(middleware_1.local.options, middleware_1.local.authenticate));
if (middleware_1.jwt.options.secretOrKey) {
    _passport.use(new JwtStrategy(middleware_1.jwt.options, middleware_1.jwt.authenticate));
}
else {
    (0, logging_1.logAlert)("No JWT Secret supplied, cannot configure JWT strategy");
}
_passport.serializeUser((user, done) => done(null, user));
_passport.deserializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, tenancy_1.getGlobalDB)();
    try {
        const dbUser = yield db.get(user._id);
        return done(null, dbUser);
    }
    catch (err) {
        console.error(`User not found`, err);
        return done(null, false, { message: "User not found" });
    }
}));
function refreshOIDCAccessToken(db, chosenConfig, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const callbackUrl = yield middleware_1.oidc.getCallbackUrl(db, chosenConfig);
        let enrichedConfig;
        let strategy;
        try {
            enrichedConfig = yield middleware_1.oidc.fetchStrategyConfig(chosenConfig, callbackUrl);
            if (!enrichedConfig) {
                throw new Error("OIDC Config contents invalid");
            }
            strategy = yield middleware_1.oidc.strategyFactory(enrichedConfig);
        }
        catch (err) {
            console.error(err);
            throw new Error("Could not refresh OAuth Token");
        }
        refresh.use(strategy, {
            setRefreshOAuth2() {
                return strategy._getOAuth2Client(enrichedConfig);
            },
        });
        return new Promise(resolve => {
            refresh.requestNewAccessToken(constants_1.Config.OIDC, refreshToken, (err, accessToken, refreshToken, params) => {
                resolve({ err, accessToken, refreshToken, params });
            });
        });
    });
}
function refreshGoogleAccessToken(db, config, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        let callbackUrl = yield middleware_1.google.getCallbackUrl(db, config);
        let strategy;
        try {
            strategy = yield middleware_1.google.strategyFactory(config, callbackUrl);
        }
        catch (err) {
            console.error(err);
            throw new Error(`Error constructing OIDC refresh strategy: message=${err.message}`);
        }
        refresh.use(strategy);
        return new Promise(resolve => {
            refresh.requestNewAccessToken(constants_1.Config.GOOGLE, refreshToken, (err, accessToken, refreshToken, params) => {
                resolve({ err, accessToken, refreshToken, params });
            });
        });
    });
}
function refreshOAuthToken(refreshToken, configType, configId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = (0, tenancy_1.getGlobalDB)();
        const config = yield (0, db_1.getScopedConfig)(db, {
            type: configType,
            group: {},
        });
        let chosenConfig = {};
        let refreshResponse;
        if (configType === constants_1.Config.OIDC) {
            // configId - retrieved from cookie.
            chosenConfig = config.configs.filter((c) => c.uuid === configId)[0];
            if (!chosenConfig) {
                throw new Error("Invalid OIDC configuration");
            }
            refreshResponse = yield refreshOIDCAccessToken(db, chosenConfig, refreshToken);
        }
        else {
            chosenConfig = config;
            refreshResponse = yield refreshGoogleAccessToken(db, chosenConfig, refreshToken);
        }
        return refreshResponse;
    });
}
exports.refreshOAuthToken = refreshOAuthToken;
function updateUserOAuth(userId, oAuthConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const details = {
            accessToken: oAuthConfig.accessToken,
            refreshToken: oAuthConfig.refreshToken,
        };
        try {
            const db = (0, tenancy_1.getGlobalDB)();
            const dbUser = yield db.get(userId);
            //Do not overwrite the refresh token if a valid one is not provided.
            if (typeof details.refreshToken !== "string") {
                delete details.refreshToken;
            }
            dbUser.oauth2 = Object.assign(Object.assign({}, dbUser.oauth2), details);
            yield db.put(dbUser);
            yield (0, user_1.invalidateUser)(userId);
        }
        catch (e) {
            console.error("Could not update OAuth details for current user", e);
        }
    });
}
exports.updateUserOAuth = updateUserOAuth;
//# sourceMappingURL=auth.js.map