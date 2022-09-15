import { PlanType } from "."

export enum QuotaUsageType {
  STATIC = "static",
  MONTHLY = "monthly",
}

export enum QuotaType {
  USAGE = "usage",
  CONSTANT = "constant",
}

export enum StaticQuotaName {
  ROWS = "rows",
  APPS = "apps",
}

export enum MonthlyQuotaName {
  QUERIES = "queries",
  AUTOMATIONS = "automations",
  DAY_PASSES = "dayPasses",
}

export enum ConstantQuotaName {
  QUERY_TIMEOUT_SECONDS = "queryTimeoutSeconds",
  AUTOMATION_LOG_RETENTION_DAYS = "automationLogRetentionDays",
}

export type QuotaName = StaticQuotaName | MonthlyQuotaName | ConstantQuotaName

export const isStaticQuota = (
  quotaType: QuotaType,
  usageType: QuotaUsageType,
  name: QuotaName
): name is StaticQuotaName => {
  return quotaType === QuotaType.USAGE && usageType === QuotaUsageType.STATIC
}

export const isMonthlyQuota = (
  quotaType: QuotaType,
  usageType: QuotaUsageType,
  name: QuotaName
): name is MonthlyQuotaName => {
  return quotaType === QuotaType.USAGE && usageType === QuotaUsageType.MONTHLY
}

export const isConstantQuota = (
  quotaType: QuotaType,
  name: QuotaName
): name is ConstantQuotaName => {
  return quotaType === QuotaType.CONSTANT
}

export type PlanQuotas = {
  [PlanType.FREE]: Quotas
  [PlanType.PRO]: Quotas
  [PlanType.BUSINESS]: Quotas
  [PlanType.ENTERPRISE]: Quotas
}

export type Quotas = {
  [QuotaType.USAGE]: {
    [QuotaUsageType.MONTHLY]: {
      [MonthlyQuotaName.QUERIES]: Quota
      [MonthlyQuotaName.AUTOMATIONS]: Quota
      [MonthlyQuotaName.DAY_PASSES]: Quota
    }
    [QuotaUsageType.STATIC]: {
      [StaticQuotaName.ROWS]: Quota
      [StaticQuotaName.APPS]: Quota
    }
  }
  [QuotaType.CONSTANT]: {
    [ConstantQuotaName.QUERY_TIMEOUT_SECONDS]: Quota
    [ConstantQuotaName.AUTOMATION_LOG_RETENTION_DAYS]: Quota
  }
}

export interface Quota {
  name: string
  value: number
}
