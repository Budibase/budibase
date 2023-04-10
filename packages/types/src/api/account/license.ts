import { QuotaUsage } from "../../documents"

export interface GetLicenseRequest {
  // All fields should be optional to cater for
  // historical versions of budibase
  quotaUsage?: QuotaUsage
  install: {
    id: string,
    tenantId: string,
    version: string
  }
}

export interface QuotaTriggeredRequest {
  percentage: number
  name: string
  resetDate?: string
}

export interface LicenseActivateRequest {
  installVersion?: string
}
