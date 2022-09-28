import { MonthlyQuotaName, StaticQuotaName } from "../../sdk"

export enum BreakdownQuotaName {
  ROW_QUERIES = "rowQueries",
  DATASOURCE_QUERIES = "datasourceQueries",
  AUTOMATIONS = "automations",
}

export const StoredByAppQuotaNames = [
  StaticQuotaName.ROWS,
  MonthlyQuotaName.QUERIES,
  MonthlyQuotaName.AUTOMATIONS,
]

export const NamesToBreakdown = [
  MonthlyQuotaName.QUERIES,
  MonthlyQuotaName.AUTOMATIONS,
]

export interface Breakdown {
  parent: MonthlyQuotaName
  values: {
    [key: string]: number
  }
}

export type Monthly = {
  [MonthlyQuotaName.QUERIES]: number
  [MonthlyQuotaName.AUTOMATIONS]: number
  [MonthlyQuotaName.DAY_PASSES]: number
  breakdown?: {
    [key in BreakdownQuotaName]?: Breakdown
  }
}

export interface UsageInternal {
  usageQuota: {
    [key in StaticQuotaName]: number
  }
  monthly: {
    [key: string]: Monthly
  }
}

export interface QuotaUsage extends UsageInternal {
  _id: string
  _rev?: string
  quotaReset: string
  apps?: {
    [key: string]: UsageInternal
  }
}

export type QuotaValues = {
  total: number
  app?: number
  breakdown?: number
}
