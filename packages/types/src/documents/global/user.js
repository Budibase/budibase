"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.SSOProviderType = void 0;
exports.isSSOUser = isSSOUser;
exports.isUser = isUser;
var SSOProviderType;
(function (SSOProviderType) {
    SSOProviderType["OIDC"] = "oidc";
    SSOProviderType["GOOGLE"] = "google";
})(SSOProviderType || (exports.SSOProviderType = SSOProviderType = {}));
function isSSOUser(user) {
    return !!user.providerType;
}
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
function isUser(user) {
    return !!user.roles;
}
