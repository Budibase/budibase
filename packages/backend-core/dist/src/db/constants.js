"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_DEV_PREFIX = exports.APP_DEV = exports.APP_PREFIX = exports.StaticDatabases = exports.DocumentTypes = exports.DeprecatedViews = exports.ViewNames = exports.AutomationViewModes = exports.UNICODE_MAX = exports.SEPARATOR = void 0;
exports.SEPARATOR = "_";
exports.UNICODE_MAX = "\ufff0";
/**
 * Can be used to create a few different forms of querying a view.
 */
var AutomationViewModes;
(function (AutomationViewModes) {
    AutomationViewModes["ALL"] = "all";
    AutomationViewModes["AUTOMATION"] = "automation";
    AutomationViewModes["STATUS"] = "status";
})(AutomationViewModes = exports.AutomationViewModes || (exports.AutomationViewModes = {}));
var ViewNames;
(function (ViewNames) {
    ViewNames["USER_BY_APP"] = "by_app";
    ViewNames["USER_BY_EMAIL"] = "by_email2";
    ViewNames["BY_API_KEY"] = "by_api_key";
    ViewNames["USER_BY_BUILDERS"] = "by_builders";
    ViewNames["LINK"] = "by_link";
    ViewNames["ROUTING"] = "screen_routes";
    ViewNames["AUTOMATION_LOGS"] = "automation_logs";
})(ViewNames = exports.ViewNames || (exports.ViewNames = {}));
exports.DeprecatedViews = {
    [ViewNames.USER_BY_EMAIL]: [
        // removed due to inaccuracy in view doc filter logic
        "by_email",
    ],
};
var DocumentTypes;
(function (DocumentTypes) {
    DocumentTypes["USER"] = "us";
    DocumentTypes["GROUP"] = "gr";
    DocumentTypes["WORKSPACE"] = "workspace";
    DocumentTypes["CONFIG"] = "config";
    DocumentTypes["TEMPLATE"] = "template";
    DocumentTypes["APP"] = "app";
    DocumentTypes["DEV"] = "dev";
    DocumentTypes["APP_DEV"] = "app_dev";
    DocumentTypes["APP_METADATA"] = "app_metadata";
    DocumentTypes["ROLE"] = "role";
    DocumentTypes["MIGRATIONS"] = "migrations";
    DocumentTypes["DEV_INFO"] = "devinfo";
    DocumentTypes["AUTOMATION_LOG"] = "log_au";
})(DocumentTypes = exports.DocumentTypes || (exports.DocumentTypes = {}));
exports.StaticDatabases = {
    GLOBAL: {
        name: "global-db",
        docs: {
            apiKeys: "apikeys",
            usageQuota: "usage_quota",
            licenseInfo: "license_info",
        },
    },
    // contains information about tenancy and so on
    PLATFORM_INFO: {
        name: "global-info",
        docs: {
            tenants: "tenants",
            install: "install",
        },
    },
};
exports.APP_PREFIX = exports.DocumentTypes.APP + exports.SEPARATOR;
exports.APP_DEV = exports.DocumentTypes.APP_DEV + exports.SEPARATOR;
exports.APP_DEV_PREFIX = exports.APP_DEV;
//# sourceMappingURL=constants.js.map