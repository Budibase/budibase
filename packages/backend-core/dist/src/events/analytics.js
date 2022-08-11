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
exports.enabled = void 0;
const environment_1 = __importDefault(require("../environment"));
const tenancy_1 = __importDefault(require("../tenancy"));
const dbUtils = __importStar(require("../db/utils"));
const constants_1 = require("../constants");
const generic_1 = require("../cache/generic");
const enabled = () => __awaiter(void 0, void 0, void 0, function* () {
    // cloud - always use the environment variable
    if (!environment_1.default.SELF_HOSTED) {
        return !!environment_1.default.ENABLE_ANALYTICS;
    }
    // self host - prefer the settings doc
    // use cache as events have high throughput
    const enabledInDB = yield (0, generic_1.withCache)(generic_1.CacheKeys.ANALYTICS_ENABLED, generic_1.TTL.ONE_DAY, () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const settings = yield getSettingsDoc();
        // need to do explicit checks in case the field is not set
        if (((_a = settings === null || settings === void 0 ? void 0 : settings.config) === null || _a === void 0 ? void 0 : _a.analyticsEnabled) === false) {
            return false;
        }
        else if (((_b = settings === null || settings === void 0 ? void 0 : settings.config) === null || _b === void 0 ? void 0 : _b.analyticsEnabled) === true) {
            return true;
        }
    }));
    if (enabledInDB !== undefined) {
        return enabledInDB;
    }
    // fallback to the environment variable
    // explicitly check for 0 or false here, undefined or otherwise is treated as true
    const envEnabled = environment_1.default.ENABLE_ANALYTICS;
    if (envEnabled === 0 || envEnabled === false) {
        return false;
    }
    else {
        return true;
    }
});
exports.enabled = enabled;
const getSettingsDoc = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = tenancy_1.default.getGlobalDB();
    let settings;
    try {
        settings = yield db.get(dbUtils.generateConfigID({ type: constants_1.Configs.SETTINGS }));
    }
    catch (e) {
        if (e.status !== 404) {
            throw e;
        }
    }
    return settings;
});
//# sourceMappingURL=analytics.js.map