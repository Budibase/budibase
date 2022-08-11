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
const google = require("../google");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { Cookies, Configs } = require("../../../constants");
const { clearCookie, getCookie } = require("../../../utils");
const { getScopedConfig, getPlatformUrl } = require("../../../db/utils");
const { doWithDB } = require("../../../db");
const environment = require("../../../environment");
const { getGlobalDB } = require("../../../tenancy");
function fetchGoogleCreds() {
    return __awaiter(this, void 0, void 0, function* () {
        // try and get the config from the tenant
        const db = getGlobalDB();
        const googleConfig = yield getScopedConfig(db, {
            type: Configs.GOOGLE,
        });
        // or fall back to env variables
        return (googleConfig || {
            clientID: environment.GOOGLE_CLIENT_ID,
            clientSecret: environment.GOOGLE_CLIENT_SECRET,
        });
    });
}
function preAuth(passport, ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // get the relevant config
        const googleConfig = yield fetchGoogleCreds();
        const platformUrl = yield getPlatformUrl({ tenantAware: false });
        let callbackUrl = `${platformUrl}/api/global/auth/datasource/google/callback`;
        const strategy = yield google.strategyFactory(googleConfig, callbackUrl);
        if (!ctx.query.appId || !ctx.query.datasourceId) {
            ctx.throw(400, "appId and datasourceId query params not present.");
        }
        return passport.authenticate(strategy, {
            scope: ["profile", "email", "https://www.googleapis.com/auth/spreadsheets"],
            accessType: "offline",
            prompt: "consent",
        })(ctx, next);
    });
}
function postAuth(passport, ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // get the relevant config
        const config = yield fetchGoogleCreds();
        const platformUrl = yield getPlatformUrl({ tenantAware: false });
        let callbackUrl = `${platformUrl}/api/global/auth/datasource/google/callback`;
        const authStateCookie = getCookie(ctx, Cookies.DatasourceAuth);
        return passport.authenticate(new GoogleStrategy({
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: callbackUrl,
        }, (accessToken, refreshToken, profile, done) => {
            clearCookie(ctx, Cookies.DatasourceAuth);
            done(null, { accessToken, refreshToken });
        }), { successRedirect: "/", failureRedirect: "/error" }, (err, tokens) => __awaiter(this, void 0, void 0, function* () {
            // update the DB for the datasource with all the user info
            yield doWithDB(authStateCookie.appId, (db) => __awaiter(this, void 0, void 0, function* () {
                const datasource = yield db.get(authStateCookie.datasourceId);
                if (!datasource.config) {
                    datasource.config = {};
                }
                datasource.config.auth = Object.assign({ type: "google" }, tokens);
                yield db.put(datasource);
                ctx.redirect(`/builder/app/${authStateCookie.appId}/data/datasource/${authStateCookie.datasourceId}`);
            }));
        }))(ctx, next);
    });
}
exports.preAuth = preAuth;
exports.postAuth = postAuth;
//# sourceMappingURL=google.js.map