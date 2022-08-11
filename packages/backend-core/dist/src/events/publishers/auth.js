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
exports.SSODeactivated = exports.SSOActivated = exports.SSOUpdated = exports.SSOCreated = exports.logout = exports.login = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
const __1 = require("..");
function login(source) {
    return __awaiter(this, void 0, void 0, function* () {
        const identity = yield __1.identification.getCurrentIdentity();
        const properties = {
            userId: identity.id,
            source,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTH_LOGIN, properties);
    });
}
exports.login = login;
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        const identity = yield __1.identification.getCurrentIdentity();
        const properties = {
            userId: identity.id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTH_LOGOUT, properties);
    });
}
exports.logout = logout;
function SSOCreated(type, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            type,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTH_SSO_CREATED, properties, timestamp);
    });
}
exports.SSOCreated = SSOCreated;
function SSOUpdated(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            type,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTH_SSO_UPDATED, properties);
    });
}
exports.SSOUpdated = SSOUpdated;
function SSOActivated(type, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            type,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTH_SSO_ACTIVATED, properties, timestamp);
    });
}
exports.SSOActivated = SSOActivated;
function SSODeactivated(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            type,
        };
        yield (0, events_1.publishEvent)(types_1.Event.AUTH_SSO_DEACTIVATED, properties);
    });
}
exports.SSODeactivated = SSODeactivated;
//# sourceMappingURL=auth.js.map