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
exports.oidcAuth = exports.oidcPreAuth = exports.oidcStrategyFactory = exports.googleAuth = exports.googlePreAuth = exports.datasourceAuth = exports.datasourcePreAuth = exports.logout = exports.resetUpdate = exports.reset = exports.getInitInfo = exports.setInitInfo = exports.authenticate = exports.oidcCallbackUrl = exports.googleCallbackUrl = void 0;
const core = require("@budibase/backend-core");
const { Configs, EmailTemplatePurpose } = require("../../../constants");
const { sendEmail, isEmailConfigured } = require("../../../utilities/email");
const { setCookie, getCookie, clearCookie, hash, platformLogout } = core.utils;
const { Cookies, Headers } = core.constants;
const { passport, ssoCallbackUrl, google, oidc } = core.auth;
const { checkResetPasswordCode } = require("../../../utilities/redis");
const { getGlobalDB } = require("@budibase/backend-core/tenancy");
const env = require("../../../environment");
const backend_core_1 = require("@budibase/backend-core");
const sdk_1 = require("../../../sdk");
const googleCallbackUrl = (config) => __awaiter(void 0, void 0, void 0, function* () {
    return ssoCallbackUrl(getGlobalDB(), config, "google");
});
exports.googleCallbackUrl = googleCallbackUrl;
const oidcCallbackUrl = (config) => __awaiter(void 0, void 0, void 0, function* () {
    return ssoCallbackUrl(getGlobalDB(), config, "oidc");
});
exports.oidcCallbackUrl = oidcCallbackUrl;
function authInternal(ctx, user, err = null, info = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (err) {
            console.error("Authentication error", err);
            return ctx.throw(403, info ? info : "Unauthorized");
        }
        if (!user) {
            return ctx.throw(403, info ? info : "Unauthorized");
        }
        // set a cookie for browser access
        setCookie(ctx, user.token, Cookies.Auth, { sign: false });
        // set the token in a header as well for APIs
        ctx.set(Headers.TOKEN, user.token);
        // get rid of any app cookies on login
        // have to check test because this breaks cypress
        if (!env.isTest()) {
            clearCookie(ctx, Cookies.CurrentApp);
        }
    });
}
const authenticate = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    return passport.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        yield authInternal(ctx, user, err, info);
        yield backend_core_1.context.identity.doInUserContext(user, () => __awaiter(void 0, void 0, void 0, function* () {
            yield backend_core_1.events.auth.login("local");
        }));
        ctx.status = 200;
    }))(ctx, next);
});
exports.authenticate = authenticate;
const setInitInfo = (ctx) => {
    const initInfo = ctx.request.body;
    setCookie(ctx, initInfo, Cookies.Init);
    ctx.status = 200;
};
exports.setInitInfo = setInitInfo;
const getInitInfo = (ctx) => {
    try {
        ctx.body = getCookie(ctx, Cookies.Init) || {};
    }
    catch (err) {
        clearCookie(ctx, Cookies.Init);
        ctx.body = {};
    }
};
exports.getInitInfo = getInitInfo;
/**
 * Reset the user password, used as part of a forgotten password flow.
 */
const reset = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = ctx.request.body;
    const configured = yield isEmailConfigured();
    if (!configured) {
        ctx.throw(400, "Please contact your platform administrator, SMTP is not configured.");
    }
    try {
        const user = (yield backend_core_1.users.getGlobalUserByEmail(email));
        // only if user exists, don't error though if they don't
        if (user) {
            yield sendEmail(email, EmailTemplatePurpose.PASSWORD_RECOVERY, {
                user,
                subject: "{{ company }} platform password reset",
            });
            yield backend_core_1.events.user.passwordResetRequested(user);
        }
    }
    catch (err) {
        console.log(err);
        // don't throw any kind of error to the user, this might give away something
    }
    ctx.body = {
        message: "Please check your email for a reset link.",
    };
});
exports.reset = reset;
/**
 * Perform the user password update if the provided reset code is valid.
 */
