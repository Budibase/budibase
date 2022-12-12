"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUDIBASE_DATASOURCE_TYPE = exports.APP_DEV_PREFIX = exports.APP_DEV = exports.APP_PREFIX = exports.StaticDatabases = exports.DocumentType = exports.InternalTable = exports.DeprecatedViews = exports.ViewName = exports.AutomationViewMode = exports.UNICODE_MAX = exports.SEPARATOR = void 0;
exports.SEPARATOR = "_";
exports.UNICODE_MAX = "\ufff0";
/**
 * Can be used to create a few different forms of querying a view.
 */
var AutomationViewMode;
(function (AutomationViewMode) {
    AutomationViewMode["ALL"] = "all";
    AutomationViewMode["AUTOMATION"] = "automation";
    AutomationViewMode["STATUS"] = "status";
})(AutomationViewMode = exports.AutomationViewMode || (exports.AutomationViewMode = {}));
var ViewName;
(function (ViewName) {
    ViewName["USER_BY_APP"] = "by_app";
    ViewName["USER_BY_EMAIL"] = "by_email2";
    ViewName["BY_API_KEY"] = "by_api_key";
    ViewName["USER_BY_BUILDERS"] = "by_builders";
    ViewName["LINK"] = "by_link";
    ViewName["ROUTING"] = "screen_routes";
    ViewName["AUTOMATION_LOGS"] = "automation_logs";
    ViewName["ACCOUNT_BY_EMAIL"] = "account_by_email";
    ViewName["PLATFORM_USERS_LOWERCASE"] = "platform_users_lowercase";
    ViewName["USER_BY_GROUP"] = "by_group_user";
    ViewName["APP_BACKUP_BY_TRIGGER"] = "by_trigger";
})(ViewName = exports.ViewName || (exports.ViewName = {}));
exports.DeprecatedViews = {
    [ViewName.USER_BY_EMAIL]: [
        // removed due to inaccuracy in view doc filter logic
        "by_email",
    ],
};
var InternalTable;
(function (InternalTable) {
    InternalTable["USER_METADATA"] = "ta_users";
})(InternalTable = exports.InternalTable || (exports.InternalTable = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["USER"] = "us";
    DocumentType["GROUP"] = "gr";
    DocumentType["WORKSPACE"] = "workspace";
    DocumentType["CONFIG"] = "config";
    DocumentType["TEMPLATE"] = "template";
    DocumentType["APP"] = "app";
    DocumentType["DEV"] = "dev";
    DocumentType["APP_DEV"] = "app_dev";
    DocumentType["APP_METADATA"] = "app_metadata";
    DocumentType["ROLE"] = "role";
    DocumentType["MIGRATIONS"] = "migrations";
    DocumentType["DEV_INFO"] = "devinfo";
    DocumentType["AUTOMATION_LOG"] = "log_au";
    DocumentType["ACCOUNT_METADATA"] = "acc_metadata";
    DocumentType["PLUGIN"] = "plg";
    DocumentType["DATASOURCE"] = "datasource";
    DocumentType["DATASOURCE_PLUS"] = "datasource_plus";
    DocumentType["APP_BACKUP"] = "backup";
    DocumentType["TABLE"] = "ta";
    DocumentType["ROW"] = "ro";
    DocumentType["AUTOMATION"] = "au";
    DocumentType["LINK"] = "li";
    DocumentType["WEBHOOK"] = "wh";
    DocumentType["INSTANCE"] = "inst";
    DocumentType["LAYOUT"] = "layout";
    DocumentType["SCREEN"] = "screen";
    DocumentType["QUERY"] = "query";
    DocumentType["DEPLOYMENTS"] = "deployments";
    DocumentType["METADATA"] = "metadata";
    DocumentType["MEM_VIEW"] = "view";
    DocumentType["USER_FLAG"] = "flag";
    DocumentType["AUTOMATION_METADATA"] = "meta_au";
})(DocumentType = exports.DocumentType || (exports.DocumentType = {}));
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
exports.APP_PREFIX = DocumentType.APP + exports.SEPARATOR;
exports.APP_DEV = DocumentType.APP_DEV + exports.SEPARATOR;
exports.APP_DEV_PREFIX = exports.APP_DEV;
exports.BUDIBASE_DATASOURCE_TYPE = "budibase";
//# sourceMappingURL=db.js.map