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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.getScopedConfig = exports.pagination = exports.getPlatformUrl = exports.getScopedFullConfig = exports.generateDevInfoID = exports.getConfigParams = exports.generateConfigID = exports.dbExists = exports.getDevAppIDs = exports.getProdAppIDs = exports.getAllApps = exports.getAllDbs = exports.getStartEndKeyURL = exports.getRoleParams = exports.generateRoleID = exports.getTemplateParams = exports.generateAppUserID = exports.generateTemplateID = exports.getUsersByAppParams = exports.getGlobalUserParams = exports.generateGlobalUserID = exports.getWorkspaceParams = exports.generateWorkspaceID = exports.getQueryIndex = exports.getDocParams = exports.generateAppID = exports.Replication = void 0;
const hashing_1 = require("../hashing");
const constants_1 = require("../constants");
const environment_1 = __importDefault(require("../environment"));
const constants_2 = require("./constants");
const tenancy_1 = require("../tenancy");
const node_fetch_1 = __importDefault(require("node-fetch"));
const index_1 = require("./index");
const pouch_1 = require("./pouch");
const appMetadata_1 = require("../cache/appMetadata");
const helpers_1 = require("../helpers");
const conversions_1 = require("./conversions");
const constants_3 = require("./constants");
const events = __importStar(require("../events"));
__exportStar(require("./constants"), exports);
__exportStar(require("./conversions"), exports);
var Replication_1 = require("./Replication");
Object.defineProperty(exports, "Replication", { enumerable: true, get: function () { return __importDefault(Replication_1).default; } });
/**
 * Generates a new app ID.
 * @returns {string} The new app ID which the app doc can be stored under.
 */
const generateAppID = (tenantId = null) => {
    let id = constants_3.APP_PREFIX;
    if (tenantId) {
        id += `${tenantId}${constants_2.SEPARATOR}`;
    }
    return `${id}${(0, hashing_1.newid)()}`;
};
exports.generateAppID = generateAppID;
/**
 * If creating DB allDocs/query params with only a single top level ID this can be used, this
 * is usually the case as most of our docs are top level e.g. tables, automations, users and so on.
 * More complex cases such as link docs and rows which have multiple levels of IDs that their
 * ID consists of need their own functions to build the allDocs parameters.
 * @param {string} docType The type of document which input params are being built for, e.g. user,
 * link, app, table and so on.
 * @param {string|null} docId The ID of the document minus its type - this is only needed if looking
 * for a singular document.
 * @param {object} otherProps Add any other properties onto the request, e.g. include_docs.
 * @returns {object} Parameters which can then be used with an allDocs request.
 */
function getDocParams(docType, docId = null, otherProps = {}) {
    if (docId == null) {
        docId = "";
    }
    return Object.assign(Object.assign({}, otherProps), { startkey: `${docType}${constants_2.SEPARATOR}${docId}`, endkey: `${docType}${constants_2.SEPARATOR}${docId}${constants_2.UNICODE_MAX}` });
}
exports.getDocParams = getDocParams;
/**
 * Retrieve the correct index for a view based on default design DB.
 */
function getQueryIndex(viewName) {
    return `database/${viewName}`;
}
exports.getQueryIndex = getQueryIndex;
/**
 * Generates a new workspace ID.
 * @returns {string} The new workspace ID which the workspace doc can be stored under.
 */
function generateWorkspaceID() {
    return `${constants_2.DocumentTypes.WORKSPACE}${constants_2.SEPARATOR}${(0, hashing_1.newid)()}`;
}
exports.generateWorkspaceID = generateWorkspaceID;
/**
 * Gets parameters for retrieving workspaces.
 */
function getWorkspaceParams(id = "", otherProps = {}) {
    return Object.assign(Object.assign({}, otherProps), { startkey: `${constants_2.DocumentTypes.WORKSPACE}${constants_2.SEPARATOR}${id}`, endkey: `${constants_2.DocumentTypes.WORKSPACE}${constants_2.SEPARATOR}${id}${constants_2.UNICODE_MAX}` });
}
exports.getWorkspaceParams = getWorkspaceParams;
/**
 * Generates a new global user ID.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
function generateGlobalUserID(id) {
    return `${constants_2.DocumentTypes.USER}${constants_2.SEPARATOR}${id || (0, hashing_1.newid)()}`;
}
exports.generateGlobalUserID = generateGlobalUserID;
/**
 * Gets parameters for retrieving users.
 */
