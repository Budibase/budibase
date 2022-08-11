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
const { ViewNames, getUsersByAppParams, getProdAppID, generateAppUserID, } = require("./db/utils");
const { queryGlobalView } = require("./db/views");
const { UNICODE_MAX } = require("./db/constants");
/**
 * Given an email address this will use a view to search through
 * all the users to find one with this email address.
 * @param {string} email the email to lookup the user by.
 * @return {Promise<object|null>}
 */
exports.getGlobalUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email == null) {
        throw "Must supply an email address to view";
    }
    return yield queryGlobalView(ViewNames.USER_BY_EMAIL, {
        key: email.toLowerCase(),
        include_docs: true,
    });
});
exports.searchGlobalUsersByApp = (appId, opts) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof appId !== "string") {
        throw new Error("Must provide a string based app ID");
    }
    const params = getUsersByAppParams(appId, {
        include_docs: true,
    });
    params.startkey = opts && opts.startkey ? opts.startkey : params.startkey;
    let response = yield queryGlobalView(ViewNames.USER_BY_APP, params);
    if (!response) {
        response = [];
    }
    return Array.isArray(response) ? response : [response];
});
exports.getGlobalUserByAppPage = (appId, user) => {
    if (!user) {
        return;
    }
    return generateAppUserID(getProdAppID(appId), user._id);
};
/**
 * Performs a starts with search on the global email view.
 */
exports.searchGlobalUsersByEmail = (email, opts) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof email !== "string") {
        throw new Error("Must provide a string to search by");
    }
    const lcEmail = email.toLowerCase();
    // handle if passing up startkey for pagination
    const startkey = opts && opts.startkey ? opts.startkey : lcEmail;
    let response = yield queryGlobalView(ViewNames.USER_BY_EMAIL, Object.assign(Object.assign({}, opts), { startkey, endkey: `${lcEmail}${UNICODE_MAX}` }));
    if (!response) {
        response = [];
    }
    return Array.isArray(response) ? response : [response];
});
//# sourceMappingURL=users.js.map