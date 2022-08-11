"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.runMigrations = exports.runMigration = exports.backPopulateMigrations = exports.getMigrationsDoc = void 0;
const constants_1 = require("../constants");
const db_1 = require("../db");
const constants_2 = require("../db/constants");
const utils_1 = require("../db/utils");
const environment_1 = __importDefault(require("../environment"));
const tenancy_1 = require("../tenancy");
const context = __importStar(require("../context"));
const _1 = require(".");
const types_1 = require("@budibase/types");
const getMigrationsDoc = (db) => __awaiter(void 0, void 0, void 0, function* () {
    // get the migrations doc
    try {
        return yield db.get(constants_2.DocumentTypes.MIGRATIONS);
    }
    catch (err) {
        if (err.status && err.status === 404) {
            return { _id: constants_2.DocumentTypes.MIGRATIONS };
        }
        else {
            console.error(err);
            throw err;
        }
    }
});
exports.getMigrationsDoc = getMigrationsDoc;
const backPopulateMigrations = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    // filter migrations to the type and populate a no-op migration
    const migrations = _1.DEFINITIONS.filter(def => def.type === opts.type).map(d => (Object.assign(Object.assign({}, d), { fn: () => { } })));
    yield (0, exports.runMigrations)(migrations, { noOp: opts });
});
exports.backPopulateMigrations = backPopulateMigrations;
const runMigration = (migration, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const migrationType = migration.type;
    let tenantId;
    if (migrationType !== types_1.MigrationType.INSTALLATION) {
        tenantId = (0, tenancy_1.getTenantId)();
    }
    const migrationName = migration.name;
    const silent = migration.silent;
    const log = (message) => {
        if (!silent) {
            console.log(message);
        }
    };
    // get the db to store the migration in
    let dbNames;
    if (migrationType === types_1.MigrationType.GLOBAL) {
        dbNames = [(0, tenancy_1.getGlobalDBName)()];
    }
    else if (migrationType === types_1.MigrationType.APP) {
        if (options.noOp) {
            dbNames = [options.noOp.appId];
        }
        else {
            const apps = yield (0, utils_1.getAllApps)(migration.appOpts);
            dbNames = apps.map(app => app.appId);
        }
    }
    else if (migrationType === types_1.MigrationType.INSTALLATION) {
        dbNames = [constants_2.StaticDatabases.PLATFORM_INFO.name];
    }
    else {
        throw new Error(`Unrecognised migration type [${migrationType}]`);
    }
    const length = dbNames.length;
    let count = 0;
    // run the migration against each db
    for (const dbName of dbNames) {
        count++;
        const lengthStatement = length > 1 ? `[${count}/${length}]` : "";
        yield (0, db_1.doWithDB)(dbName, (db) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const doc = yield exports.getMigrationsDoc(db);
                // the migration has already been run
                if (doc[migrationName]) {
                    // check for force
                    if (options.force &&
                        options.force[migrationType] &&
                        options.force[migrationType].includes(migrationName)) {
                        log(`[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Forcing`);
                    }
                    else {
                        // no force, exit
                        return;
                    }
                }
                // check if the migration is not a no-op
                if (!options.noOp) {
                    log(`[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Running ${lengthStatement}`);
                    if (migration.preventRetry) {
                        // eagerly set the completion date
                        // so that we never run this migration twice even upon failure
                        doc[migrationName] = Date.now();
                        const response = yield db.put(doc);
                        doc._rev = response.rev;
                    }
                    // run the migration
                    if (migrationType === types_1.MigrationType.APP) {
                        yield context.doInAppContext(db.name, () => __awaiter(void 0, void 0, void 0, function* () {
                            yield migration.fn(db);
                        }));
                    }
                    else {
                        yield migration.fn(db);
                    }
                    log(`[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Complete`);
                }
                // mark as complete
                doc[migrationName] = Date.now();
                yield db.put(doc);
            }
            catch (err) {
                console.error(`[Tenant: ${tenantId}] [Migration: ${migrationName}] [DB: ${dbName}] Error: `, err);
                throw err;
            }
        }));
    }
});
exports.runMigration = runMigration;
const runMigrations = (migrations, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    let tenantIds;
    if (environment_1.default.MULTI_TENANCY) {
        if (options.noOp) {
            tenantIds = [options.noOp.tenantId];
        }
        else if (!options.tenantIds || !options.tenantIds.length) {
            // run for all tenants
            tenantIds = yield (0, tenancy_1.getTenantIds)();
        }
        else {
            tenantIds = options.tenantIds;
        }
    }
    else {
        // single tenancy
        tenantIds = [constants_1.DEFAULT_TENANT_ID];
    }
    if (tenantIds.length > 1) {
        console.log(`Checking migrations for ${tenantIds.length} tenants`);
    }
    else {
        console.log("Checking migrations");
    }
    let count = 0;
    // for all tenants
    for (const tenantId of tenantIds) {
        count++;
        if (tenantIds.length > 1) {
            console.log(`Progress [${count}/${tenantIds.length}]`);
        }
        // for all migrations
        for (const migration of migrations) {
            // run the migration
            yield (0, tenancy_1.doInTenant)(tenantId, () => (0, exports.runMigration)(migration, options));
        }
    }
    console.log("Migrations complete");
});
exports.runMigrations = runMigrations;
//# sourceMappingURL=migrations.js.map