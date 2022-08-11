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
exports.getInstallationId = exports.identifyGroup = exports.identify = exports.identifyAccount = exports.identifyUser = exports.identifyTenantGroup = exports.identifyInstallationGroup = exports.getCurrentIdentity = void 0;
const context = __importStar(require("../context"));
const identityCtx = __importStar(require("../context/identity"));
const environment_1 = __importDefault(require("../environment"));
const types_1 = require("@budibase/types");
const processors_1 = require("./processors");
const dbUtils = __importStar(require("../db/utils"));
const constants_1 = require("../constants");
const hashing = __importStar(require("../hashing"));
const installation = __importStar(require("../installation"));
const generic_1 = require("../cache/generic");
const pkg = require("../../package.json");
/**
 * An identity can be:
 * - account user (Self host)
 * - budibase user
 * - tenant
 * - installation
 */
const getCurrentIdentity = () => __awaiter(void 0, void 0, void 0, function* () {
    let identityContext = identityCtx.getIdentity();
    const environment = getDeploymentEnvironment();
    let identityType;
    if (!identityContext) {
        identityType = types_1.IdentityType.TENANT;
    }
    else {
        identityType = identityContext.type;
    }
    if (identityType === types_1.IdentityType.INSTALLATION) {
        const installationId = yield (0, exports.getInstallationId)();
        const hosting = getHostingFromEnv();
        return {
            id: formatDistinctId(installationId, identityType),
            hosting,
            type: identityType,
            installationId,
            environment,
        };
    }
    else if (identityType === types_1.IdentityType.TENANT) {
        const installationId = yield (0, exports.getInstallationId)();
        const tenantId = yield getEventTenantId(context.getTenantId());
        const hosting = getHostingFromEnv();
        return {
            id: formatDistinctId(tenantId, identityType),
            type: identityType,
            hosting,
            installationId,
            tenantId,
            environment,
        };
    }
    else if (identityType === types_1.IdentityType.USER) {
        const userContext = identityContext;
        const tenantId = yield getEventTenantId(context.getTenantId());
        const installationId = yield (0, exports.getInstallationId)();
        const account = userContext.account;
        let hosting;
        if (account) {
            hosting = account.hosting;
        }
        else {
            hosting = getHostingFromEnv();
        }
        return {
            id: userContext._id,
            type: identityType,
            hosting,
            installationId,
            tenantId,
            environment,
        };
    }
    else {
        throw new Error("Unknown identity type");
    }
});
exports.getCurrentIdentity = getCurrentIdentity;
const identifyInstallationGroup = (installId, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    const id = installId;
    const type = types_1.IdentityType.INSTALLATION;
    const hosting = getHostingFromEnv();
    const version = pkg.version;
    const environment = getDeploymentEnvironment();
    const group = {
        id,
        type,
        hosting,
        version,
        environment,
    };
    yield (0, exports.identifyGroup)(group, timestamp);
    // need to create a normal identity for the group to be able to query it globally
    // match the posthog syntax to link this identity to the empty auto generated one
    yield (0, exports.identify)(Object.assign(Object.assign({}, group), { id: `$${type}_${id}` }), timestamp);
});
exports.identifyInstallationGroup = identifyInstallationGroup;
const identifyTenantGroup = (tenantId, account, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield getEventTenantId(tenantId);
    const type = types_1.IdentityType.TENANT;
    const installationId = yield (0, exports.getInstallationId)();
    const environment = getDeploymentEnvironment();
    let hosting;
    let profession;
    let companySize;
    if (account) {
        profession = account.profession;
        companySize = account.size;
        hosting = account.hosting;
    }
    else {
        hosting = getHostingFromEnv();
    }
    const group = {
        id,
        type,
        hosting,
        environment,
        installationId,
        profession,
        companySize,
    };
    yield (0, exports.identifyGroup)(group, timestamp);
    // need to create a normal identity for the group to be able to query it globally
    // match the posthog syntax to link this identity to the auto generated one
    yield (0, exports.identify)(Object.assign(Object.assign({}, group), { id: `$${type}_${id}` }), timestamp);
});
exports.identifyTenantGroup = identifyTenantGroup;
const identifyUser = (user, account, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = user._id;
    const tenantId = yield getEventTenantId(user.tenantId);
    const type = types_1.IdentityType.USER;
    let builder = ((_a = user.builder) === null || _a === void 0 ? void 0 : _a.global) || false;
    let admin = ((_b = user.admin) === null || _b === void 0 ? void 0 : _b.global) || false;
    let providerType = user.providerType;
    const accountHolder = (account === null || account === void 0 ? void 0 : account.budibaseUserId) === user._id || false;
    const verified = account && (account === null || account === void 0 ? void 0 : account.budibaseUserId) === user._id ? account.verified : false;
    const installationId = yield (0, exports.getInstallationId)();
    const hosting = account ? account.hosting : getHostingFromEnv();
    const environment = getDeploymentEnvironment();
    const identity = {
        id,
        type,
        hosting,
        installationId,
        tenantId,
        verified,
        accountHolder,
        providerType,
        builder,
        admin,
        environment,
    };
    yield (0, exports.identify)(identity, timestamp);
});
exports.identifyUser = identifyUser;
const identifyAccount = (account) => __awaiter(void 0, void 0, void 0, function* () {
    let id = account.accountId;
    const tenantId = account.tenantId;
    let type = types_1.IdentityType.USER;
    let providerType = (0, types_1.isSSOAccount)(account) ? account.providerType : undefined;
    const verified = account.verified;
    const accountHolder = true;
    const hosting = account.hosting;
    const installationId = yield (0, exports.getInstallationId)();
    const environment = getDeploymentEnvironment();
    if ((0, types_1.isCloudAccount)(account)) {
        if (account.budibaseUserId) {
            // use the budibase user as the id if set
            id = account.budibaseUserId;
        }
    }
    const identity = {
        id,
        type,
        hosting,
        installationId,
        tenantId,
        providerType,
        verified,
        accountHolder,
        environment,
    };
    yield (0, exports.identify)(identity);
});
exports.identifyAccount = identifyAccount;
const identify = (identity, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    yield processors_1.processors.identify(identity, timestamp);
});
exports.identify = identify;
const identifyGroup = (group, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    yield processors_1.processors.identifyGroup(group, timestamp);
});
exports.identifyGroup = identifyGroup;
const getDeploymentEnvironment = () => {
    if (environment_1.default.isDev()) {
        return "development";
    }
    else {
        return environment_1.default.DEPLOYMENT_ENVIRONMENT;
    }
};
const getHostingFromEnv = () => {
    return environment_1.default.SELF_HOSTED ? types_1.Hosting.SELF : types_1.Hosting.CLOUD;
};
const getInstallationId = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isAccountPortal()) {
        return "account-portal";
    }
    const install = yield installation.getInstall();
    return install.installId;
});
exports.getInstallationId = getInstallationId;
const getEventTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    if (environment_1.default.SELF_HOSTED) {
        return getUniqueTenantId(tenantId);
    }
    else {
        // tenant id's in the cloud are already unique
        return tenantId;
    }
});
const getUniqueTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    // make sure this tenantId always matches the tenantId in context
    return context.doInTenant(tenantId, () => {
        return (0, generic_1.withCache)(generic_1.CacheKeys.UNIQUE_TENANT_ID, generic_1.TTL.ONE_DAY, () => __awaiter(void 0, void 0, void 0, function* () {
            const db = context.getGlobalDB();
            const config = yield dbUtils.getScopedFullConfig(db, {
                type: constants_1.Configs.SETTINGS,
            });
            let uniqueTenantId;
            if (config.config.uniqueTenantId) {
                return config.config.uniqueTenantId;
            }
            else {
                uniqueTenantId = `${hashing.newid()}_${tenantId}`;
                config.config.uniqueTenantId = uniqueTenantId;
                yield db.put(config);
                return uniqueTenantId;
            }
        }));
    });
});
const isAccountPortal = () => {
    return environment_1.default.SERVICE === "account-portal";
};
const formatDistinctId = (id, type) => {
    if (type === types_1.IdentityType.INSTALLATION || type === types_1.IdentityType.TENANT) {
        return `$${type}_${id}`;
    }
    else {
        return id;
    }
};
//# sourceMappingURL=identification.js.map