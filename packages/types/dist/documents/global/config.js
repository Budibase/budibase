"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigType = exports.isOIDCConfig = exports.isGoogleConfig = exports.isSMTPConfig = exports.isSettingsConfig = void 0;
const isSettingsConfig = (config) => config.type === ConfigType.SETTINGS;
exports.isSettingsConfig = isSettingsConfig;
const isSMTPConfig = (config) => config.type === ConfigType.SMTP;
exports.isSMTPConfig = isSMTPConfig;
const isGoogleConfig = (config) => config.type === ConfigType.GOOGLE;
exports.isGoogleConfig = isGoogleConfig;
const isOIDCConfig = (config) => config.type === ConfigType.OIDC;
exports.isOIDCConfig = isOIDCConfig;
var ConfigType;
(function (ConfigType) {
    ConfigType["SETTINGS"] = "settings";
    ConfigType["SMTP"] = "smtp";
    ConfigType["GOOGLE"] = "google";
    ConfigType["OIDC"] = "oidc";
})(ConfigType = exports.ConfigType || (exports.ConfigType = {}));
//# sourceMappingURL=config.js.map