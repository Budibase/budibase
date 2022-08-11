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
exports.isRemovingBuilder = exports.isAddingBuilder = exports.handleSaveEvents = exports.handleDeleteEvents = void 0;
const environment_1 = __importDefault(require("../../environment"));
const backend_core_1 = require("@budibase/backend-core");
const handleDeleteEvents = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield backend_core_1.events.user.deleted(user);
    if (isBuilder(user)) {
        yield backend_core_1.events.user.permissionBuilderRemoved(user);
    }
    if (isAdmin(user)) {
        yield backend_core_1.events.user.permissionAdminRemoved(user);
    }
});
exports.handleDeleteEvents = handleDeleteEvents;
const assignAppRoleEvents = (user, roles, existingRoles) => __awaiter(void 0, void 0, void 0, function* () {
    for (const [appId, role] of Object.entries(roles)) {
        // app role in existing is not same as new
        if (!existingRoles || existingRoles[appId] !== role) {
            yield backend_core_1.events.role.assigned(user, role);
        }
    }
});
const unassignAppRoleEvents = (user, roles, existingRoles) => __awaiter(void 0, void 0, void 0, function* () {
    if (!existingRoles) {
        return;
    }
    for (const [appId, role] of Object.entries(existingRoles)) {
        // app role in new is not same as existing
        if (!roles || roles[appId] !== role) {
            yield backend_core_1.events.role.unassigned(user, role);
        }
    }
});
const handleAppRoleEvents = (user, existingUser) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = user.roles;
    const existingRoles = existingUser === null || existingUser === void 0 ? void 0 : existingUser.roles;
    yield assignAppRoleEvents(user, roles, existingRoles);
    yield unassignAppRoleEvents(user, roles, existingRoles);
});
const handleSaveEvents = (user, existingUser) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantId = backend_core_1.tenancy.getTenantId();
    let tenantAccount;
    if (!environment_1.default.SELF_HOSTED && !environment_1.default.DISABLE_ACCOUNT_PORTAL) {
        tenantAccount = yield backend_core_1.accounts.getAccountByTenantId(tenantId);
    }
    yield backend_core_1.events.identification.identifyUser(user, tenantAccount);
    if (existingUser) {
        yield backend_core_1.events.user.updated(user);
        if ((0, exports.isRemovingBuilder)(user, existingUser)) {
            yield backend_core_1.events.user.permissionBuilderRemoved(user);
        }
        if (isRemovingAdmin(user, existingUser)) {
            yield backend_core_1.events.user.permissionAdminRemoved(user);
        }
        if (!existingUser.forceResetPassword &&
            user.forceResetPassword &&
            user.password) {
            yield backend_core_1.events.user.passwordForceReset(user);
        }
    }
    else {
        yield backend_core_1.events.user.created(user);
    }
    if ((0, exports.isAddingBuilder)(user, existingUser)) {
        yield backend_core_1.events.user.permissionBuilderAssigned(user);
    }
    if (isAddingAdmin(user, existingUser)) {
        yield backend_core_1.events.user.permissionAdminAssigned(user);
    }
    yield handleAppRoleEvents(user, existingUser);
});
exports.handleSaveEvents = handleSaveEvents;
const isBuilder = (user) => user.builder && user.builder.global;
const isAdmin = (user) => user.admin && user.admin.global;
const isAddingBuilder = (user, existingUser) => {
    return isAddingPermission(user, existingUser, isBuilder);
};
exports.isAddingBuilder = isAddingBuilder;
const isRemovingBuilder = (user, existingUser) => {
    return isRemovingPermission(user, existingUser, isBuilder);
};
exports.isRemovingBuilder = isRemovingBuilder;
const isAddingAdmin = (user, existingUser) => {
    return isAddingPermission(user, existingUser, isAdmin);
};
const isRemovingAdmin = (user, existingUser) => {
    return isRemovingPermission(user, existingUser, isAdmin);
};
/**
 * Check if a permission is being added to a new or existing user.
 */
const isAddingPermission = (user, existingUser, hasPermission) => {
    // new user doesn't have the permission
    if (!hasPermission(user)) {
        return false;
    }
    // existing user has the permission
    if (existingUser && hasPermission(existingUser)) {
        return false;
    }
    // permission is being added
    return true;
};
/**
 * Check if a permission is being removed from an existing user.
 */
const isRemovingPermission = (user, existingUser, hasPermission) => {
    // new user has the permission
    if (hasPermission(user)) {
        return false;
    }
    // no existing user or existing user doesn't have the permission
    if (!existingUser) {
        return false;
    }
    // existing user doesn't have the permission
    if (!hasPermission(existingUser)) {
        return false;
    }
    // permission is being removed
    return true;
};
