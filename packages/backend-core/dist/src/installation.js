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
exports.checkInstallVersion = exports.getInstall = void 0;
const hashing = __importStar(require("./hashing"));
const events = __importStar(require("./events"));
const constants_1 = require("./db/constants");
const db_1 = require("./db");
const types_1 = require("@budibase/types");
const context = __importStar(require("./context"));
const semver_1 = __importDefault(require("semver"));
const generic_1 = require("./cache/generic");
const pkg = require("../package.json");
const getInstall = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, generic_1.withCache)(generic_1.CacheKeys.INSTALLATION, generic_1.TTL.ONE_DAY, getInstallFromDB, {
        useTenancy: false,
    });
});
exports.getInstall = getInstall;
const getInstallFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, db_1.doWithDB)(constants_1.StaticDatabases.PLATFORM_INFO.name, (platformDb) => __awaiter(void 0, void 0, void 0, function* () {
        let install;
        try {
            install = yield platformDb.get(constants_1.StaticDatabases.PLATFORM_INFO.docs.install);
        }
        catch (e) {
            if (e.status === 404) {
                install = {
                    _id: constants_1.StaticDatabases.PLATFORM_INFO.docs.install,
                    installId: hashing.newid(),
                    version: pkg.version,
                };
                const resp = yield platformDb.put(install);
                install._rev = resp.rev;
            }
            else {
                throw e;
            }
        }
        return install;
    }));
});
const updateVersion = (version) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.doWithDB)(constants_1.StaticDatabases.PLATFORM_INFO.name, (platformDb) => __awaiter(void 0, void 0, void 0, function* () {
            const install = yield (0, exports.getInstall)();
            install.version = version;
            yield platformDb.put(install);
            yield (0, generic_1.bustCache)(generic_1.CacheKeys.INSTALLATION);
        }));
    }
    catch (e) {
        if (e.status === 409) {
            // do nothing - version has already been updated
            // likely in clustered environment
            return false;
        }
        throw e;
    }
    return true;
});
const checkInstallVersion = () => __awaiter(void 0, void 0, void 0, function* () {
    const install = yield (0, exports.getInstall)();
    const currentVersion = install.version;
    const newVersion = pkg.version;
    if (currentVersion !== newVersion) {
        const isUpgrade = semver_1.default.gt(newVersion, currentVersion);
        const isDowngrade = semver_1.default.lt(newVersion, currentVersion);
        const success = yield updateVersion(newVersion);
        if (success) {
            yield context.doInIdentityContext({
                _id: install.installId,
                type: types_1.IdentityType.INSTALLATION,
            }, () => __awaiter(void 0, void 0, void 0, function* () {
                if (isUpgrade) {
                    yield events.installation.upgraded(currentVersion, newVersion);
                }
                else if (isDowngrade) {
                    yield events.installation.downgraded(currentVersion, newVersion);
                }
            }));
            yield events.identification.identifyInstallationGroup(install.installId);
        }
    }
});
exports.checkInstallVersion = checkInstallVersion;
//# sourceMappingURL=installation.js.map