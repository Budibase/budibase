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
const { StaticDatabases, doWithDB } = require("@budibase/backend-core/db");
const { getTenantId } = require("@budibase/backend-core/tenancy");
const { deleteTenant } = require("@budibase/backend-core/deprovision");
exports.exists = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantId = ctx.request.params;
    ctx.body = {
        exists: yield doWithDB(StaticDatabases.PLATFORM_INFO.name, (db) => __awaiter(void 0, void 0, void 0, function* () {
            let exists = false;
            try {
                const tenantsDoc = yield db.get(StaticDatabases.PLATFORM_INFO.docs.tenants);
                if (tenantsDoc) {
                    exists = tenantsDoc.tenantIds.indexOf(tenantId) !== -1;
                }
            }
            catch (err) {
                // if error it doesn't exist
            }
            return exists;
        })),
    };
});
exports.fetch = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield doWithDB(StaticDatabases.PLATFORM_INFO.name, (db) => __awaiter(void 0, void 0, void 0, function* () {
        let tenants = [];
        try {
            const tenantsDoc = yield db.get(StaticDatabases.PLATFORM_INFO.docs.tenants);
            if (tenantsDoc) {
                tenants = tenantsDoc.tenantIds;
            }
        }
        catch (err) {
            // if error it doesn't exist
        }
        return tenants;
    }));
});
exports.delete = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantId = getTenantId();
    if (ctx.params.tenantId !== tenantId) {
        ctx.throw(403, "Unauthorized");
    }
    try {
        yield deleteTenant(tenantId);
        ctx.status = 204;
    }
    catch (err) {
        ctx.log.error(err);
        throw err;
    }
});
