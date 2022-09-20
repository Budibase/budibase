import { PlanType } from ".";
export declare enum QuotaUsageType {
    STATIC = "static",
    MONTHLY = "monthly"
}
export declare enum QuotaType {
    USAGE = "usage",
    CONSTANT = "constant"
}
export declare enum StaticQuotaName {
    ROWS = "rows",
    APPS = "apps"
}
export declare enum MonthlyQuotaName {
    QUERIES = "queries",
    AUTOMATIONS = "automations",
    DAY_PASSES = "dayPasses"
}
export declare enum ConstantQuotaName {
    QUERY_TIMEOUT_SECONDS = "queryTimeoutSeconds",
    AUTOMATION_LOG_RETENTION_DAYS = "automationLogRetentionDays"
}
export declare type QuotaName = StaticQuotaName | MonthlyQuotaName | ConstantQuotaName;
export declare const isStaticQuota: (quotaType: QuotaType, usageType: QuotaUsageType, name: QuotaName) => name is StaticQuotaName;
export declare const isMonthlyQuota: (quotaType: QuotaType, usageType: QuotaUsageType, name: QuotaName) => name is MonthlyQuotaName;
export declare const isConstantQuota: (quotaType: QuotaType, name: QuotaName) => name is ConstantQuotaName;
export declare type PlanQuotas = {
    [PlanType.FREE]: Quotas;
    [PlanType.PRO]: Quotas;
    [PlanType.BUSINESS]: Quotas;
    [PlanType.ENTERPRISE]: Quotas;
};
export declare type Quotas = {
    [QuotaType.USAGE]: {
        [QuotaUsageType.MONTHLY]: {
            [MonthlyQuotaName.QUERIES]: Quota;
            [MonthlyQuotaName.AUTOMATIONS]: Quota;
            [MonthlyQuotaName.DAY_PASSES]: Quota;
        };
        [QuotaUsageType.STATIC]: {
            [StaticQuotaName.ROWS]: Quota;
            [StaticQuotaName.APPS]: Quota;
        };
    };
    [QuotaType.CONSTANT]: {
        [ConstantQuotaName.QUERY_TIMEOUT_SECONDS]: Quota;
        [ConstantQuotaName.AUTOMATION_LOG_RETENTION_DAYS]: Quota;
    };
};
export interface Quota {
    name: string;
    value: number;
}
