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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevAppDB = exports.getProdAppDB = exports.getAppDB = exports.getGlobalDB = exports.updateAppId = exports.updateTenantId = exports.getAppId = exports.getTenantId = exports.getIdentity = exports.doInIdentityContext = exports.doInAppContext = exports.doInTenant = exports.doInContext = exports.getTenantIDFromAppID = exports.isTenancyEnabled = exports.isTenantIdSet = exports.isMultiTenant = exports.baseGlobalDBName = exports.getGlobalDBName = void 0;
// some test cases call functions directly, need to
// store an app ID to pretend there is a context
const environment_1 = __importDefault(require("../environment"));
const Context_1 = __importDefault(require("./Context"));
const conversions_1 = require("../db/conversions");
const db_1 = require("../db/db");
const constants_1 = require("../constants");
let TEST_APP_ID = null;
function getGlobalDBName(tenantId) {
    // tenant ID can be set externally, for example user API where
    // new tenants are being created, this may be the case
    if (!tenantId) {
        tenantId = getTenantId();
    }
    return baseGlobalDBName(tenantId);
}
exports.getGlobalDBName = getGlobalDBName;
function baseGlobalDBName(tenantId) {
    let dbName;
    if (!tenantId || tenantId === constants_1.DEFAULT_TENANT_ID) {
        dbName = constants_1.StaticDatabases.GLOBAL.name;
    }
    else {
        dbName = `${tenantId}${constants_1.SEPARATOR}${constants_1.StaticDatabases.GLOBAL.name}`;
    }
    return dbName;
}
exports.baseGlobalDBName = baseGlobalDBName;
function isMultiTenant() {
    return environment_1.default.MULTI_TENANCY;
}
exports.isMultiTenant = isMultiTenant;
function isTenantIdSet() {
    const context = Context_1.default.get();
    return !!(context === null || context === void 0 ? void 0 : context.tenantId);
}
exports.isTenantIdSet = isTenantIdSet;
function isTenancyEnabled() {
    return environment_1.default.MULTI_TENANCY;
}
exports.isTenancyEnabled = isTenancyEnabled;
/**
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
function getTenantIDFromAppID(appId) {
    if (!appId) {
        return undefined;
    }
    if (!isMultiTenant()) {
        return constants_1.DEFAULT_TENANT_ID;
    }
    const split = appId.split(constants_1.SEPARATOR);
    const hasDev = split[1] === constants_1.DocumentType.DEV;
    if ((hasDev && split.length === 3) || (!hasDev && split.length === 2)) {
        return undefined;
    }
    if (hasDev) {
        return split[2];
    }
    else {
        return split[1];
    }
}
exports.getTenantIDFromAppID = getTenantIDFromAppID;
function updateContext(updates) {
    let context;
    try {
        context = Context_1.default.get();
    }
    catch (err) {
        // no context, start empty
        context = {};
    }
    context = Object.assign(Object.assign({}, context), updates);
    return context;
}
function newContext(updates, task) {
    return __awaiter(this, void 0, void 0, function* () {
        // see if there already is a context setup
        let context = updateContext(updates);
        return Context_1.default.run(context, task);
    });
}
function doInContext(appId, task) {
    return __awaiter(this, void 0, void 0, function* () {
        const tenantId = getTenantIDFromAppID(appId);
        return newContext({
            tenantId,
            appId,
        }, task);
    });
}
exports.doInContext = doInContext;
function doInTenant(tenantId, task) {
    return __awaiter(this, void 0, void 0, function* () {
        // make sure default always selected in single tenancy
        if (!environment_1.default.MULTI_TENANCY) {
            tenantId = tenantId || constants_1.DEFAULT_TENANT_ID;
        }
        const updates = tenantId ? { tenantId } : {};
        return newContext(updates, task);
    });
}
exports.doInTenant = doInTenant;
function doInAppContext(appId, task) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!appId) {
            throw new Error("appId is required");
        }
        const tenantId = getTenantIDFromAppID(appId);
        const updates = { appId };
        if (tenantId) {
            updates.tenantId = tenantId;
        }
        return newContext(updates, task);
    });
}
exports.doInAppContext = doInAppContext;
function doInIdentityContext(identity, task) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!identity) {
            throw new Error("identity is required");
        }
        const context = {
            identity,
        };
        if (identity.tenantId) {
            context.tenantId = identity.tenantId;
        }
        return newContext(context, task);
    });
}
exports.doInIdentityContext = doInIdentityContext;
function getIdentity() {
    try {
        const context = Context_1.default.get();
        return context === null || context === void 0 ? void 0 : context.identity;
    }
    catch (e) {
        // do nothing - identity is not in context
    }
}
exports.getIdentity = getIdentity;
function getTenantId() {
    if (!isMultiTenant()) {
        return constants_1.DEFAULT_TENANT_ID;
    }
    const context = Context_1.default.get();
    const tenantId = context === null || context === void 0 ? void 0 : context.tenantId;
    if (!tenantId) {
        throw new Error("Tenant id not found");
    }
    return tenantId;
}
exports.getTenantId = getTenantId;
function getAppId() {
    const context = Context_1.default.get();
    const foundId = context === null || context === void 0 ? void 0 : context.appId;
    if (!foundId && environment_1.default.isTest() && TEST_APP_ID) {
        return TEST_APP_ID;
    }
    else {
        return foundId;
    }
}
exports.getAppId = getAppId;
function updateTenantId(tenantId) {
    let context = updateContext({
        tenantId,
    });
    Context_1.default.set(context);
}
exports.updateTenantId = updateTenantId;
function updateAppId(appId) {
    let context = updateContext({
        appId,
    });
    try {
        Context_1.default.set(context);
    }
    catch (err) {
        if (environment_1.default.isTest()) {
            TEST_APP_ID = appId;
        }
        else {
            throw err;
        }
    }
}
exports.updateAppId = updateAppId;
function getGlobalDB() {
    const context = Context_1.default.get();
    if (!context || (environment_1.default.MULTI_TENANCY && !context.tenantId)) {
        throw new Error("Global DB not found");
    }
    return (0, db_1.getDB)(baseGlobalDBName(context === null || context === void 0 ? void 0 : context.tenantId));
}
exports.getGlobalDB = getGlobalDB;
/**
 * Gets the app database based on whatever the request
 * contained, dev or prod.
 */
function getAppDB(opts) {
    const appId = getAppId();
    return (0, db_1.getDB)(appId, opts);
}
exports.getAppDB = getAppDB;
/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will get the prod one.
 */
function getProdAppDB(opts) {
    const appId = getAppId();
    if (!appId) {
        throw new Error("Unable to retrieve prod DB - no app ID.");
    }
    return (0, db_1.getDB)((0, conversions_1.getProdAppID)(appId), opts);
}
exports.getProdAppDB = getProdAppDB;
/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will get the dev one.
 */
function getDevAppDB(opts) {
    const appId = getAppId();
    if (!appId) {
        throw new Error("Unable to retrieve dev DB - no app ID.");
    }
    return (0, db_1.getDB)((0, conversions_1.getDevelopmentAppID)(appId), opts);
}
exports.getDevAppDB = getDevAppDB;
//# sourceMappingURL=mainContext.js.map