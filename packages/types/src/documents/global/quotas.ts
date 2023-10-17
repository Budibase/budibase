import { MonthlyQuotaName, StaticQuotaName } from "../../sdk"

export enum BreakdownQuotaName {
  ROW_QUERIES = "rowQueries",
  DATASOURCE_QUERIES = "datasourceQueries",
  AUTOMATIONS = "automations",
}

export const APP_QUOTA_NAMES = [
  StaticQuotaName.ROWS,
  MonthlyQuotaName.QUERIES,
  MonthlyQuotaName.AUTOMATIONS,
]

export const BREAKDOWN_QUOTA_NAMES = [
  MonthlyQuotaName.QUERIES,
  MonthlyQuotaName.AUTOMATIONS,
]

export interface UsageBreakdown {
  parent: MonthlyQuotaName
  values: {
    [key: string]: number
  }
}

export type QuotaTriggers = {
  [key: string]: string | undefined
}

export interface StaticUsage {
  [StaticQuotaName.APPS]: number
  [StaticQuotaName.PLUGINS]: number
  [StaticQuotaName.USERS]: number
  [StaticQuotaName.USER_GROUPS]: number
  [StaticQuotaName.ROWS]: number
  triggers: {
    [key in StaticQuotaName]?: QuotaTriggers
  }
}

export interface MonthlyUsage {
  [MonthlyQuotaName.QUERIES]: number
  [MonthlyQuotaName.AUTOMATIONS]: number
  [MonthlyQuotaName.DAY_PASSES]: number
  triggers: {
    [key in MonthlyQuotaName]?: QuotaTriggers
  }
  breakdown?: {
    [key in BreakdownQuotaName]?: UsageBreakdown
  }
}

export interface BaseQuotaUsage {
  usageQuota: StaticUsage
  monthly: {
    [key: string]: MonthlyUsage
  }
}

export interface QuotaUsage extends BaseQuotaUsage {
  _id: string
  _rev?: string
  quotaReset: string
  apps?: {
    [key: string]: BaseQuotaUsage
  }
}

export type SetUsageValues = {
  total: number
  app?: number
  breakdown?: number
  triggers?: QuotaTriggers
}

export type UsageValues = {
  total: number
  app?: number
  breakdown?: number
}