function getGlobalUserParams(globalId, otherProps = {}) {
    if (!globalId) {
        globalId = "";
    }
    const startkey = otherProps === null || otherProps === void 0 ? void 0 : otherProps.startkey;
    return Object.assign(Object.assign({}, otherProps), { 
        // need to include this incase pagination
        startkey: startkey
            ? startkey
            : `${constants_2.DocumentTypes.USER}${constants_2.SEPARATOR}${globalId}`, endkey: `${constants_2.DocumentTypes.USER}${constants_2.SEPARATOR}${globalId}${constants_2.UNICODE_MAX}` });
}
exports.getGlobalUserParams = getGlobalUserParams;
function getUsersByAppParams(appId, otherProps = {}) {
    const prodAppId = (0, conversions_1.getProdAppID)(appId);
    return Object.assign(Object.assign({}, otherProps), { startkey: prodAppId, endkey: `${prodAppId}${constants_2.UNICODE_MAX}` });
}
exports.getUsersByAppParams = getUsersByAppParams;
/**
 * Generates a template ID.
 * @param ownerId The owner/user of the template, this could be global or a workspace level.
 */
function generateTemplateID(ownerId) {
    return `${constants_2.DocumentTypes.TEMPLATE}${constants_2.SEPARATOR}${ownerId}${constants_2.SEPARATOR}${(0, hashing_1.newid)()}`;
}
exports.generateTemplateID = generateTemplateID;
function generateAppUserID(prodAppId, userId) {
    return `${prodAppId}${constants_2.SEPARATOR}${userId}`;
}
exports.generateAppUserID = generateAppUserID;
/**
 * Gets parameters for retrieving templates. Owner ID must be specified, either global or a workspace level.
 */
function getTemplateParams(ownerId, templateId, otherProps = {}) {
    if (!templateId) {
        templateId = "";
    }
    let final;
    if (templateId) {
        final = templateId;
    }
    else {
        final = `${constants_2.DocumentTypes.TEMPLATE}${constants_2.SEPARATOR}${ownerId}${constants_2.SEPARATOR}`;
    }
    return Object.assign(Object.assign({}, otherProps), { startkey: final, endkey: `${final}${constants_2.UNICODE_MAX}` });
}
exports.getTemplateParams = getTemplateParams;
/**
 * Generates a new role ID.
 * @returns {string} The new role ID which the role doc can be stored under.
 */
function generateRoleID(id) {
    return `${constants_2.DocumentTypes.ROLE}${constants_2.SEPARATOR}${id || (0, hashing_1.newid)()}`;
}
exports.generateRoleID = generateRoleID;
/**
 * Gets parameters for retrieving a role, this is a utility function for the getDocParams function.
 */
function getRoleParams(roleId = null, otherProps = {}) {
    return getDocParams(constants_2.DocumentTypes.ROLE, roleId, otherProps);
}
exports.getRoleParams = getRoleParams;
function getStartEndKeyURL(base, baseKey, tenantId = null) {
    const tenancy = tenantId ? `${constants_2.SEPARATOR}${tenantId}` : "";
    return `${base}?startkey="${baseKey}${tenancy}"&endkey="${baseKey}${tenancy}${constants_2.UNICODE_MAX}"`;
}
exports.getStartEndKeyURL = getStartEndKeyURL;
/**
 * if in production this will use the CouchDB _all_dbs call to retrieve a list of databases. If testing
 * when using Pouch it will use the pouchdb-all-dbs package.
 * opts.efficient can be provided to make sure this call is always quick in a multi-tenant environment,
 * but it may not be 100% accurate in full efficiency mode (some tenantless apps may be missed).
 */
function getAllDbs(opts = { efficient: false }) {
    return __awaiter(this, void 0, void 0, function* () {
        const efficient = opts && opts.efficient;
        // specifically for testing we use the pouch package for this
        if (environment_1.default.isTest()) {
            return (0, index_1.allDbs)();
        }
        let dbs = [];
        let { url, cookie } = (0, pouch_1.getCouchInfo)();
        function addDbs(couchUrl) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, node_fetch_1.default)((0, helpers_1.checkSlashesInUrl)(encodeURI(couchUrl)), {
                    method: "GET",
                    headers: {
                        Authorization: cookie,
                    },
                });
                if (response.status === 200) {
                    let json = yield response.json();
                    dbs = dbs.concat(json);
                }
                else {
                    throw "Cannot connect to CouchDB instance";
                }
            });
        }
        let couchUrl = `${url}/_all_dbs`;
        let tenantId = (0, tenancy_1.getTenantId)();
        if (!environment_1.default.MULTI_TENANCY || (!efficient && tenantId === constants_1.DEFAULT_TENANT_ID)) {
            // just get all DBs when:
            // - single tenancy
            // - default tenant
            //    - apps dbs don't contain tenant id
            //    - non-default tenant dbs are filtered out application side in getAllApps
            yield addDbs(couchUrl);
        }
        else {
            // get prod apps
            yield addDbs(getStartEndKeyURL(couchUrl, constants_2.DocumentTypes.APP, tenantId));
            // get dev apps
            yield addDbs(getStartEndKeyURL(couchUrl, constants_2.DocumentTypes.APP_DEV, tenantId));
            // add global db name
            dbs.push((0, tenancy_1.getGlobalDBName)(tenantId));
        }
        return dbs;
    });
}
exports.getAllDbs = getAllDbs;
/**
 * Lots of different points in the system need to find the full list of apps, this will
 * enumerate the entire CouchDB cluster and get the list of databases (every app).
 *
 * @return {Promise<object[]>} returns the app information document stored in each app database.
 */