const resetUpdate = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetCode, password } = ctx.request.body;
    try {
        const { userId } = yield checkResetPasswordCode(resetCode);
        const db = getGlobalDB();
        const user = yield db.get(userId);
        user.password = yield hash(password);
        yield db.put(user);
        ctx.body = {
            message: "password reset successfully.",
        };
        // remove password from the user before sending events
        delete user.password;
        yield backend_core_1.events.user.passwordReset(user);
    }
    catch (err) {
        console.error(err);
        ctx.throw(400, "Cannot reset password.");
    }
});
exports.resetUpdate = resetUpdate;
const logout = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.user && ctx.user._id) {
        yield platformLogout({ ctx, userId: ctx.user._id });
    }
    ctx.body = { message: "User logged out." };
});
exports.logout = logout;
const datasourcePreAuth = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = ctx.params.provider;
    const middleware = require(`@budibase/backend-core/middleware`);
    const handler = middleware.datasource[provider];
    setCookie(ctx, {
        provider,
        appId: ctx.query.appId,
        datasourceId: ctx.query.datasourceId,
    }, Cookies.DatasourceAuth);
    return handler.preAuth(passport, ctx, next);
});
exports.datasourcePreAuth = datasourcePreAuth;
const datasourceAuth = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authStateCookie = getCookie(ctx, Cookies.DatasourceAuth);
    const provider = authStateCookie.provider;
    const middleware = require(`@budibase/backend-core/middleware`);
    const handler = middleware.datasource[provider];
    return handler.postAuth(passport, ctx, next);
});
exports.datasourceAuth = datasourceAuth;
/**
 * The initial call that google authentication makes to take you to the google login screen.
 * On a successful login, you will be redirected to the googleAuth callback route.
 */
const googlePreAuth = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    const config = yield core.db.getScopedConfig(db, {
        type: Configs.GOOGLE,
        workspace: ctx.query.workspace,
    });
    let callbackUrl = yield exports.googleCallbackUrl(config);
    const strategy = yield google.strategyFactory(config, callbackUrl, sdk_1.users.save);
    return passport.authenticate(strategy, {
        scope: ["profile", "email"],
        accessType: "offline",
        prompt: "consent",
    })(ctx, next);
});
exports.googlePreAuth = googlePreAuth;
const googleAuth = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    const config = yield core.db.getScopedConfig(db, {
        type: Configs.GOOGLE,
        workspace: ctx.query.workspace,
    });
    const callbackUrl = yield exports.googleCallbackUrl(config);
    const strategy = yield google.strategyFactory(config, callbackUrl, sdk_1.users.save);
    return passport.authenticate(strategy, { successRedirect: "/", failureRedirect: "/error" }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        yield authInternal(ctx, user, err, info);
        yield backend_core_1.context.identity.doInUserContext(user, () => __awaiter(void 0, void 0, void 0, function* () {
            yield backend_core_1.events.auth.login("google-internal");
        }));
        ctx.redirect("/");
    }))(ctx, next);
});
exports.googleAuth = googleAuth;
const oidcStrategyFactory = (ctx, configId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    const config = yield core.db.getScopedConfig(db, {
        type: Configs.OIDC,
        group: ctx.query.group,
    });
    const chosenConfig = config.configs.filter((c) => c.uuid === configId)[0];
    let callbackUrl = yield exports.oidcCallbackUrl(chosenConfig);
    //Remote Config
    const enrichedConfig = yield oidc.fetchStrategyConfig(chosenConfig, callbackUrl);
    return oidc.strategyFactory(enrichedConfig, sdk_1.users.save);
});
exports.oidcStrategyFactory = oidcStrategyFactory;
/**
 * The initial call that OIDC authentication makes to take you to the configured OIDC login screen.
 * On a successful login, you will be redirected to the oidcAuth callback route.
 */
const oidcPreAuth = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { configId } = ctx.params;
    const strategy = yield (0, exports.oidcStrategyFactory)(ctx, configId);
    setCookie(ctx, configId, Cookies.OIDC_CONFIG);
    return passport.authenticate(strategy, {
        // required 'openid' scope is added by oidc strategy factory
        scope: ["profile", "email", "offline_access"], //auth0 offline_access scope required for the refresh token behaviour.
    })(ctx, next);
});
exports.oidcPreAuth = oidcPreAuth;
const oidcAuth = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const configId = getCookie(ctx, Cookies.OIDC_CONFIG);
    const strategy = yield (0, exports.oidcStrategyFactory)(ctx, configId);
    return passport.authenticate(strategy, { successRedirect: "/", failureRedirect: "/error" }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        yield authInternal(ctx, user, err, info);
        yield backend_core_1.context.identity.doInUserContext(user, () => __awaiter(void 0, void 0, void 0, function* () {
            yield backend_core_1.events.auth.login("oidc");
        }));
        ctx.redirect("/");
    }))(ctx, next);
});
exports.oidcAuth = oidcAuth;
