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
exports.installationFailed = exports.installationSucceeded = exports.tenantFailed = exports.tenantSucceeded = exports.appFailed = exports.appSucceeded = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
const env = require("../../environment");
const shouldSkip = !env.SELF_HOSTED && !env.isDev();
function appSucceeded(properties) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldSkip) {
            return;
        }
        yield (0, events_1.publishEvent)(types_1.Event.APP_BACKFILL_SUCCEEDED, properties);
    });
}
exports.appSucceeded = appSucceeded;
function appFailed(error) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldSkip) {
            return;
        }
        const properties = {
            error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        };
        yield (0, events_1.publishEvent)(types_1.Event.APP_BACKFILL_FAILED, properties);
    });
}
exports.appFailed = appFailed;
function tenantSucceeded(properties) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldSkip) {
            return;
        }
        yield (0, events_1.publishEvent)(types_1.Event.TENANT_BACKFILL_SUCCEEDED, properties);
    });
}
exports.tenantSucceeded = tenantSucceeded;
function tenantFailed(error) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldSkip) {
            return;
        }
        const properties = {
            error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        };
        yield (0, events_1.publishEvent)(types_1.Event.TENANT_BACKFILL_FAILED, properties);
    });
}
exports.tenantFailed = tenantFailed;
function installationSucceeded() {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldSkip) {
            return;
        }
        const properties = {};
        yield (0, events_1.publishEvent)(types_1.Event.INSTALLATION_BACKFILL_SUCCEEDED, properties);
    });
}
exports.installationSucceeded = installationSucceeded;
function installationFailed(error) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldSkip) {
            return;
        }
        const properties = {
            error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        };
        yield (0, events_1.publishEvent)(types_1.Event.INSTALLATION_BACKFILL_FAILED, properties);
    });
}
exports.installationFailed = installationFailed;
//# sourceMappingURL=backfill.js.map