function getAllApps({ dev, all, idsOnly, efficient } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let tenantId = (0, tenancy_1.getTenantId)();
        if (!environment_1.default.MULTI_TENANCY && !tenantId) {
            tenantId = constants_1.DEFAULT_TENANT_ID;
        }
        let dbs = yield getAllDbs({ efficient });
        const appDbNames = dbs.filter((dbName) => {
            const split = dbName.split(constants_2.SEPARATOR);
            // it is an app, check the tenantId
            if (split[0] === constants_2.DocumentTypes.APP) {
                // tenantId is always right before the UUID
                const possibleTenantId = split[split.length - 2];
                const noTenantId = split.length === 2 || possibleTenantId === constants_2.DocumentTypes.DEV;
                return ((tenantId === constants_1.DEFAULT_TENANT_ID && noTenantId) ||
                    possibleTenantId === tenantId);
            }
            return false;
        });
        if (idsOnly) {
            return appDbNames;
        }
        const appPromises = appDbNames.map((app) => 
        // skip setup otherwise databases could be re-created
        (0, appMetadata_1.getAppMetadata)(app));
        if (appPromises.length === 0) {
            return [];
        }
        else {
            const response = yield Promise.allSettled(appPromises);
            const apps = response
                .filter((result) => result.status === "fulfilled" && result.value != null)
                .map(({ value }) => value);
            if (!all) {
                return apps.filter((app) => {
                    if (dev) {
                        return (0, conversions_1.isDevApp)(app);
                    }
                    return !(0, conversions_1.isDevApp)(app);
                });
            }
            else {
                return apps.map((app) => (Object.assign(Object.assign({}, app), { status: (0, conversions_1.isDevApp)(app) ? "development" : "published" })));
            }
        }
    });
}
exports.getAllApps = getAllApps;
/**
 * Utility function for getAllApps but filters to production apps only.
 */
function getProdAppIDs() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getAllApps({ idsOnly: true })).filter((id) => !(0, conversions_1.isDevAppID)(id));
    });
}
exports.getProdAppIDs = getProdAppIDs;
/**
 * Utility function for the inverse of above.
 */
function getDevAppIDs() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getAllApps({ idsOnly: true })).filter((id) => (0, conversions_1.isDevAppID)(id));
    });
}
exports.getDevAppIDs = getDevAppIDs;
function dbExists(dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        let exists = false;
        return (0, index_1.doWithDB)(dbName, (db) => __awaiter(this, void 0, void 0, function* () {
            try {
                // check if database exists
                const info = yield db.info();
                if (info && !info.error) {
                    exists = true;
                }
            }
            catch (err) {
                exists = false;
            }
            return exists;
        }), { skip_setup: true });
    });
}
exports.dbExists = dbExists;
/**
 * Generates a new configuration ID.
 * @returns {string} The new configuration ID which the config doc can be stored under.
 */
const generateConfigID = ({ type, workspace, user }) => {
    const scope = [type, workspace, user].filter(Boolean).join(constants_2.SEPARATOR);
    return `${constants_2.DocumentTypes.CONFIG}${constants_2.SEPARATOR}${scope}`;
};
exports.generateConfigID = generateConfigID;
/**
 * Gets parameters for retrieving configurations.
 */
const getConfigParams = ({ type, workspace, user }, otherProps = {}) => {
    const scope = [type, workspace, user].filter(Boolean).join(constants_2.SEPARATOR);
    return Object.assign(Object.assign({}, otherProps), { startkey: `${constants_2.DocumentTypes.CONFIG}${constants_2.SEPARATOR}${scope}`, endkey: `${constants_2.DocumentTypes.CONFIG}${constants_2.SEPARATOR}${scope}${constants_2.UNICODE_MAX}` });
};
exports.getConfigParams = getConfigParams;
/**
 * Generates a new dev info document ID - this is scoped to a user.
 * @returns {string} The new dev info ID which info for dev (like api key) can be stored under.
 */
