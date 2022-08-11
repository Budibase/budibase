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
const types_1 = require("@budibase/types");
const environment_1 = __importDefault(require("../../environment"));
const analytics = __importStar(require("../analytics"));
const posthog_1 = __importDefault(require("./posthog"));
/**
 * Events that are always captured.
 */
const EVENT_WHITELIST = [
    types_1.Event.INSTALLATION_VERSION_UPGRADED,
    types_1.Event.INSTALLATION_VERSION_DOWNGRADED,
];
const IDENTITY_WHITELIST = [types_1.IdentityType.INSTALLATION, types_1.IdentityType.TENANT];
class AnalyticsProcessor {
    constructor() {
        if (environment_1.default.POSTHOG_TOKEN && !environment_1.default.isTest()) {
            this.posthog = new posthog_1.default(environment_1.default.POSTHOG_TOKEN);
        }
    }
    processEvent(event, identity, properties, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!EVENT_WHITELIST.includes(event) && !(yield analytics.enabled())) {
                return;
            }
            if (this.posthog) {
                yield this.posthog.processEvent(event, identity, properties, timestamp);
            }
        });
    }
    identify(identity, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            // Group indentifications (tenant and installation) always on
            if (!IDENTITY_WHITELIST.includes(identity.type) &&
                !(yield analytics.enabled())) {
                return;
            }
            if (this.posthog) {
                yield this.posthog.identify(identity, timestamp);
            }
        });
    }
    identifyGroup(group, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            // Group indentifications (tenant and installation) always on
            if (this.posthog) {
                yield this.posthog.identifyGroup(group, timestamp);
            }
        });
    }
    shutdown() {
        if (this.posthog) {
            this.posthog.shutdown();
        }
    }
}
exports.default = AnalyticsProcessor;
//# sourceMappingURL=AnalyticsProcessor.js.map