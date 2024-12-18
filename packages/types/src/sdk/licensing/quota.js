"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConstantQuota = exports.isMonthlyQuota = exports.isStaticQuota = exports.ConstantQuotaName = exports.MonthlyQuotaName = exports.StaticQuotaName = exports.QuotaType = exports.QuotaUsageType = void 0;
var QuotaUsageType;
(function (QuotaUsageType) {
    QuotaUsageType["STATIC"] = "static";
    QuotaUsageType["MONTHLY"] = "monthly";
})(QuotaUsageType || (exports.QuotaUsageType = QuotaUsageType = {}));
var QuotaType;
(function (QuotaType) {
    QuotaType["USAGE"] = "usage";
    QuotaType["CONSTANT"] = "constant";
})(QuotaType || (exports.QuotaType = QuotaType = {}));
var StaticQuotaName;
(function (StaticQuotaName) {
    StaticQuotaName["ROWS"] = "rows";
    StaticQuotaName["APPS"] = "apps";
    StaticQuotaName["USERS"] = "users";
    StaticQuotaName["CREATORS"] = "creators";
    StaticQuotaName["USER_GROUPS"] = "userGroups";
    StaticQuotaName["PLUGINS"] = "plugins";
    StaticQuotaName["AI_CUSTOM_CONFIGS"] = "aiCustomConfigs";
})(StaticQuotaName || (exports.StaticQuotaName = StaticQuotaName = {}));
var MonthlyQuotaName;
(function (MonthlyQuotaName) {
    MonthlyQuotaName["QUERIES"] = "queries";
    MonthlyQuotaName["AUTOMATIONS"] = "automations";
    MonthlyQuotaName["BUDIBASE_AI_CREDITS"] = "budibaseAICredits";
})(MonthlyQuotaName || (exports.MonthlyQuotaName = MonthlyQuotaName = {}));
var ConstantQuotaName;
(function (ConstantQuotaName) {
    ConstantQuotaName["AUTOMATION_LOG_RETENTION_DAYS"] = "automationLogRetentionDays";
    ConstantQuotaName["APP_BACKUPS_RETENTION_DAYS"] = "appBackupRetentionDays";
})(ConstantQuotaName || (exports.ConstantQuotaName = ConstantQuotaName = {}));
const isStaticQuota = (quotaType, usageType, name) => {
    return quotaType === QuotaType.USAGE && usageType === QuotaUsageType.STATIC;
};
exports.isStaticQuota = isStaticQuota;
const isMonthlyQuota = (quotaType, usageType, name) => {
    return quotaType === QuotaType.USAGE && usageType === QuotaUsageType.MONTHLY;
};
exports.isMonthlyQuota = isMonthlyQuota;
const isConstantQuota = (quotaType, name) => {
    return quotaType === QuotaType.CONSTANT;
};
exports.isConstantQuota = isConstantQuota;
