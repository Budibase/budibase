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
const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { getGlobalDB } = require("./tenancy");
const refresh = require("passport-oauth2-refresh");
const { Configs } = require("./constants");
const { getScopedConfig } = require("./db/utils");
const { jwt, local, authenticated, google, oidc, auditLog, tenancy, appTenancy, authError, ssoCallbackUrl, csrf, internalApi, adminOnly, builderOnly, builderOrAdmin, joiValidator, } = require("./middleware");
const { invalidateUser } = require("./cache/user");
// Strategies
passport.use(new LocalStrategy(local.options, local.authenticate));
passport.use(new JwtStrategy(jwt.options, jwt.authenticate));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    try {
        const user = yield db.get(user._id);
        return done(null, user);
    }
    catch (err) {
        console.error(`User not found`, err);
        return done(null, false, { message: "User not found" });
    }
}));
function refreshOIDCAccessToken(db, chosenConfig, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const callbackUrl = yield oidc.getCallbackUrl(db, chosenConfig);
        let enrichedConfig;
        let strategy;
        try {
            enrichedConfig = yield oidc.fetchStrategyConfig(chosenConfig, callbackUrl);
            if (!enrichedConfig) {
                throw new Error("OIDC Config contents invalid");
            }
            strategy = yield oidc.strategyFactory(enrichedConfig);
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
            refresh.requestNewAccessToken(Configs.OIDC, refreshToken, (err, accessToken, refreshToken, params) => {
                resolve({ err, accessToken, refreshToken, params });
            });
        });
    });
}
function refreshGoogleAccessToken(db, config, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        let callbackUrl = yield google.getCallbackUrl(db, config);
        let strategy;
        try {
            strategy = yield google.strategyFactory(config, callbackUrl);
        }
        catch (err) {
            console.error(err);
            throw new Error("Error constructing OIDC refresh strategy", err);
        }
        refresh.use(strategy);
        return new Promise(resolve => {
            refresh.requestNewAccessToken(Configs.GOOGLE, refreshToken, (err, accessToken, refreshToken, params) => {
                resolve({ err, accessToken, refreshToken, params });
            });
        });
    });
}
function refreshOAuthToken(refreshToken, configType, configId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const config = yield getScopedConfig(db, {
            type: configType,
            group: {},
        });
        let chosenConfig = {};
        let refreshResponse;
        if (configType === Configs.OIDC) {
            // configId - retrieved from cookie.
            chosenConfig = config.configs.filter(c => c.uuid === configId)[0];
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
function updateUserOAuth(userId, oAuthConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const details = {
            accessToken: oAuthConfig.accessToken,
            refreshToken: oAuthConfig.refreshToken,
        };
        try {
            const db = getGlobalDB();
            const dbUser = yield db.get(userId);
            //Do not overwrite the refresh token if a valid one is not provided.
            if (typeof details.refreshToken !== "string") {
                delete details.refreshToken;
            }
            dbUser.oauth2 = Object.assign(Object.assign({}, dbUser.oauth2), details);
            yield db.put(dbUser);
            yield invalidateUser(userId);
        }
        catch (e) {
            console.error("Could not update OAuth details for current user", e);
        }
    });
}
module.exports = {
    buildAuthMiddleware: authenticated,
    passport,
    google,
    oidc,
    jwt: require("jsonwebtoken"),
    buildTenancyMiddleware: tenancy,
    buildAppTenancyMiddleware: appTenancy,
    auditLog,
    authError,
    buildCsrfMiddleware: csrf,
    internalApi,
    refreshOAuthToken,
    updateUserOAuth,
    ssoCallbackUrl,
    adminOnly,
    builderOnly,
    builderOrAdmin,
    joiValidator,
};
//# sourceMappingURL=auth.js.map