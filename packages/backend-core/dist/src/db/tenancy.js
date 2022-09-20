"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseGlobalDBName = exports.getGlobalDBName = void 0;
const constants_1 = require("../constants");
const constants_2 = require("./constants");
const context_1 = require("../context");
const getGlobalDBName = (tenantId) => {
    // tenant ID can be set externally, for example user API where
    // new tenants are being created, this may be the case
    if (!tenantId) {
        tenantId = (0, context_1.getTenantId)();
    }
    return (0, exports.baseGlobalDBName)(tenantId);
};
exports.getGlobalDBName = getGlobalDBName;
const baseGlobalDBName = (tenantId) => {
    let dbName;
    if (!tenantId || tenantId === constants_1.DEFAULT_TENANT_ID) {
        dbName = constants_2.StaticDatabases.GLOBAL.name;
    }
    else {
        dbName = `${tenantId}${constants_2.SEPARATOR}${constants_2.StaticDatabases.GLOBAL.name}`;
    }
    return dbName;
};
exports.baseGlobalDBName = baseGlobalDBName;
//# sourceMappingURL=tenancy.js.map