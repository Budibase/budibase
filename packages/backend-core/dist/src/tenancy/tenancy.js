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
exports.getTenantIds = exports.isUserInAppTenant = exports.getTenantUser = exports.lookupTenantId = exports.doWithGlobalDB = exports.getGlobalDBName = exports.tryAddTenant = exports.doesTenantExist = exports.addTenantToUrl = void 0;
const db_1 = require("../db");
const constants_1 = require("../db/constants");
const utils_1 = require("./utils");
const context_1 = require("../context");
const environment_1 = __importDefault(require("../environment"));
const TENANT_DOC = constants_1.StaticDatabases.PLATFORM_INFO.docs.tenants;
const PLATFORM_INFO_DB = constants_1.StaticDatabases.PLATFORM_INFO.name;
const addTenantToUrl = (url) => {
    const tenantId = (0, context_1.getTenantId)();
    if ((0, context_1.isMultiTenant)()) {
        const char = url.indexOf("?") === -1 ? "?" : "&";
        url += `${char}tenantId=${tenantId}`;
    }
    return url;
};
exports.addTenantToUrl = addTenantToUrl;
const doesTenantExist = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, db_1.doWithDB)(PLATFORM_INFO_DB, (db) => __awaiter(void 0, void 0, void 0, function* () {
        let tenants;
        try {
            tenants = yield db.get(TENANT_DOC);
        }
        catch (err) {
            // if theres an error the doc doesn't exist, no tenants exist
            return false;
        }
        return (tenants &&
            Array.isArray(tenants.tenantIds) &&
            tenants.tenantIds.indexOf(tenantId) !== -1);
    }));
});
exports.doesTenantExist = doesTenantExist;
const tryAddTenant = (tenantId, userId, email, afterCreateTenant) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, db_1.doWithDB)(PLATFORM_INFO_DB, (db) => __awaiter(void 0, void 0, void 0, function* () {
        const getDoc = (id) => __awaiter(void 0, void 0, void 0, function* () {
            if (!id) {
                return null;
            }
            try {
                return yield db.get(id);
            }
            catch (err) {
                return { _id: id };
            }
        });
        let [tenants, userIdDoc, emailDoc] = yield Promise.all([
            getDoc(TENANT_DOC),
            getDoc(userId),
            getDoc(email),
        ]);
        if (!Array.isArray(tenants.tenantIds)) {
            tenants = {
                _id: TENANT_DOC,
                tenantIds: [],
            };
        }
        let promises = [];
        if (userIdDoc) {
            userIdDoc.tenantId = tenantId;
            promises.push(db.put(userIdDoc));
        }
        if (emailDoc) {
            emailDoc.tenantId = tenantId;
            emailDoc.userId = userId;
            promises.push(db.put(emailDoc));
        }
        if (tenants.tenantIds.indexOf(tenantId) === -1) {
            tenants.tenantIds.push(tenantId);
            promises.push(db.put(tenants));
            yield afterCreateTenant();
        }
        yield Promise.all(promises);
    }));
});
exports.tryAddTenant = tryAddTenant;
const getGlobalDBName = (tenantId) => {
    // tenant ID can be set externally, for example user API where
    // new tenants are being created, this may be the case
    if (!tenantId) {
        tenantId = (0, context_1.getTenantId)();
    }
    return (0, utils_1.baseGlobalDBName)(tenantId);
};
exports.getGlobalDBName = getGlobalDBName;
const doWithGlobalDB = (tenantId, cb) => {
    return (0, db_1.doWithDB)((0, exports.getGlobalDBName)(tenantId), cb);
};
exports.doWithGlobalDB = doWithGlobalDB;
const lookupTenantId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, db_1.doWithDB)(constants_1.StaticDatabases.PLATFORM_INFO.name, (db) => __awaiter(void 0, void 0, void 0, function* () {
        let tenantId = environment_1.default.MULTI_TENANCY ? context_1.DEFAULT_TENANT_ID : null;
        try {
            const doc = yield db.get(userId);
            if (doc && doc.tenantId) {
                tenantId = doc.tenantId;
            }
        }
        catch (err) {
            // just return the default
        }
        return tenantId;
    }));
});
exports.lookupTenantId = lookupTenantId;
// lookup, could be email or userId, either will return a doc
const getTenantUser = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, db_1.doWithDB)(PLATFORM_INFO_DB, (db) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.get(identifier);
        }
        catch (err) {
            return null;
        }
    }));
});
exports.getTenantUser = getTenantUser;
const isUserInAppTenant = (appId, user) => {
    let userTenantId;
    if (user) {
        userTenantId = user.tenantId || context_1.DEFAULT_TENANT_ID;
    }
    else {
        userTenantId = (0, context_1.getTenantId)();
    }
    const tenantId = (0, context_1.getTenantIDFromAppID)(appId) || context_1.DEFAULT_TENANT_ID;
    return tenantId === userTenantId;
};
exports.isUserInAppTenant = isUserInAppTenant;
const getTenantIds = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, db_1.doWithDB)(PLATFORM_INFO_DB, (db) => __awaiter(void 0, void 0, void 0, function* () {
        let tenants;
        try {
            tenants = yield db.get(TENANT_DOC);
        }
        catch (err) {
            // if theres an error the doc doesn't exist, no tenants exist
            return [];
        }
        return (tenants && tenants.tenantIds) || [];
    }));
});
exports.getTenantIds = getTenantIds;
//# sourceMappingURL=tenancy.js.map