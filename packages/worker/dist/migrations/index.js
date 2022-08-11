"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.migrate = exports.MIGRATIONS = exports.buildMigrations = void 0;
const backend_core_1 = require("@budibase/backend-core");
const types_1 = require("@budibase/types");
const environment_1 = __importDefault(require("../environment"));
// migration functions
const syncUserInfo = __importStar(require("./functions/globalInfoSyncUsers"));
/**
 * Populate the migration function and additional configuration from
 * the static migration definitions.
 */
const buildMigrations = () => {
    const definitions = backend_core_1.migrations.DEFINITIONS;
    const workerMigrations = [];
    for (const definition of definitions) {
        switch (definition.name) {
            case types_1.MigrationName.GLOBAL_INFO_SYNC_USERS: {
                // only needed in cloud
                if (!environment_1.default.SELF_HOSTED) {
                    workerMigrations.push(Object.assign(Object.assign({}, definition), { fn: syncUserInfo.run }));
                }
                break;
            }
        }
    }
    return workerMigrations;
};
exports.buildMigrations = buildMigrations;
exports.MIGRATIONS = (0, exports.buildMigrations)();
const migrate = (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (environment_1.default.SELF_HOSTED) {
        yield migrateWithLock(options);
    }
    else {
        yield backend_core_1.migrations.runMigrations(exports.MIGRATIONS, options);
    }
});
exports.migrate = migrate;
const migrateWithLock = (options) => __awaiter(void 0, void 0, void 0, function* () {
    // get a new lock client
    const redlock = yield backend_core_1.redis.clients.getMigrationsRedlock();
    // lock for 15 minutes
    const ttl = 1000 * 60 * 15;
    let migrationLock;
    // acquire lock
    try {
        migrationLock = yield redlock.lock("migrations", ttl);
    }
    catch (e) {
        if (e.name === "LockError") {
            return;
        }
        else {
            throw e;
        }
    }
    // run migrations
    try {
        yield backend_core_1.migrations.runMigrations(exports.MIGRATIONS, options);
    }
    finally {
        // release lock
        try {
            yield migrationLock.unlock();
        }
        catch (e) {
            console.error("unable to release migration lock");
        }
    }
});
