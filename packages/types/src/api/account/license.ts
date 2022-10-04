import { QuotaUsage } from "../../documents"

export interface GetLicenseRequest {
  quotaUsage: QuotaUsage
}

export interface QuotaUsageTriggeredRequest {
  percentage: number
  name: string
  resetDate: string
}
