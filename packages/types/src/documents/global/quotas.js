"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BREAKDOWN_QUOTA_NAMES = exports.APP_QUOTA_NAMES = exports.BreakdownQuotaName = void 0;
const sdk_1 = require("../../sdk");
var BreakdownQuotaName;
(function (BreakdownQuotaName) {
    BreakdownQuotaName["ROW_QUERIES"] = "rowQueries";
    BreakdownQuotaName["DATASOURCE_QUERIES"] = "datasourceQueries";
    BreakdownQuotaName["AUTOMATIONS"] = "automations";
})(BreakdownQuotaName || (exports.BreakdownQuotaName = BreakdownQuotaName = {}));
exports.APP_QUOTA_NAMES = [
    sdk_1.StaticQuotaName.ROWS,
    sdk_1.MonthlyQuotaName.QUERIES,
    sdk_1.MonthlyQuotaName.AUTOMATIONS,
];
exports.BREAKDOWN_QUOTA_NAMES = [
    sdk_1.MonthlyQuotaName.QUERIES,
    sdk_1.MonthlyQuotaName.AUTOMATIONS,
];
