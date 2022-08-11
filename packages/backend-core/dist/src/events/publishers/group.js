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
exports.permissionsEdited = exports.createdOnboarding = exports.usersDeleted = exports.usersAdded = exports.deleted = exports.updated = exports.created = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
function created(group, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            groupId: group._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_GROUP_CREATED, properties, timestamp);
    });
}
exports.created = created;
function updated(group) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            groupId: group._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_GROUP_UPDATED, properties);
    });
}
exports.updated = updated;
function deleted(group) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            groupId: group._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_GROUP_DELETED, properties);
    });
}
exports.deleted = deleted;
function usersAdded(count, group) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            count,
            groupId: group._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_GROUP_USERS_ADDED, properties);
    });
}
exports.usersAdded = usersAdded;
function usersDeleted(emails, group) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            count: emails.length,
            groupId: group._id,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_GROUP_USERS_REMOVED, properties);
    });
}
exports.usersDeleted = usersDeleted;
function createdOnboarding(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            groupId: groupId,
            onboarding: true,
        };
        yield (0, events_1.publishEvent)(types_1.Event.USER_GROUP_ONBOARDING, properties);
    });
}
exports.createdOnboarding = createdOnboarding;
function permissionsEdited(roles) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = Object.assign({}, roles);
        yield (0, events_1.publishEvent)(types_1.Event.USER_GROUP_PERMISSIONS_EDITED, properties);
    });
}
exports.permissionsEdited = permissionsEdited;
//# sourceMappingURL=group.js.map