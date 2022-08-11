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
exports.getContextDB = exports.closeAppDBs = exports.setIdentity = exports.setAppTenantId = exports.closeWithUsing = exports.updateUsing = void 0;
const index_1 = require("./index");
const FunctionContext_1 = __importDefault(require("./FunctionContext"));
const constants_1 = require("./constants");
const db_1 = require("../db");
const lodash_1 = require("lodash");
const conversions_1 = require("../db/conversions");
const environment_1 = __importDefault(require("../environment"));
function updateUsing(usingKey, existing, internal) {
    return __awaiter(this, void 0, void 0, function* () {
        const using = FunctionContext_1.default.getFromContext(usingKey);
        if (using && existing) {
            FunctionContext_1.default.setOnContext(usingKey, using + 1);
            return internal({ existing: true });
        }
        else {
            return FunctionContext_1.default.run(() => __awaiter(this, void 0, void 0, function* () {
                FunctionContext_1.default.setOnContext(usingKey, 1);
                return internal({ existing: false });
            }));
        }
    });
}
exports.updateUsing = updateUsing;
function closeWithUsing(usingKey, closeFn) {
    return __awaiter(this, void 0, void 0, function* () {
        const using = FunctionContext_1.default.getFromContext(usingKey);
        if (!using || using <= 1) {
            yield closeFn();
        }
        else {
            FunctionContext_1.default.setOnContext(usingKey, using - 1);
        }
    });
}
exports.closeWithUsing = closeWithUsing;
const setAppTenantId = (appId) => {
    const appTenantId = (0, index_1.getTenantIDFromAppID)(appId) || index_1.DEFAULT_TENANT_ID;
    (0, index_1.updateTenantId)(appTenantId);
};
exports.setAppTenantId = setAppTenantId;
const setIdentity = (identity) => {
    FunctionContext_1.default.setOnContext(constants_1.ContextKeys.IDENTITY, identity);
};
exports.setIdentity = setIdentity;
// this function makes sure the PouchDB objects are closed and
// fully deleted when finished - this protects against memory leaks
function closeAppDBs() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbKeys = [
            constants_1.ContextKeys.CURRENT_DB,
            constants_1.ContextKeys.PROD_DB,
            constants_1.ContextKeys.DEV_DB,
        ];
        for (let dbKey of dbKeys) {
            const db = FunctionContext_1.default.getFromContext(dbKey);
            if (!db) {
                continue;
            }
            yield (0, db_1.closeDB)(db);
            // clear the DB from context, incase someone tries to use it again
            FunctionContext_1.default.setOnContext(dbKey, null);
        }
        // clear the app ID now that the databases are closed
        if (FunctionContext_1.default.getFromContext(constants_1.ContextKeys.APP_ID)) {
            FunctionContext_1.default.setOnContext(constants_1.ContextKeys.APP_ID, null);
        }
        if (FunctionContext_1.default.getFromContext(constants_1.ContextKeys.DB_OPTS)) {
            FunctionContext_1.default.setOnContext(constants_1.ContextKeys.DB_OPTS, null);
        }
    });
}
exports.closeAppDBs = closeAppDBs;
function getContextDB(key, opts) {
    const dbOptsKey = `${key}${constants_1.ContextKeys.DB_OPTS}`;
    let storedOpts = FunctionContext_1.default.getFromContext(dbOptsKey);
    let db = FunctionContext_1.default.getFromContext(key);
    if (db && (0, lodash_1.isEqual)(opts, storedOpts)) {
        return db;
    }
    const appId = (0, index_1.getAppId)();
    let toUseAppId;
    switch (key) {
        case constants_1.ContextKeys.CURRENT_DB:
            toUseAppId = appId;
            break;
        case constants_1.ContextKeys.PROD_DB:
            toUseAppId = (0, conversions_1.getProdAppID)(appId);
            break;
        case constants_1.ContextKeys.DEV_DB:
            toUseAppId = (0, conversions_1.getDevelopmentAppID)(appId);
            break;
    }
    db = (0, db_1.dangerousGetDB)(toUseAppId, opts);
    try {
        FunctionContext_1.default.setOnContext(key, db);
        if (opts) {
            FunctionContext_1.default.setOnContext(dbOptsKey, opts);
        }
    }
    catch (err) {
        if (!environment_1.default.isTest()) {
            throw err;
        }
    }
    return db;
}
exports.getContextDB = getContextDB;
//# sourceMappingURL=utils.js.map