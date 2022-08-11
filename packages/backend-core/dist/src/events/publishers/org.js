"use strict";
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
exports.analyticsOptIn = exports.analyticsOptOut = exports.platformURLUpdated = exports.logoUpdated = exports.nameUpdated = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
function nameUpdated(timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {};
        yield (0, events_1.publishEvent)(types_1.Event.ORG_NAME_UPDATED, properties, timestamp);
    });
}
exports.nameUpdated = nameUpdated;
function logoUpdated(timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {};
        yield (0, events_1.publishEvent)(types_1.Event.ORG_LOGO_UPDATED, properties, timestamp);
    });
}
exports.logoUpdated = logoUpdated;
function platformURLUpdated(timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {};
        yield (0, events_1.publishEvent)(types_1.Event.ORG_PLATFORM_URL_UPDATED, properties, timestamp);
    });
}
exports.platformURLUpdated = platformURLUpdated;
// TODO
function analyticsOptOut() {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {};
        yield (0, events_1.publishEvent)(types_1.Event.ANALYTICS_OPT_OUT, properties);
    });
}
exports.analyticsOptOut = analyticsOptOut;
function analyticsOptIn() {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {};
        yield (0, events_1.publishEvent)(types_1.Event.ANALYTICS_OPT_OUT, properties);
    });
}
exports.analyticsOptIn = analyticsOptIn;
//# sourceMappingURL=org.js.map