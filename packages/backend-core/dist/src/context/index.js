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
exports.getDevAppDB = exports.getProdAppDB = exports.getAppDB = exports.getAppId = exports.getTenantId = exports.isTenantIdSet = exports.getGlobalDB = exports.setGlobalDB = exports.updateAppId = exports.updateTenantId = exports.getIdentity = exports.doInIdentityContext = exports.doInAppContext = exports.doInTenant = exports.getTenantIDFromAppID = exports.isMultiTenant = exports.closeTenancy = exports.DEFAULT_TENANT_ID = void 0;
const environment_1 = __importDefault(require("../environment"));
const constants_1 = require("../db/constants");
const FunctionContext_1 = __importDefault(require("./FunctionContext"));
const db_1 = require("../db");
const utils_1 = require("../tenancy/utils");
const constants_2 = require("../constants");
const constants_3 = require("./constants");
const utils_2 = require("./utils");
exports.DEFAULT_TENANT_ID = constants_2.DEFAULT_TENANT_ID;
// some test cases call functions directly, need to
// store an app ID to pretend there is a context
let TEST_APP_ID = null;
const closeTenancy = () => __awaiter(void 0, void 0, void 0, function* () {
    let db;
    try {
        if (environment_1.default.USE_COUCH) {
            db = (0, exports.getGlobalDB)();
        }
    }
    catch (err) {
        // no DB found - skip closing
        return;
    }
    yield (0, db_1.closeDB)(db);
    // clear from context now that database is closed/task is finished
    FunctionContext_1.default.setOnContext(constants_3.ContextKeys.TENANT_ID, null);
    FunctionContext_1.default.setOnContext(constants_3.ContextKeys.GLOBAL_DB, null);
});
exports.closeTenancy = closeTenancy;
// export const isDefaultTenant = () => {
//   return getTenantId() === DEFAULT_TENANT_ID
// }
const isMultiTenant = () => {
    return environment_1.default.MULTI_TENANCY;
};
exports.isMultiTenant = isMultiTenant;
/**
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
const getTenantIDFromAppID = (appId) => {
    if (!appId) {
        return null;
    }
    const split = appId.split(constants_1.SEPARATOR);
    const hasDev = split[1] === constants_1.DocumentTypes.DEV;
    if ((hasDev && split.length === 3) || (!hasDev && split.length === 2)) {
        return null;
    }
    if (hasDev) {
        return split[2];
    }
    else {
        return split[1];
    }
};
exports.getTenantIDFromAppID = getTenantIDFromAppID;
// used for automations, API endpoints should always be in context already
const doInTenant = (tenantId, task) => {
    // make sure default always selected in single tenancy
    if (!environment_1.default.MULTI_TENANCY) {
        tenantId = tenantId || exports.DEFAULT_TENANT_ID;
    }
    // the internal function is so that we can re-use an existing
    // context - don't want to close DB on a parent context
    function internal(opts = { existing: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            // set the tenant id + global db if this is a new context
            if (!opts.existing) {
                (0, exports.updateTenantId)(tenantId);
            }
            try {
                // invoke the task
                return yield task();
            }
            finally {
                yield (0, utils_2.closeWithUsing)(constants_3.ContextKeys.TENANCY_IN_USE, () => {
                    return (0, exports.closeTenancy)();
                });
            }
        });
    }
    const existing = FunctionContext_1.default.getFromContext(constants_3.ContextKeys.TENANT_ID) === tenantId;
    return (0, utils_2.updateUsing)(constants_3.ContextKeys.TENANCY_IN_USE, existing, internal);
};
exports.doInTenant = doInTenant;
const doInAppContext = (appId, task) => {
    if (!appId) {
        throw new Error("appId is required");
    }
    const identity = (0, exports.getIdentity)();
    // the internal function is so that we can re-use an existing
    // context - don't want to close DB on a parent context
    function internal(opts = { existing: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            // set the app tenant id
            if (!opts.existing) {
                (0, utils_2.setAppTenantId)(appId);
            }
            // set the app ID
            FunctionContext_1.default.setOnContext(constants_3.ContextKeys.APP_ID, appId);
            // preserve the identity
            if (identity) {
                (0, utils_2.setIdentity)(identity);
            }
            try {
                // invoke the task
                return yield task();
            }
            finally {
                yield (0, utils_2.closeWithUsing)(constants_3.ContextKeys.APP_IN_USE, () => __awaiter(this, void 0, void 0, function* () {
                    yield (0, utils_2.closeAppDBs)();
                    yield (0, exports.closeTenancy)();
                }));
            }
        });
    }
    const existing = FunctionContext_1.default.getFromContext(constants_3.ContextKeys.APP_ID) === appId;
    return (0, utils_2.updateUsing)(constants_3.ContextKeys.APP_IN_USE, existing, internal);
};
exports.doInAppContext = doInAppContext;
const doInIdentityContext = (identity, task) => {
    if (!identity) {
        throw new Error("identity is required");
    }
    function internal(opts = { existing: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!opts.existing) {
                FunctionContext_1.default.setOnContext(constants_3.ContextKeys.IDENTITY, identity);
                // set the tenant so that doInTenant will preserve identity
                if (identity.tenantId) {
                    (0, exports.updateTenantId)(identity.tenantId);
                }
            }
            try {
                // invoke the task
                return yield task();
            }
            finally {
                yield (0, utils_2.closeWithUsing)(constants_3.ContextKeys.IDENTITY_IN_USE, () => __awaiter(this, void 0, void 0, function* () {
                    (0, utils_2.setIdentity)(null);
                    yield (0, exports.closeTenancy)();
                }));
            }
        });
    }
    const existing = FunctionContext_1.default.getFromContext(constants_3.ContextKeys.IDENTITY);
    return (0, utils_2.updateUsing)(constants_3.ContextKeys.IDENTITY_IN_USE, existing, internal);
};
exports.doInIdentityContext = doInIdentityContext;
const getIdentity = () => {
    try {
        return FunctionContext_1.default.getFromContext(constants_3.ContextKeys.IDENTITY);
    }
    catch (e) {
        // do nothing - identity is not in context
    }
};
exports.getIdentity = getIdentity;
const updateTenantId = (tenantId) => {
    FunctionContext_1.default.setOnContext(constants_3.ContextKeys.TENANT_ID, tenantId);
    if (environment_1.default.USE_COUCH) {
        (0, exports.setGlobalDB)(tenantId);
    }
};
exports.updateTenantId = updateTenantId;
const updateAppId = (appId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // have to close first, before removing the databases from context
        yield (0, utils_2.closeAppDBs)();
        FunctionContext_1.default.setOnContext(constants_3.ContextKeys.APP_ID, appId);
    }
    catch (err) {
        if (environment_1.default.isTest()) {
            TEST_APP_ID = appId;
        }
        else {
            throw err;
        }
    }
});
exports.updateAppId = updateAppId;
const setGlobalDB = (tenantId) => {
    const dbName = (0, utils_1.baseGlobalDBName)(tenantId);
    const db = (0, db_1.dangerousGetDB)(dbName);
    FunctionContext_1.default.setOnContext(constants_3.ContextKeys.GLOBAL_DB, db);
    return db;
};
exports.setGlobalDB = setGlobalDB;
const getGlobalDB = () => {
    const db = FunctionContext_1.default.getFromContext(constants_3.ContextKeys.GLOBAL_DB);
    if (!db) {
        throw new Error("Global DB not found");
    }
    return db;
};
exports.getGlobalDB = getGlobalDB;
const isTenantIdSet = () => {
    const tenantId = FunctionContext_1.default.getFromContext(constants_3.ContextKeys.TENANT_ID);
    return !!tenantId;
};
exports.isTenantIdSet = isTenantIdSet;
const getTenantId = () => {
    if (!(0, exports.isMultiTenant)()) {
        return exports.DEFAULT_TENANT_ID;
    }
    const tenantId = FunctionContext_1.default.getFromContext(constants_3.ContextKeys.TENANT_ID);
    if (!tenantId) {
        throw new Error("Tenant id not found");
    }
    return tenantId;
};
exports.getTenantId = getTenantId;
const getAppId = () => {
    const foundId = FunctionContext_1.default.getFromContext(constants_3.ContextKeys.APP_ID);
    if (!foundId && environment_1.default.isTest() && TEST_APP_ID) {
        return TEST_APP_ID;
    }
    else {
        return foundId;
    }
};
exports.getAppId = getAppId;
/**
 * Opens the app database based on whatever the request
 * contained, dev or prod.
 */
const getAppDB = (opts) => {
    return (0, utils_2.getContextDB)(constants_3.ContextKeys.CURRENT_DB, opts);
};
exports.getAppDB = getAppDB;
/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will open the prod one.
 */
const getProdAppDB = (opts) => {
    return (0, utils_2.getContextDB)(constants_3.ContextKeys.PROD_DB, opts);
};
exports.getProdAppDB = getProdAppDB;
/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will open the dev one.
 */
const getDevAppDB = (opts) => {
    return (0, utils_2.getContextDB)(constants_3.ContextKeys.DEV_DB, opts);
};
exports.getDevAppDB = getDevAppDB;
//# sourceMappingURL=index.js.map