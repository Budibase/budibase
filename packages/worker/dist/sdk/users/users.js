"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.bulkDelete = exports.bulkCreate = exports.addTenant = exports.save = exports.getUser = exports.paginatedUsers = exports.countUsersByApp = exports.allUsers = void 0;
const environment_1 = __importDefault(require("../../environment"));
const pro_1 = require("@budibase/pro");
const apps = __importStar(require("../../utilities/appService"));
const eventHelpers = __importStar(require("./events"));
const backend_core_1 = require("@budibase/backend-core");
const types_1 = require("@budibase/types");
const pro_2 = require("@budibase/pro");
const PAGE_LIMIT = 8;
const allUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = backend_core_1.tenancy.getGlobalDB();
    const response = yield db.allDocs(backend_core_1.db.getGlobalUserParams(null, {
        include_docs: true,
    }));
    return response.rows.map((row) => row.doc);
});
exports.allUsers = allUsers;
const countUsersByApp = (appId) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield backend_core_1.users.searchGlobalUsersByApp(appId, {});
    return {
        userCount: response.length,
    };
});
exports.countUsersByApp = countUsersByApp;
const paginatedUsers = ({ page, email, appId, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const db = backend_core_1.tenancy.getGlobalDB();
    // get one extra document, to have the next page
    const opts = {
        include_docs: true,
        limit: PAGE_LIMIT + 1,
    };
    // add a startkey if the page was specified (anchor)
    if (page) {
        opts.startkey = page;
    }
    // property specifies what to use for the page/anchor
    let userList, property = "_id", getKey;
    if (appId) {
        userList = yield backend_core_1.users.searchGlobalUsersByApp(appId, opts);
        getKey = (doc) => backend_core_1.users.getGlobalUserByAppPage(appId, doc);
    }
    else if (email) {
        userList = yield backend_core_1.users.searchGlobalUsersByEmail(email, opts);
        property = "email";
    }
    else {
        // no search, query allDocs
        const response = yield db.allDocs(backend_core_1.db.getGlobalUserParams(null, opts));
        userList = response.rows.map((row) => row.doc);
    }
    return backend_core_1.db.pagination(userList, PAGE_LIMIT, {
        paginate: true,
        property,
        getKey,
    });
});
exports.paginatedUsers = paginatedUsers;
/**
 * Gets a user by ID from the global database, based on the current tenancy.
 */
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const db = backend_core_1.tenancy.getGlobalDB();
    let user;
    try {
        user = yield db.get(userId);
    }
    catch (err) {
        // no user found, just return nothing
        if (err.status === 404) {
            return {};
        }
        throw err;
    }
    if (user) {
        delete user.password;
    }
    return user;
});
exports.getUser = getUser;
const buildUser = (user, opts = {
    hashPassword: true,
    requirePassword: true,
}, tenantId, dbUser) => __awaiter(void 0, void 0, void 0, function* () {
    let { password, _id } = user;
    let hashedPassword;
    if (password) {
        hashedPassword = opts.hashPassword ? yield backend_core_1.utils.hash(password) : password;
    }
    else if (dbUser) {
        hashedPassword = dbUser.password;
    }
    else if (opts.requirePassword) {
        throw "Password must be specified.";
    }
    _id = _id || backend_core_1.db.generateGlobalUserID();
    user = Object.assign(Object.assign(Object.assign({ createdAt: Date.now() }, dbUser), user), { _id, password: hashedPassword, tenantId });
    // make sure the roles object is always present
    if (!user.roles) {
        user.roles = {};
    }
    // add the active status to a user if its not provided
    if (user.status == null) {
        user.status = backend_core_1.constants.UserStatus.ACTIVE;
    }
    return user;
});
const save = (user, opts = {
    hashPassword: true,
    requirePassword: true,
    bulkCreate: false,
}) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantId = backend_core_1.tenancy.getTenantId();
    const db = backend_core_1.tenancy.getGlobalDB();
    let { email, _id } = user;
    // make sure another user isn't using the same email
    let dbUser;
    if (opts.bulkCreate) {
        dbUser = null;
    }
    else if (email) {
        // check budibase users inside the tenant
        dbUser = yield backend_core_1.users.getGlobalUserByEmail(email);
        if (dbUser != null && (dbUser._id !== _id || Array.isArray(dbUser))) {
            throw `Email address ${email} already in use.`;
        }
        // check budibase users in other tenants
        if (environment_1.default.MULTI_TENANCY) {
            const tenantUser = yield backend_core_1.tenancy.getTenantUser(email);
            if (tenantUser != null && tenantUser.tenantId !== tenantId) {
                throw `Email address ${email} already in use.`;
            }
        }
        // check root account users in account portal
        if (!environment_1.default.SELF_HOSTED && !environment_1.default.DISABLE_ACCOUNT_PORTAL) {
            const account = yield backend_core_1.accounts.getAccount(email);
            if (account && account.verified && account.tenantId !== tenantId) {
                throw `Email address ${email} already in use.`;
            }
        }
    }
    else if (_id) {
        dbUser = yield db.get(_id);
    }
    let builtUser = yield buildUser(user, opts, tenantId, dbUser);
    // make sure we set the _id field for a new user
    if (!_id) {
        _id = builtUser._id;
    }
    try {
        const putOpts = Object.assign({ password: builtUser.password }, user);
        if (opts.bulkCreate) {
            return putOpts;
        }
        // save the user to db
        let response;
        const putUserFn = () => {
            return db.put(builtUser);
        };
        if (eventHelpers.isAddingBuilder(builtUser, dbUser)) {
            response = yield pro_1.quotas.addDeveloper(putUserFn);
        }
        else {
            response = yield putUserFn();
        }
        builtUser._rev = response.rev;
        yield eventHelpers.handleSaveEvents(builtUser, dbUser);
        yield (0, exports.addTenant)(tenantId, _id, email);
        yield backend_core_1.cache.user.invalidateUser(response.id);
        // let server know to sync user
        yield apps.syncUserInApps(_id);
        return {
            _id: response.id,
            _rev: response.rev,
            email,
        };
    }
    catch (err) {
        if (err.status === 409) {
            throw "User exists already";
        }
        else {
            throw err;
        }
    }
});
exports.save = save;
const addTenant = (tenantId, _id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (environment_1.default.MULTI_TENANCY) {
        const afterCreateTenant = () => backend_core_1.migrations.backPopulateMigrations({
            type: types_1.MigrationType.GLOBAL,
            tenantId,
        });
        yield backend_core_1.tenancy.tryAddTenant(tenantId, _id, email, afterCreateTenant);
    }
});
exports.addTenant = addTenant;
const bulkCreate = (newUsersRequested, groups) => __awaiter(void 0, void 0, void 0, function* () {
    const db = backend_core_1.tenancy.getGlobalDB();
    const tenantId = backend_core_1.tenancy.getTenantId();
    let usersToSave = [];
    let newUsers = [];
    const allUsers = yield db.allDocs(backend_core_1.db.getGlobalUserParams(null, {
        include_docs: true,
    }));
    let mapped = allUsers.rows.map((row) => row.id);
    const currentUserEmails = mapped.map((x) => x.email) || [];
    for (const newUser of newUsersRequested) {
        if (newUsers.find((x) => x.email === newUser.email) ||
            currentUserEmails.includes(newUser.email)) {
            continue;
        }
        newUser.userGroups = groups;
        newUsers.push(newUser);
    }
    // Figure out how many builders we are adding and create the promises
    // array that will be called by bulkDocs
    let builderCount = 0;
    newUsers.forEach((user) => {
        if (eventHelpers.isAddingBuilder(user, null)) {
            builderCount++;
        }
        usersToSave.push(buildUser(user, {
            hashPassword: true,
            requirePassword: user.requirePassword,
        }, tenantId));
    });
    const usersToBulkSave = yield Promise.all(usersToSave);
    yield pro_1.quotas.addDevelopers(() => db.bulkDocs(usersToBulkSave), builderCount);
    // Post processing of bulk added users, i.e events and cache operations
    for (const user of usersToBulkSave) {
        // TODO: Refactor to bulk insert users into the info db
        // instead of relying on looping tenant creation
        yield (0, exports.addTenant)(tenantId, user._id, user.email);
        yield eventHelpers.handleSaveEvents(user, null);
        yield apps.syncUserInApps(user._id);
    }
    return usersToBulkSave.map(user => {
        return {
            _id: user._id,
            email: user.email,
        };
    });
});
exports.bulkCreate = bulkCreate;
const bulkDelete = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    const db = backend_core_1.tenancy.getGlobalDB();
    let groupsToModify = {};
    let builderCount = 0;
    // Get users and delete
    let usersToDelete = (yield db.allDocs({
        include_docs: true,
        keys: userIds,
    })).rows.map((user) => {
        // if we find a user that has an associated group, add it to
        // an array so we can easily use allDocs on them later.
        // This prevents us having to re-loop over all the users
        if (user.doc.userGroups) {
            for (let groupId of user.doc.userGroups) {
                if (!Object.keys(groupsToModify).includes(groupId)) {
                    groupsToModify[groupId] = [user.id];
                }
                else {
                    groupsToModify[groupId] = [...groupsToModify[groupId], user.id];
                }
            }
        }
        // Also figure out how many builders are being deleted
        if (eventHelpers.isAddingBuilder(user.doc, null)) {
            builderCount++;
        }
        return user.doc;
    });
    const response = yield db.bulkDocs(usersToDelete.map((user) => (Object.assign(Object.assign({}, user), { _deleted: true }))));
    yield pro_2.groups.bulkDeleteGroupUsers(groupsToModify);
    //Deletion post processing
    for (let user of usersToDelete) {
        yield bulkDeleteProcessing(user);
    }
    yield pro_1.quotas.removeDevelopers(builderCount);
    return response;
});
exports.bulkDelete = bulkDelete;
const destroy = (id, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const db = backend_core_1.tenancy.getGlobalDB();
    const dbUser = yield db.get(id);
    const userId = dbUser._id;
    let groups = dbUser.userGroups;
    if (!environment_1.default.SELF_HOSTED && !environment_1.default.DISABLE_ACCOUNT_PORTAL) {
        // root account holder can't be deleted from inside budibase
        const email = dbUser.email;
        const account = yield backend_core_1.accounts.getAccount(email);
        if (account) {
            if (email === currentUser.email) {
                throw new backend_core_1.HTTPError('Please visit "Account" to delete this user', 400);
            }
            else {
                throw new backend_core_1.HTTPError("Account holder cannot be deleted", 400);
            }
        }
    }
    yield backend_core_1.deprovisioning.removeUserFromInfoDB(dbUser);
    yield db.remove(userId, dbUser._rev);
    if (groups) {
        yield pro_2.groups.deleteGroupUsers(groups, dbUser);
    }
    yield eventHelpers.handleDeleteEvents(dbUser);
    yield pro_1.quotas.removeUser(dbUser);
    yield backend_core_1.cache.user.invalidateUser(userId);
    yield backend_core_1.sessions.invalidateSessions(userId, { reason: "deletion" });
    // let server know to sync user
    yield apps.syncUserInApps(userId);
});
exports.destroy = destroy;
const bulkDeleteProcessing = (dbUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = dbUser._id;
    yield backend_core_1.deprovisioning.removeUserFromInfoDB(dbUser);
    yield eventHelpers.handleDeleteEvents(dbUser);
    yield backend_core_1.cache.user.invalidateUser(userId);
    yield backend_core_1.sessions.invalidateSessions(userId, { reason: "bulk-deletion" });
    // let server know to sync user
    yield apps.syncUserInApps(userId);
});
