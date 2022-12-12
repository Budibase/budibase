"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TENANT_ID = exports.MAX_VALID_DATE = exports.Config = exports.GlobalRole = exports.Header = exports.Cookie = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var Cookie;
(function (Cookie) {
    Cookie["CurrentApp"] = "budibase:currentapp";
    Cookie["Auth"] = "budibase:auth";
    Cookie["Init"] = "budibase:init";
    Cookie["ACCOUNT_RETURN_URL"] = "budibase:account:returnurl";
    Cookie["DatasourceAuth"] = "budibase:datasourceauth";
    Cookie["OIDC_CONFIG"] = "budibase:oidc:config";
})(Cookie = exports.Cookie || (exports.Cookie = {}));
var Header;
(function (Header) {
    Header["API_KEY"] = "x-budibase-api-key";
    Header["LICENSE_KEY"] = "x-budibase-license-key";
    Header["API_VER"] = "x-budibase-api-version";
    Header["APP_ID"] = "x-budibase-app-id";
    Header["TYPE"] = "x-budibase-type";
    Header["PREVIEW_ROLE"] = "x-budibase-role";
    Header["TENANT_ID"] = "x-budibase-tenant-id";
    Header["TOKEN"] = "x-budibase-token";
    Header["CSRF_TOKEN"] = "x-csrf-token";
})(Header = exports.Header || (exports.Header = {}));
var GlobalRole;
(function (GlobalRole) {
    GlobalRole["OWNER"] = "owner";
    GlobalRole["ADMIN"] = "admin";
    GlobalRole["BUILDER"] = "builder";
    GlobalRole["WORKSPACE_MANAGER"] = "workspace_manager";
})(GlobalRole = exports.GlobalRole || (exports.GlobalRole = {}));
var Config;
(function (Config) {
    Config["SETTINGS"] = "settings";
    Config["ACCOUNT"] = "account";
    Config["SMTP"] = "smtp";
    Config["GOOGLE"] = "google";
    Config["OIDC"] = "oidc";
    Config["OIDC_LOGOS"] = "logos_oidc";
})(Config = exports.Config || (exports.Config = {}));
exports.MAX_VALID_DATE = new Date(2147483647000);
exports.DEFAULT_TENANT_ID = "default";
//# sourceMappingURL=misc.js.map