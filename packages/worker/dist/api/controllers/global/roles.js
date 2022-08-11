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
const { getAllRoles } = require("@budibase/backend-core/roles");
const { getAllApps, getProdAppID, DocumentTypes, } = require("@budibase/backend-core/db");
const { doInAppContext, getAppDB } = require("@budibase/backend-core/context");
const { user: userCache } = require("@budibase/backend-core/cache");
const { getGlobalDB } = require("@budibase/backend-core/tenancy");
const { allUsers } = require("../../../sdk/users");
exports.fetch = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantId = ctx.user.tenantId;
    // always use the dev apps as they'll be most up to date (true)
    const apps = yield getAllApps({ tenantId, all: true });
    const promises = [];
    for (let app of apps) {
        // use dev app IDs
        promises.push(getAllRoles(app.appId));
    }
    const roles = yield Promise.all(promises);
    const response = {};
    for (let app of apps) {
        const deployedAppId = getProdAppID(app.appId);
        response[deployedAppId] = {
            roles: roles.shift(),
            name: app.name,
            version: app.version,
            url: app.url,
        };
    }
    ctx.body = response;
});
exports.find = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const appId = ctx.params.appId;
    yield doInAppContext(appId, () => __awaiter(void 0, void 0, void 0, function* () {
        const db = getAppDB();
        const app = yield db.get(DocumentTypes.APP_METADATA);
        ctx.body = {
            roles: yield getAllRoles(),
            name: app.name,
            version: app.version,
            url: app.url,
        };
    }));
});
exports.removeAppRole = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { appId } = ctx.params;
    const db = getGlobalDB();
    const users = yield allUsers(ctx);
    const bulk = [];
    const cacheInvalidations = [];
    for (let user of users) {
        if (user.roles[appId]) {
            cacheInvalidations.push(userCache.invalidateUser(user._id));
            delete user.roles[appId];
            bulk.push(user);
        }
    }
    yield db.bulkDocs(bulk);
    yield Promise.all(cacheInvalidations);
    ctx.body = {
        message: "App role removed from all users",
    };
});
