import { QuotaUsage } from "../../documents"

export interface GetLicenseRequest {
  quotaUsage: QuotaUsage
}

export interface QuotaTriggeredRequest {
  percentage: number
  name: string
  resetDate?: string
}
