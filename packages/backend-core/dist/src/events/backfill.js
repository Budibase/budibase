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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlreadySent = exports.isBackfillingEvent = exports.end = exports.recordEvent = exports.start = void 0;
const types_1 = require("@budibase/types");
const context = __importStar(require("../context"));
const generic_1 = require("../cache/generic");
const cache = __importStar(require("../cache/generic"));
// LIFECYCLE
const start = (events) => __awaiter(void 0, void 0, void 0, function* () {
    const metadata = {
        eventWhitelist: events,
    };
    return saveBackfillMetadata(metadata);
});
exports.start = start;
const recordEvent = (event, properties) => __awaiter(void 0, void 0, void 0, function* () {
    const eventKey = getEventKey(event, properties);
    // don't use a ttl - cleaned up by migration
    // don't use tenancy - already in the key
    yield cache.store(eventKey, properties, undefined, { useTenancy: false });
});
exports.recordEvent = recordEvent;
const end = () => __awaiter(void 0, void 0, void 0, function* () {
    yield deleteBackfillMetadata();
    yield clearEvents();
});
exports.end = end;
// CRUD
const getBackfillMetadata = () => __awaiter(void 0, void 0, void 0, function* () {
    return cache.get(generic_1.CacheKeys.BACKFILL_METADATA);
});
const saveBackfillMetadata = (backfill) => __awaiter(void 0, void 0, void 0, function* () {
    // no TTL - deleted by backfill
    return cache.store(generic_1.CacheKeys.BACKFILL_METADATA, backfill);
});
const deleteBackfillMetadata = () => __awaiter(void 0, void 0, void 0, function* () {
    yield cache.delete(generic_1.CacheKeys.BACKFILL_METADATA);
});
const clearEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    // wildcard
    const pattern = getEventKey();
    const keys = yield cache.keys(pattern);
    for (const key of keys) {
        // delete each key
        // don't  use tenancy, already in the key
        yield cache.delete(key, { useTenancy: false });
    }
});
// HELPERS
const isBackfillingEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const backfill = yield getBackfillMetadata();
    const events = backfill === null || backfill === void 0 ? void 0 : backfill.eventWhitelist;
    if (events && events.includes(event)) {
        return true;
    }
    else {
        return false;
    }
});
exports.isBackfillingEvent = isBackfillingEvent;
const isAlreadySent = (event, properties) => __awaiter(void 0, void 0, void 0, function* () {
    const eventKey = getEventKey(event, properties);
    const cachedEvent = yield cache.get(eventKey, {
        useTenancy: false,
    });
    return !!cachedEvent;
});
exports.isAlreadySent = isAlreadySent;
const CUSTOM_PROPERTY_SUFFIX = {
    // APP EVENTS
    [types_1.Event.AUTOMATION_CREATED]: (properties) => {
        return properties.automationId;
    },
    [types_1.Event.AUTOMATION_STEP_CREATED]: (properties) => {
        return properties.stepId;
    },
    [types_1.Event.DATASOURCE_CREATED]: (properties) => {
        return properties.datasourceId;
    },
    [types_1.Event.LAYOUT_CREATED]: (properties) => {
        return properties.layoutId;
    },
    [types_1.Event.QUERY_CREATED]: (properties) => {
        return properties.queryId;
    },
    [types_1.Event.ROLE_CREATED]: (properties) => {
        return properties.roleId;
    },
    [types_1.Event.SCREEN_CREATED]: (properties) => {
        return properties.screenId;
    },
    [types_1.Event.TABLE_CREATED]: (properties) => {
        return properties.tableId;
    },
    [types_1.Event.VIEW_CREATED]: (properties) => {
        return properties.tableId; // best uniqueness
    },
    [types_1.Event.VIEW_CALCULATION_CREATED]: (properties) => {
        return properties.tableId; // best uniqueness
    },
    [types_1.Event.VIEW_FILTER_CREATED]: (properties) => {
        return properties.tableId; // best uniqueness
    },
    [types_1.Event.APP_CREATED]: (properties) => {
        return properties.appId; // best uniqueness
    },
    [types_1.Event.APP_PUBLISHED]: (properties) => {
        return properties.appId; // best uniqueness
    },
    // GLOBAL EVENTS
    [types_1.Event.AUTH_SSO_CREATED]: (properties) => {
        return properties.type;
    },
    [types_1.Event.AUTH_SSO_ACTIVATED]: (properties) => {
        return properties.type;
    },
    [types_1.Event.USER_CREATED]: (properties) => {
        return properties.userId;
    },
    [types_1.Event.USER_PERMISSION_ADMIN_ASSIGNED]: (properties) => {
        return properties.userId;
    },
    [types_1.Event.USER_PERMISSION_BUILDER_ASSIGNED]: (properties) => {
        return properties.userId;
    },
    [types_1.Event.ROLE_ASSIGNED]: (properties) => {
        return `${properties.roleId}-${properties.userId}`;
    },
};
const getEventKey = (event, properties) => {
    let eventKey;
    const tenantId = context.getTenantId();
    if (event) {
        eventKey = `${generic_1.CacheKeys.EVENTS}:${tenantId}:${event}`;
        // use some properties to make the key more unique
        const custom = CUSTOM_PROPERTY_SUFFIX[event];
        const suffix = custom ? custom(properties) : undefined;
        if (suffix) {
            eventKey = `${eventKey}:${suffix}`;
        }
    }
    else {
        eventKey = `${generic_1.CacheKeys.EVENTS}:${tenantId}:*`;
    }
    return eventKey;
};
//# sourceMappingURL=backfill.js.map