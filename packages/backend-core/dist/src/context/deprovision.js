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
const { getGlobalUserParams, getAllApps } = require("../db/utils");
const { doWithDB } = require("../db");
const { doWithGlobalDB } = require("../tenancy");
const { StaticDatabases } = require("../db/constants");
const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants;
const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name;
const removeTenantFromInfoDB = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield doWithDB(PLATFORM_INFO_DB, (infoDb) => __awaiter(void 0, void 0, void 0, function* () {
            let tenants = yield infoDb.get(TENANT_DOC);
            tenants.tenantIds = tenants.tenantIds.filter(id => id !== tenantId);
            yield infoDb.put(tenants);
        }));
    }
    catch (err) {
        console.error(`Error removing tenant ${tenantId} from info db`, err);
        throw err;
    }
});
exports.removeUserFromInfoDB = (dbUser) => __awaiter(void 0, void 0, void 0, function* () {
    yield doWithDB(PLATFORM_INFO_DB, (infoDb) => __awaiter(void 0, void 0, void 0, function* () {
        const keys = [dbUser._id, dbUser.email];
        const userDocs = yield infoDb.allDocs({
            keys,
            include_docs: true,
        });
        const toDelete = userDocs.rows.map(row => {
            return Object.assign(Object.assign({}, row.doc), { _deleted: true });
        });
        yield infoDb.bulkDocs(toDelete);
    }));
});
const removeUsersFromInfoDB = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    return doWithGlobalDB(tenantId, (db) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allUsers = yield db.allDocs(getGlobalUserParams(null, {
                include_docs: true,
            }));
            yield doWithDB(PLATFORM_INFO_DB, (infoDb) => __awaiter(void 0, void 0, void 0, function* () {
                const allEmails = allUsers.rows.map(row => row.doc.email);
                // get the id docs
                let keys = allUsers.rows.map(row => row.id);
                // and the email docs
                keys = keys.concat(allEmails);
                // retrieve the docs and delete them
                const userDocs = yield infoDb.allDocs({
                    keys,
                    include_docs: true,
                });
                const toDelete = userDocs.rows.map(row => {
                    return Object.assign(Object.assign({}, row.doc), { _deleted: true });
                });
                yield infoDb.bulkDocs(toDelete);
            }));
        }
        catch (err) {
            console.error(`Error removing tenant ${tenantId} users from info db`, err);
            throw err;
        }
    }));
});
const removeGlobalDB = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    return doWithGlobalDB(tenantId, (db) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db.destroy();
        }
        catch (err) {
            console.error(`Error removing tenant ${tenantId} users from info db`, err);
            throw err;
        }
    }));
});
const removeTenantApps = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apps = yield getAllApps({ all: true });
        const destroyPromises = apps.map(app => doWithDB(app.appId, db => db.destroy()));
        yield Promise.allSettled(destroyPromises);
    }
    catch (err) {
        console.error(`Error removing tenant ${tenantId} apps`, err);
        throw err;
    }
});
// can't live in tenancy package due to circular dependency on db/utils
exports.deleteTenant = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    yield removeTenantFromInfoDB(tenantId);
    yield removeUsersFromInfoDB(tenantId);
    yield removeGlobalDB(tenantId);
    yield removeTenantApps(tenantId);
});
//# sourceMappingURL=deprovision.js.map