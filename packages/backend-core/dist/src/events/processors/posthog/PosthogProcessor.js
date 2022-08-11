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
const posthog_node_1 = __importDefault(require("posthog-node"));
const types_1 = require("@budibase/types");
const environment_1 = __importDefault(require("../../../environment"));
const context = __importStar(require("../../../context"));
const rateLimiting = __importStar(require("./rateLimiting"));
const pkg = require("../../../../package.json");
const EXCLUDED_EVENTS = [
    types_1.Event.USER_UPDATED,
    types_1.Event.EMAIL_SMTP_UPDATED,
    types_1.Event.AUTH_SSO_UPDATED,
    types_1.Event.APP_UPDATED,
    types_1.Event.ROLE_UPDATED,
    types_1.Event.DATASOURCE_UPDATED,
    types_1.Event.QUERY_UPDATED,
    types_1.Event.TABLE_UPDATED,
    types_1.Event.VIEW_UPDATED,
    types_1.Event.VIEW_FILTER_UPDATED,
    types_1.Event.VIEW_CALCULATION_UPDATED,
    types_1.Event.AUTOMATION_TRIGGER_UPDATED,
    types_1.Event.USER_GROUP_UPDATED,
];
class PosthogProcessor {
    constructor(token) {
        if (!token) {
            throw new Error("Posthog token is not defined");
        }
        this.posthog = new posthog_node_1.default(token);
    }
    processEvent(event, identity, properties, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            // don't send excluded events
            if (EXCLUDED_EVENTS.includes(event)) {
                return;
            }
            if (yield rateLimiting.limited(event)) {
                return;
            }
            properties.version = pkg.version;
            properties.service = environment_1.default.SERVICE;
            properties.environment = identity.environment;
            properties.hosting = identity.hosting;
            const appId = context.getAppId();
            if (appId) {
                properties.appId = appId;
            }
            const payload = { distinctId: identity.id, event, properties };
            if (timestamp) {
                payload.timestamp = new Date(timestamp);
            }
            // add groups to the event
            if (identity.installationId || identity.tenantId) {
                payload.groups = {};
                if (identity.installationId) {
                    payload.groups.installation = identity.installationId;
                    payload.properties.installationId = identity.installationId;
                }
                if (identity.tenantId) {
                    payload.groups.tenant = identity.tenantId;
                    payload.properties.tenantId = identity.tenantId;
                }
            }
            this.posthog.capture(payload);
        });
    }
    identify(identity, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { distinctId: identity.id, properties: identity };
            if (timestamp) {
                payload.timestamp = new Date(timestamp);
            }
            this.posthog.identify(payload);
        });
    }
    identifyGroup(group, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                distinctId: group.id,
                groupType: group.type,
                groupKey: group.id,
                properties: group,
            };
            if (timestamp) {
                payload.timestamp = new Date(timestamp);
            }
            this.posthog.groupIdentify(payload);
        });
    }
    shutdown() {
        this.posthog.shutdown();
    }
}
exports.default = PosthogProcessor;
//# sourceMappingURL=PosthogProcessor.js.map