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
const { generateConfigID, getConfigParams, getScopedFullConfig, getAllApps, } = require("@budibase/backend-core/db");
const { Configs } = require("../../../constants");
const email = require("../../../utilities/email");
const { upload, ObjectStoreBuckets, } = require("@budibase/backend-core/objectStore");
const { getGlobalDB, getTenantId } = require("@budibase/backend-core/tenancy");
const env = require("../../../environment");
const { googleCallbackUrl, oidcCallbackUrl } = require("./auth");
const { withCache, CacheKeys, bustCache, cache, } = require("@budibase/backend-core/cache");
const { events } = require("@budibase/backend-core");
const { checkAnyUserExists } = require("../../../utilities/users");
const BB_TENANT_CDN = "https://tenants.cdn.budi.live";
const getEventFns = (db, config) => __awaiter(void 0, void 0, void 0, function* () {
    const fns = [];
    const type = config.type;
    let existing;
    if (config._id) {
        existing = yield db.get(config._id);
    }
    if (!existing) {
        switch (config.type) {
            case Configs.SMTP: {
                fns.push(events.email.SMTPCreated);
                break;
            }
            case Configs.GOOGLE: {
                fns.push(() => events.auth.SSOCreated(type));
                if (config.config.activated) {
                    fns.push(() => events.auth.SSOActivated(type));
                }
                break;
            }
            case Configs.OIDC: {
                fns.push(() => events.auth.SSOCreated(type));
                if (config.config.configs[0].activated) {
                    fns.push(() => events.auth.SSOActivated(type));
                }
                break;
            }
            case Configs.SETTINGS: {
                // company
                const company = config.config.company;
                if (company && company !== "Budibase") {
                    fns.push(events.org.nameUpdated);
                }
                // logo
                const logoUrl = config.config.logoUrl;
                if (logoUrl) {
                    fns.push(events.org.logoUpdated);
                }
                // platform url
                const platformUrl = config.config.platformUrl;
                if (platformUrl &&
                    platformUrl !== "http://localhost:10000" &&
                    env.SELF_HOSTED) {
                    fns.push(events.org.platformURLUpdated);
                }
                break;
            }
        }
    }
    else {
        switch (config.type) {
            case Configs.SMTP: {
                fns.push(events.email.SMTPUpdated);
                break;
            }
            case Configs.GOOGLE: {
                fns.push(() => events.auth.SSOUpdated(type));
                if (!existing.config.activated && config.config.activated) {
                    fns.push(() => events.auth.SSOActivated(type));
                }
                else if (existing.config.activated && !config.config.activated) {
                    fns.push(() => events.auth.SSODeactivated(type));
                }
                break;
            }
            case Configs.OIDC: {
                fns.push(() => events.auth.SSOUpdated(type));
                if (!existing.config.configs[0].activated &&
                    config.config.configs[0].activated) {
                    fns.push(() => events.auth.SSOActivated(type));
                }
                else if (existing.config.configs[0].activated &&
                    !config.config.configs[0].activated) {
                    fns.push(() => events.auth.SSODeactivated(type));
                }
                break;
            }
            case Configs.SETTINGS: {
                // company
                const existingCompany = existing.config.company;
                const company = config.config.company;
                if (company && company !== "Budibase" && existingCompany !== company) {
                    fns.push(events.org.nameUpdated);
                }
                // logo
                const existingLogoUrl = existing.config.logoUrl;
                const logoUrl = config.config.logoUrl;
                if (logoUrl && existingLogoUrl !== logoUrl) {
                    fns.push(events.org.logoUpdated);
                }
                // platform url
                const existingPlatformUrl = existing.config.platformUrl;
                const platformUrl = config.config.platformUrl;
                if (platformUrl &&
                    platformUrl !== "http://localhost:10000" &&
                    existingPlatformUrl !== platformUrl &&
                    env.SELF_HOSTED) {
                    fns.push(events.org.platformURLUpdated);
                }
                break;
            }
        }
    }
    return fns;
});
exports.save = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const { type, workspace, user, config } = ctx.request.body;
        let eventFns = yield getEventFns(db, ctx.request.body);
        // Config does not exist yet
        if (!ctx.request.body._id) {
            ctx.request.body._id = generateConfigID({
                type,
                workspace,
                user,
            });
        }
        try {
            // verify the configuration
            switch (type) {
                case Configs.SMTP:
                    yield email.verifyConfig(config);
                    break;
            }
        }
        catch (err) {
            ctx.throw(400, err);
        }
        try {
            const response = yield db.put(ctx.request.body);
            yield bustCache(CacheKeys.CHECKLIST);
            yield bustCache(CacheKeys.ANALYTICS_ENABLED);
            for (const fn of eventFns) {
                yield fn();
            }
            ctx.body = {
                type,
                _id: response.id,
                _rev: response.rev,
            };
        }
        catch (err) {
            ctx.throw(400, err);
        }
    });
};
exports.fetch = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const response = yield db.allDocs(getConfigParams({ type: ctx.params.type }, {
            include_docs: true,
        }));
        ctx.body = response.rows.map(row => row.doc);
    });
};
/**
 * Gets the most granular config for a particular configuration type.
 * The hierarchy is type -> workspace -> user.
 */
