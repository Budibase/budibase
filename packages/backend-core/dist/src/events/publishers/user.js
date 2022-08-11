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
exports.passwordReset = exports.passwordResetRequested = exports.passwordUpdated = exports.passwordForceReset = exports.inviteAccepted = exports.invited = exports.permissionBuilderRemoved = exports.permissionBuilderAssigned = exports.permissionAdminRemoved = exports.permissionAdminAssigned = exports.deleted = exports.updated = exports.created = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
function created(user, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_CREATED, properties, timestamp);
    });
}
exports.created = created;
function updated(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_UPDATED, properties);
    });
}
exports.updated = updated;
function deleted(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_DELETED, properties);
    });
}
exports.deleted = deleted;
// PERMISSIONS
function permissionAdminAssigned(user, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_PERMISSION_ADMIN_ASSIGNED, properties, timestamp);
    });
}
exports.permissionAdminAssigned = permissionAdminAssigned;
function permissionAdminRemoved(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_PERMISSION_ADMIN_REMOVED, properties);
    });
}
exports.permissionAdminRemoved = permissionAdminRemoved;
function permissionBuilderAssigned(user, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_PERMISSION_BUILDER_ASSIGNED, properties, timestamp);
    });
}
exports.permissionBuilderAssigned = permissionBuilderAssigned;
function permissionBuilderRemoved(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_PERMISSION_BUILDER_REMOVED, properties);
    });
}
exports.permissionBuilderRemoved = permissionBuilderRemoved;
// INVITE
function invited() {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {};
        yield (0, events_1.publishEvent)(types_1.Event.USER_INVITED, properties);
    });
}
exports.invited = invited;
function inviteAccepted(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_INVITED_ACCEPTED, properties);
    });
}
exports.inviteAccepted = inviteAccepted;
// PASSWORD
function passwordForceReset(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_PASSWORD_FORCE_RESET, properties);
    });
}
exports.passwordForceReset = passwordForceReset;
function passwordUpdated(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_PASSWORD_UPDATED, properties);
    });
}
exports.passwordUpdated = passwordUpdated;
function passwordResetRequested(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_PASSWORD_RESET_REQUESTED, properties);
    });
}
exports.passwordResetRequested = passwordResetRequested;
function passwordReset(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_PASSWORD_RESET, properties);
    });
}
exports.passwordReset = passwordReset;
//# sourceMappingURL=user.js.map