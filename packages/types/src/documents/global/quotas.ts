import { MonthlyQuotaName, StaticQuotaName } from "../../sdk"

export interface QuotaUsage {
  _id: string
  _rev?: string
  quotaReset: string
  usageQuota: {
    [key in StaticQuotaName]: number
  }
  monthly: {
    [key: string]: {
      [key in MonthlyQuotaName]: number
    }
  }
}
