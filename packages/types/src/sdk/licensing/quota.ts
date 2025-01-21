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
  USERS = "users",
  CREATORS = "creators",
  USER_GROUPS = "userGroups",
  PLUGINS = "plugins",
  AI_CUSTOM_CONFIGS = "aiCustomConfigs",
}

export enum MonthlyQuotaName {
  QUERIES = "queries",
  AUTOMATIONS = "automations",
  BUDIBASE_AI_CREDITS = "budibaseAICredits",
}

export enum ConstantQuotaName {
  AUTOMATION_LOG_RETENTION_DAYS = "automationLogRetentionDays",
  APP_BACKUPS_RETENTION_DAYS = "appBackupRetentionDays",
}

export type MeteredQuotaName = StaticQuotaName | MonthlyQuotaName
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

export type PlanQuotas = { [key in PlanType]: Quotas | undefined }

export type MonthlyQuotas = {
  [MonthlyQuotaName.QUERIES]: Quota
  [MonthlyQuotaName.AUTOMATIONS]: Quota
  [MonthlyQuotaName.BUDIBASE_AI_CREDITS]: Quota
}

export type StaticQuotas = {
  [StaticQuotaName.ROWS]: Quota
  [StaticQuotaName.APPS]: Quota
  [StaticQuotaName.USERS]: Quota
  [StaticQuotaName.CREATORS]: Quota
  [StaticQuotaName.USER_GROUPS]: Quota
  [StaticQuotaName.PLUGINS]: Quota
  [StaticQuotaName.AI_CUSTOM_CONFIGS]: Quota
}

export type ConstantQuotas = {
  [ConstantQuotaName.AUTOMATION_LOG_RETENTION_DAYS]: Quota
  [ConstantQuotaName.APP_BACKUPS_RETENTION_DAYS]: Quota
}

export type Quotas = {
  [QuotaType.USAGE]: {
    [QuotaUsageType.MONTHLY]: MonthlyQuotas
    [QuotaUsageType.STATIC]: StaticQuotas
  }
  [QuotaType.CONSTANT]: ConstantQuotas
}

export interface Quota {
  name: string
  value: number
  /**
   * Array of whole numbers (1-100) that dictate the percentage that this quota should trigger
   * at in relation to the corresponding usage inside budibase.
   *
   * Triggering results in a budibase installation sending a request to account-portal,
   * which can have subsequent effects such as sending emails to users.
   */
  triggers: number[]
  startDate?: number
}
