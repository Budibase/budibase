"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthType = exports.AccountSSOProvider = exports.AccountSSOProviderType = exports.isSSOAccount = exports.isSelfHostAccount = exports.isCloudAccount = exports.isPasswordAccount = exports.isCreatePasswordAccount = void 0;
exports.isVerifiableSSOProvider = isVerifiableSSOProvider;
const sdk_1 = require("../../sdk");
const isCreatePasswordAccount = (account) => account.authType === AuthType.PASSWORD;
exports.isCreatePasswordAccount = isCreatePasswordAccount;
const isPasswordAccount = (account) => account.authType === AuthType.PASSWORD && account.hosting === sdk_1.Hosting.SELF;
exports.isPasswordAccount = isPasswordAccount;
const isCloudAccount = (account) => account.hosting === sdk_1.Hosting.CLOUD;
exports.isCloudAccount = isCloudAccount;
const isSelfHostAccount = (account) => account.hosting === sdk_1.Hosting.SELF;
exports.isSelfHostAccount = isSelfHostAccount;
const isSSOAccount = (account) => account.authType === AuthType.SSO;
exports.isSSOAccount = isSSOAccount;
var AccountSSOProviderType;
(function (AccountSSOProviderType) {
    AccountSSOProviderType["GOOGLE"] = "google";
    AccountSSOProviderType["MICROSOFT"] = "microsoft";
})(AccountSSOProviderType || (exports.AccountSSOProviderType = AccountSSOProviderType = {}));
var AccountSSOProvider;
(function (AccountSSOProvider) {
    AccountSSOProvider["GOOGLE"] = "google";
    AccountSSOProvider["MICROSOFT"] = "microsoft";
})(AccountSSOProvider || (exports.AccountSSOProvider = AccountSSOProvider = {}));
const verifiableSSOProviders = [
    AccountSSOProvider.MICROSOFT,
];
function isVerifiableSSOProvider(provider) {
    return verifiableSSOProviders.includes(provider);
}
var AuthType;
(function (AuthType) {
    AuthType["SSO"] = "sso";
    AuthType["PASSWORD"] = "password";
})(AuthType || (exports.AuthType = AuthType = {}));
