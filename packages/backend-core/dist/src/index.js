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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const errors_1 = __importDefault(require("./errors"));
const errorClasses = errors_1.default.errors;
const events = __importStar(require("./events"));
const migrations = __importStar(require("./migrations"));
const users = __importStar(require("./users"));
const roles = __importStar(require("./security/roles"));
const accounts = __importStar(require("./cloud/accounts"));
const installation = __importStar(require("./installation"));
const environment_1 = __importDefault(require("./environment"));
const tenancy_1 = __importDefault(require("./tenancy"));
const featureFlags_1 = __importDefault(require("./featureFlags"));
const sessions = __importStar(require("./security/sessions"));
const deprovision_1 = __importDefault(require("./context/deprovision"));
const auth_1 = __importDefault(require("./auth"));
const constants_1 = __importDefault(require("./constants"));
const dbConstants = __importStar(require("./db/constants"));
const logging_1 = __importDefault(require("./logging"));
const pino_1 = __importDefault(require("./pino"));
// mimic the outer package exports
const db = __importStar(require("./pkg/db"));
const objectStore = __importStar(require("./pkg/objectStore"));
const utils = __importStar(require("./pkg/utils"));
const redis_1 = __importDefault(require("./pkg/redis"));
const cache_1 = __importDefault(require("./pkg/cache"));
const context_1 = __importDefault(require("./pkg/context"));
const init = (opts = {}) => {
    db.init(opts.db);
};
const core = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ init,
    db }, dbConstants), { redis: redis_1.default,
    objectStore,
    utils,
    users,
    cache: cache_1.default,
    auth: auth_1.default,
    constants: constants_1.default }), constants_1.default), { migrations,
    env: environment_1.default,
    accounts,
    tenancy: tenancy_1.default,
    context: context_1.default,
    featureFlags: featureFlags_1.default,
    events,
    sessions,
    deprovisioning: deprovision_1.default,
    installation,
    errors: errors_1.default,
    logging: logging_1.default,
    roles }), pino_1.default), errorClasses);
module.exports = core;
//# sourceMappingURL=index.js.map