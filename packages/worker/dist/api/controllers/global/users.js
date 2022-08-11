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
exports.inviteAccept = exports.inviteMultiple = exports.invite = exports.tenantUserLookup = exports.find = exports.fetch = exports.search = exports.bulkDelete = exports.destroy = exports.countByApp = exports.adminUser = exports.bulkCreate = exports.save = void 0;
const constants_1 = require("../../../constants");
const redis_1 = require("../../../utilities/redis");
const email_1 = require("../../../utilities/email");
const sdk_1 = require("../../../sdk");
const environment_1 = __importDefault(require("../../../environment"));
const backend_core_1 = require("@budibase/backend-core");
const users_1 = require("../../../utilities/users");
const pro_1 = require("@budibase/pro");
const MAX_USERS_UPLOAD_LIMIT = 1000;
const save = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        ctx.body = yield sdk_1.users.save(ctx.request.body);
    }
    catch (err) {
        ctx.throw(err.status || 400, err);
    }
});
exports.save = save;
const bulkCreate = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let { users: newUsersRequested, groups } = ctx.request.body;
    if (!environment_1.default.SELF_HOSTED && newUsersRequested.length > MAX_USERS_UPLOAD_LIMIT) {
        ctx.throw(400, "Max limit for upload is 1000 users. Please reduce file size and try again.");
    }
    const db = backend_core_1.tenancy.getGlobalDB();
    let groupsToSave = [];
    if (groups.length) {
        for (const groupId of groups) {
            let oldGroup = yield db.get(groupId);
            groupsToSave.push(oldGroup);
        }
    }
    try {
        let response = yield sdk_1.users.bulkCreate(newUsersRequested, groups);
        yield pro_1.groups.bulkSaveGroupUsers(groupsToSave, response);
        ctx.body = response;
    }
    catch (err) {
        ctx.throw(err.status || 400, err);
    }
});
exports.bulkCreate = bulkCreate;
const parseBooleanParam = (param) => {
    return !(param && param === "false");
};
const adminUser = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, tenantId } = ctx.request.body;
    yield backend_core_1.tenancy.doInTenant(tenantId, () => __awaiter(void 0, void 0, void 0, function* () {
        // account portal sends a pre-hashed password - honour param to prevent double hashing
        const hashPassword = parseBooleanParam(ctx.request.query.hashPassword);
        // account portal sends no password for SSO users
        const requirePassword = parseBooleanParam(ctx.request.query.requirePassword);
        if (yield backend_core_1.tenancy.doesTenantExist(tenantId)) {
            ctx.throw(403, "Organisation already exists.");
        }
        const userExists = yield (0, users_1.checkAnyUserExists)();
        if (userExists) {
            ctx.throw(403, "You cannot initialise once an global user has been created.");
        }
        const user = {
            email: email,
            password: password,
            createdAt: Date.now(),
            roles: {},
            builder: {
                global: true,
            },
            admin: {
                global: true,
            },
            tenantId,
        };
        try {
            // always bust checklist beforehand, if an error occurs but can proceed, don't get
            // stuck in a cycle
            yield backend_core_1.cache.bustCache(backend_core_1.cache.CacheKeys.CHECKLIST);
            const finalUser = yield sdk_1.users.save(user, {
                hashPassword,
                requirePassword,
            });
            // events
            let account;
            if (!environment_1.default.SELF_HOSTED && !environment_1.default.DISABLE_ACCOUNT_PORTAL) {
                account = yield backend_core_1.accounts.getAccountByTenantId(tenantId);
            }
            yield backend_core_1.events.identification.identifyTenantGroup(tenantId, account);
            ctx.body = finalUser;
        }
        catch (err) {
            ctx.throw(err.status || 400, err);
        }
    }));
});
exports.adminUser = adminUser;
const countByApp = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const appId = ctx.params.appId;
    try {
        ctx.body = yield sdk_1.users.countUsersByApp(appId);
    }
    catch (err) {
        ctx.throw(err.status || 400, err);
    }
});
exports.countByApp = countByApp;
const destroy = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const id = ctx.params.id;
    if (id === ctx.user._id) {
        ctx.throw(400, "Unable to delete self.");
    }
    yield sdk_1.users.destroy(id, ctx.user);
    ctx.body = {
        message: `User ${id} deleted.`,
    };
});
exports.destroy = destroy;
const bulkDelete = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { userIds } = ctx.request.body;
    if ((userIds === null || userIds === void 0 ? void 0 : userIds.indexOf(ctx.user._id)) !== -1) {
        ctx.throw(400, "Unable to delete self.");
    }
    try {
        let usersResponse = yield sdk_1.users.bulkDelete(userIds);
        ctx.body = {
            message: `${usersResponse.length} user(s) deleted`,
        };
    }
    catch (err) {
        ctx.throw(err);
    }
});
exports.bulkDelete = bulkDelete;
const search = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const paginated = yield sdk_1.users.paginatedUsers(ctx.request.body);
    // user hashed password shouldn't ever be returned
    for (let user of paginated.data) {
        if (user) {
            delete user.password;
        }
    }
    ctx.body = paginated;
});
exports.search = search;
// called internally by app server user fetch
const fetch = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const all = yield sdk_1.users.allUsers();
    // user hashed password shouldn't ever be returned
    for (let user of all) {
        if (user) {
            delete user.password;
        }
    }
    ctx.body = all;
});
exports.fetch = fetch;
// called internally by app server user find
const find = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield sdk_1.users.getUser(ctx.params.id);
});
exports.find = find;
const tenantUserLookup = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const id = ctx.params.id;
    const user = yield backend_core_1.tenancy.getTenantUser(id);
    if (user) {
        ctx.body = user;
    }
    else {
        ctx.throw(400, "No tenant user found.");
    }
});
exports.tenantUserLookup = tenantUserLookup;
const invite = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, userInfo } = ctx.request.body;
    const existing = yield backend_core_1.users.getGlobalUserByEmail(email);
    if (existing) {
        ctx.throw(400, "Email address already in use.");
    }
    if (!userInfo) {
        userInfo = {};
    }
    userInfo.tenantId = backend_core_1.tenancy.getTenantId();
    const opts = {
        subject: "{{ company }} platform invitation",
        info: userInfo,
    };
    yield (0, email_1.sendEmail)(email, constants_1.EmailTemplatePurpose.INVITATION, opts);
    ctx.body = {
        message: "Invitation has been sent.",
    };
    yield backend_core_1.events.user.invited();
});
exports.invite = invite;
const inviteMultiple = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let users = ctx.request.body;
    let existing = false;
    let existingEmail;
    for (let user of users) {
        if (yield backend_core_1.users.getGlobalUserByEmail(user.email)) {
            existing = true;
            existingEmail = user.email;
            break;
        }
    }
    if (existing) {
        ctx.throw(400, `${existingEmail} already exists`);
    }
    for (let i = 0; i < users.length; i++) {
        let userInfo = users[i].userInfo;
        if (!userInfo) {
            userInfo = {};
        }
        userInfo.tenantId = backend_core_1.tenancy.getTenantId();
        const opts = {
            subject: "{{ company }} platform invitation",
            info: userInfo,
        };
        yield (0, email_1.sendEmail)(users[i].email, constants_1.EmailTemplatePurpose.INVITATION, opts);
    }
    ctx.body = {
        message: "Invitations have been sent.",
    };
});
exports.inviteMultiple = inviteMultiple;
const inviteAccept = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { inviteCode, password, firstName, lastName } = ctx.request.body;
    try {
        // info is an extension of the user object that was stored by global
        const { email, info } = yield (0, redis_1.checkInviteCode)(inviteCode);
        ctx.body = yield backend_core_1.tenancy.doInTenant(info.tenantId, () => __awaiter(void 0, void 0, void 0, function* () {
            const saved = yield sdk_1.users.save(Object.assign({ firstName,
                lastName,
                password,
                email }, info));
            const db = backend_core_1.tenancy.getGlobalDB();
            const user = yield db.get(saved._id);
            yield backend_core_1.events.user.inviteAccepted(user);
            return saved;
        }));
    }
    catch (err) {
        if (err.code === backend_core_1.errors.codes.USAGE_LIMIT_EXCEEDED) {
            // explicitly re-throw limit exceeded errors
            ctx.throw(400, err);
        }
        ctx.throw(400, "Unable to create new user, invitation invalid.");
    }
});
exports.inviteAccept = inviteAccept;
