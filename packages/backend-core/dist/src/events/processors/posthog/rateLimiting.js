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
exports.limited = void 0;
const types_1 = require("@budibase/types");
const generic_1 = require("../../../cache/generic");
const cache = __importStar(require("../../../cache/generic"));
const context = __importStar(require("../../../context"));
const isRateLimited = (event) => {
    return (event === types_1.Event.SERVED_BUILDER ||
        event === types_1.Event.SERVED_APP_PREVIEW ||
        event === types_1.Event.SERVED_APP);
};
const isPerApp = (event) => {
    return event === types_1.Event.SERVED_APP_PREVIEW || event === types_1.Event.SERVED_APP;
};
var RateLimit;
(function (RateLimit) {
    RateLimit["CALENDAR_DAY"] = "calendarDay";
})(RateLimit || (RateLimit = {}));
const RATE_LIMITS = {
    [types_1.Event.SERVED_APP]: RateLimit.CALENDAR_DAY,
    [types_1.Event.SERVED_APP_PREVIEW]: RateLimit.CALENDAR_DAY,
    [types_1.Event.SERVED_BUILDER]: RateLimit.CALENDAR_DAY,
};
/**
 * Check if this event should be sent right now
 * Return false to signal the event SHOULD be sent
 * Return true to signal the event should NOT be sent
 */
const limited = (event) => __awaiter(void 0, void 0, void 0, function* () {
    // not a rate limited event -- send
    if (!isRateLimited(event)) {
        return false;
    }
    const cachedEvent = yield readEvent(event);
    if (cachedEvent) {
        const timestamp = new Date(cachedEvent.timestamp);
        const limit = RATE_LIMITS[event];
        switch (limit) {
            case RateLimit.CALENDAR_DAY: {
                // get midnight at the start of the next day for the timestamp
                timestamp.setDate(timestamp.getDate() + 1);
                timestamp.setHours(0, 0, 0, 0);
                // if we have passed the threshold into the next day
                if (Date.now() > timestamp.getTime()) {
                    // update the timestamp in the event -- send
                    yield recordEvent(event, { timestamp: Date.now() });
                    return false;
                }
                else {
                    // still within the limited period -- don't send
                    return true;
                }
            }
        }
    }
    else {
        // no event present i.e. expired -- send
        yield recordEvent(event, { timestamp: Date.now() });
        return false;
    }
});
exports.limited = limited;
const eventKey = (event) => {
    let key = `${generic_1.CacheKeys.EVENTS_RATE_LIMIT}:${event}`;
    if (isPerApp(event)) {
        key = key + ":" + context.getAppId();
    }
    return key;
};
const readEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const key = eventKey(event);
    const result = yield cache.get(key);
    return result;
});
const recordEvent = (event, properties) => __awaiter(void 0, void 0, void 0, function* () {
    const key = eventKey(event);
    const limit = RATE_LIMITS[event];
    let ttl;
    switch (limit) {
        case RateLimit.CALENDAR_DAY: {
            ttl = generic_1.TTL.ONE_DAY;
        }
    }
    yield cache.store(key, properties, ttl);
});
//# sourceMappingURL=rateLimiting.js.map