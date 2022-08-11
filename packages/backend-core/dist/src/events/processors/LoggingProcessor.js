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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../../environment"));
const getTimestampString = (timestamp) => {
    let timestampString = "";
    if (timestamp) {
        timestampString = `[timestamp=${new Date(timestamp).toISOString()}]`;
    }
    return timestampString;
};
const skipLogging = environment_1.default.SELF_HOSTED && !environment_1.default.isDev();
class LoggingProcessor {
    processEvent(event, identity, properties, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (skipLogging) {
                return;
            }
            let timestampString = getTimestampString(timestamp);
            console.log(`[audit] [tenant=${identity.tenantId}] [identityType=${identity.type}] [identity=${identity.id}] ${timestampString} ${event} `);
        });
    }
    identify(identity, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (skipLogging) {
                return;
            }
            let timestampString = getTimestampString(timestamp);
            console.log(`[audit] [${JSON.stringify(identity)}] ${timestampString} identified`);
        });
    }
    identifyGroup(group, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (skipLogging) {
                return;
            }
            let timestampString = getTimestampString(timestamp);
            console.log(`[audit] [${JSON.stringify(group)}] ${timestampString} group identified`);
        });
    }
    shutdown() {
        // no-op
    }
}
exports.default = LoggingProcessor;
//# sourceMappingURL=LoggingProcessor.js.map