exports.find = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const { userId, workspaceId } = ctx.query;
        if (workspaceId && userId) {
            const workspace = yield db.get(workspaceId);
            const userInWorkspace = workspace.users.some(workspaceUser => workspaceUser === userId);
            if (!ctx.user.admin && !userInWorkspace) {
                ctx.throw(400, `User is not in specified workspace: ${workspace}.`);
            }
        }
        try {
            // Find the config with the most granular scope based on context
            const scopedConfig = yield getScopedFullConfig(db, {
                type: ctx.params.type,
                user: userId,
                workspace: workspaceId,
            });
            if (scopedConfig) {
                ctx.body = scopedConfig;
            }
            else {
                // don't throw an error, there simply is nothing to return
                ctx.body = {};
            }
        }
        catch (err) {
            ctx.throw(err.status, err);
        }
    });
};
exports.publicOidc = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        try {
            // Find the config with the most granular scope based on context
            const oidcConfig = yield getScopedFullConfig(db, {
                type: Configs.OIDC,
            });
            if (!oidcConfig) {
                ctx.body = {};
            }
            else {
                ctx.body = oidcConfig.config.configs.map(config => ({
                    logo: config.logo,
                    name: config.name,
                    uuid: config.uuid,
                }));
            }
        }
        catch (err) {
            ctx.throw(err.status, err);
        }
    });
};
exports.publicSettings = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        try {
            // Find the config with the most granular scope based on context
            const publicConfig = yield getScopedFullConfig(db, {
                type: Configs.SETTINGS,
            });
            const googleConfig = yield getScopedFullConfig(db, {
                type: Configs.GOOGLE,
            });
            const oidcConfig = yield getScopedFullConfig(db, {
                type: Configs.OIDC,
            });
            let config;
            if (!publicConfig) {
                config = {
                    config: {},
                };
            }
            else {
                config = publicConfig;
            }
            // google button flag
            if (googleConfig && googleConfig.config) {
                // activated by default for configs pre-activated flag
                config.config.google =
                    googleConfig.config.activated == null || googleConfig.config.activated;
            }
            else {
                config.config.google = false;
            }
            // callback urls
            config.config.oidcCallbackUrl = yield oidcCallbackUrl();
            config.config.googleCallbackUrl = yield googleCallbackUrl();
            // oidc button flag
            if (oidcConfig && oidcConfig.config) {
                config.config.oidc = oidcConfig.config.configs[0].activated;
            }
            else {
                config.config.oidc = false;
            }
            ctx.body = config;
        }
        catch (err) {
            ctx.throw(err.status, err);
        }
    });
};
exports.upload = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.request.files == null || ctx.request.files.file.length > 1) {
            ctx.throw(400, "One file must be uploaded.");
        }
        const file = ctx.request.files.file;
        const { type, name } = ctx.params;
        let bucket;
        if (env.SELF_HOSTED) {
            bucket = ObjectStoreBuckets.GLOBAL;
        }
        else {
            bucket = ObjectStoreBuckets.GLOBAL_CLOUD;
        }
        let key;
        if (env.MULTI_TENANCY) {
            key = `${getTenantId()}/${type}/${name}`;
        }
        else {
            key = `${type}/${name}`;
        }
        yield upload({
            bucket,
            filename: key,
            path: file.path,
            type: file.type,
        });
        // add to configuration structure
        // TODO: right now this only does a global level
        const db = getGlobalDB();
        let cfgStructure = yield getScopedFullConfig(db, { type });
        if (!cfgStructure) {
            cfgStructure = {
                _id: generateConfigID({ type }),
                config: {},
            };
        }
        let url;
        if (env.SELF_HOSTED) {
            url = `/${bucket}/${key}`;
        }
        else {
            url = `${BB_TENANT_CDN}/${key}`;
        }
        cfgStructure.config[`${name}`] = url;
        // write back to db with url updated
        yield db.put(cfgStructure);
        ctx.body = {
            message: "File has been uploaded and url stored to config.",
            url,
        };
    });
};
exports.destroy = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const { id, rev } = ctx.params;
        try {
            yield db.remove(id, rev);
            yield cache.delete(CacheKeys.CHECKLIST);
            ctx.body = { message: "Config deleted successfully" };
        }
        catch (err) {
            ctx.throw(err.status, err);
        }
    });
};
exports.configChecklist = function (ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getGlobalDB();
        const tenantId = getTenantId();
        try {
            ctx.body = yield withCache(CacheKeys.CHECKLIST, env.CHECKLIST_CACHE_TTL, () => __awaiter(this, void 0, void 0, function* () {
                let apps = [];
                if (!env.MULTI_TENANCY || tenantId) {
                    // Apps exist
                    apps = yield getAllApps({ idsOnly: true, efficient: true });
                }
                // They have set up SMTP
                const smtpConfig = yield getScopedFullConfig(db, {
                    type: Configs.SMTP,
                });
                // They have set up Google Auth
                const googleConfig = yield getScopedFullConfig(db, {
                    type: Configs.GOOGLE,
                });
                // They have set up OIDC
                const oidcConfig = yield getScopedFullConfig(db, {
                    type: Configs.OIDC,
                });
                // They have set up an global user
                const userExists = yield checkAnyUserExists();
                return {
                    apps: {
                        checked: apps.length > 0,
                        label: "Create your first app",
                        link: "/builder/portal/apps",
                    },
                    smtp: {
                        checked: !!smtpConfig,
                        label: "Set up email",
                        link: "/builder/portal/manage/email",
                    },
                    adminUser: {
                        checked: userExists,
                        label: "Create your first user",
                        link: "/builder/portal/manage/users",
                    },
                    sso: {
                        checked: !!googleConfig || !!oidcConfig,
                        label: "Set up single sign-on",
                        link: "/builder/portal/manage/auth",
                    },
                };
            }));
        }
        catch (err) {
            ctx.throw(err.status, err);
        }
    });
};
