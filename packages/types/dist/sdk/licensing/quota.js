"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConstantQuota = exports.isMonthlyQuota = exports.isStaticQuota = exports.ConstantQuotaName = exports.MonthlyQuotaName = exports.StaticQuotaName = exports.QuotaType = exports.QuotaUsageType = void 0;
const _1 = require(".");
var QuotaUsageType;
(function (QuotaUsageType) {
    QuotaUsageType["STATIC"] = "static";
    QuotaUsageType["MONTHLY"] = "monthly";
})(QuotaUsageType = exports.QuotaUsageType || (exports.QuotaUsageType = {}));
var QuotaType;
(function (QuotaType) {
    QuotaType["USAGE"] = "usage";
    QuotaType["CONSTANT"] = "constant";
})(QuotaType = exports.QuotaType || (exports.QuotaType = {}));
var StaticQuotaName;
(function (StaticQuotaName) {
    StaticQuotaName["ROWS"] = "rows";
    StaticQuotaName["APPS"] = "apps";
})(StaticQuotaName = exports.StaticQuotaName || (exports.StaticQuotaName = {}));
var MonthlyQuotaName;
(function (MonthlyQuotaName) {
    MonthlyQuotaName["QUERIES"] = "queries";
    MonthlyQuotaName["AUTOMATIONS"] = "automations";
    MonthlyQuotaName["DAY_PASSES"] = "dayPasses";
})(MonthlyQuotaName = exports.MonthlyQuotaName || (exports.MonthlyQuotaName = {}));
var ConstantQuotaName;
(function (ConstantQuotaName) {
    ConstantQuotaName["QUERY_TIMEOUT_SECONDS"] = "queryTimeoutSeconds";
    ConstantQuotaName["AUTOMATION_LOG_RETENTION_DAYS"] = "automationLogRetentionDays";
})(ConstantQuotaName = exports.ConstantQuotaName || (exports.ConstantQuotaName = {}));
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
//# sourceMappingURL=quota.js.map