const generateDevInfoID = (userId) => {
    return `${constants_2.DocumentTypes.DEV_INFO}${constants_2.SEPARATOR}${userId}`;
};
exports.generateDevInfoID = generateDevInfoID;
/**
 * Returns the most granular configuration document from the DB based on the type, workspace and userID passed.
 * @param {Object} db - db instance to query
 * @param {Object} scopes - the type, workspace and userID scopes of the configuration.
 * @returns The most granular configuration document based on the scope.
 */
const getScopedFullConfig = function (db, { type, user, workspace }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield db.allDocs((0, exports.getConfigParams)({ type, user, workspace }, {
            include_docs: true,
        }));
        function determineScore(row) {
            const config = row.doc;
            // Config is specific to a user and a workspace
            if (config._id.includes((0, exports.generateConfigID)({ type, user, workspace }))) {
                return 4;
            }
            else if (config._id.includes((0, exports.generateConfigID)({ type, user }))) {
                // Config is specific to a user only
                return 3;
            }
            else if (config._id.includes((0, exports.generateConfigID)({ type, workspace }))) {
                // Config is specific to a workspace only
                return 2;
            }
            else if (config._id.includes((0, exports.generateConfigID)({ type }))) {
                // Config is specific to a type only
                return 1;
            }
            return 0;
        }
        // Find the config with the most granular scope based on context
        let scopedConfig = response.rows.sort((a, b) => determineScore(a) - determineScore(b))[0];
        // custom logic for settings doc
        if (type === constants_1.Configs.SETTINGS) {
            if (scopedConfig && scopedConfig.doc) {
                // overrides affected by environment variables
                scopedConfig.doc.config.platformUrl = yield (0, exports.getPlatformUrl)({
                    tenantAware: true,
                });
                scopedConfig.doc.config.analyticsEnabled =
                    yield events.analytics.enabled();
            }
            else {
                // defaults
                scopedConfig = {
                    doc: {
                        _id: (0, exports.generateConfigID)({ type, user, workspace }),
                        config: {
                            platformUrl: yield (0, exports.getPlatformUrl)({ tenantAware: true }),
                            analyticsEnabled: yield events.analytics.enabled(),
                        },
                    },
                };
            }
        }
        return scopedConfig && scopedConfig.doc;
    });
};
exports.getScopedFullConfig = getScopedFullConfig;
const getPlatformUrl = (opts = { tenantAware: true }) => __awaiter(void 0, void 0, void 0, function* () {
    let platformUrl = environment_1.default.PLATFORM_URL || "http://localhost:10000";
    if (!environment_1.default.SELF_HOSTED && environment_1.default.MULTI_TENANCY && opts.tenantAware) {
        // cloud and multi tenant - add the tenant to the default platform url
        const tenantId = (0, tenancy_1.getTenantId)();
        if (!platformUrl.includes("localhost:")) {
            platformUrl = platformUrl.replace("://", `://${tenantId}.`);
        }
    }
    else if (environment_1.default.SELF_HOSTED) {
        const db = (0, tenancy_1.getGlobalDB)();
        // get the doc directly instead of with getScopedConfig to prevent loop
        let settings;
        try {
            settings = yield db.get((0, exports.generateConfigID)({ type: constants_1.Configs.SETTINGS }));
        }
        catch (e) {
            if (e.status !== 404) {
                throw e;
            }
        }
        // self hosted - check for platform url override
        if (settings && settings.config && settings.config.platformUrl) {
            platformUrl = settings.config.platformUrl;
        }
    }
    return platformUrl;
});
exports.getPlatformUrl = getPlatformUrl;
function pagination(data, pageSize, { paginate, property, getKey, } = {
    paginate: true,
    property: "_id",
}) {
    if (!paginate) {
        return { data, hasNextPage: false };
    }
    const hasNextPage = data.length > pageSize;
    let nextPage = undefined;
    if (!getKey) {
        getKey = (doc) => (property ? doc === null || doc === void 0 ? void 0 : doc[property] : doc === null || doc === void 0 ? void 0 : doc._id);
    }
    if (hasNextPage) {
        nextPage = getKey(data[pageSize]);
    }
    return {
        data: data.slice(0, pageSize),
        hasNextPage,
        nextPage,
    };
}
exports.pagination = pagination;
function getScopedConfig(db, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const configDoc = yield (0, exports.getScopedFullConfig)(db, params);
        return configDoc && configDoc.config ? configDoc.config : configDoc;
    });
}
exports.getScopedConfig = getScopedConfig;
//# sourceMappingURL=utils.js.map