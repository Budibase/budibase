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
const redis = require("../redis/init");
const { getTenantId, lookupTenantId, doWithGlobalDB } = require("../tenancy");
const env = require("../environment");
const accounts = require("../cloud/accounts");
const EXPIRY_SECONDS = 3600;
/**
 * The default populate user function
 */
const populateFromDB = (userId, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield doWithGlobalDB(tenantId, db => db.get(userId));
    user.budibaseAccess = true;
    if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
        const account = yield accounts.getAccount(user.email);
        if (account) {
            user.account = account;
            user.accountPortalAccess = true;
        }
    }
    return user;
});
/**
 * Get the requested user by id.
 * Use redis cache to first read the user.
 * If not present fallback to loading the user directly and re-caching.
 * @param {*} userId the id of the user to get
 * @param {*} tenantId the tenant of the user to get
 * @param {*} populateUser function to provide the user for re-caching. default to couch db
 * @returns
 */
exports.getUser = (userId, tenantId = null, populateUser = null) => __awaiter(void 0, void 0, void 0, function* () {
    if (!populateUser) {
        populateUser = populateFromDB;
    }
    if (!tenantId) {
        try {
            tenantId = getTenantId();
        }
        catch (err) {
            tenantId = yield lookupTenantId(userId);
        }
    }
    const client = yield redis.getUserClient();
    // try cache
    let user = yield client.get(userId);
    if (!user) {
        user = yield populateUser(userId, tenantId);
        client.store(userId, user, EXPIRY_SECONDS);
    }
    if (user && !user.tenantId && tenantId) {
        // make sure the tenant ID is always correct/set
        user.tenantId = tenantId;
    }
    return user;
});
exports.invalidateUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield redis.getUserClient();
    yield client.delete(userId);
});
//# sourceMappingURL=user.js.map