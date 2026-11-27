import { LicenseOverrides, QuotaUsage } from "../../documents"
import { Hosting, License, OfflineLicense, PlanType } from "../../sdk"
import { ISO8601 } from "../../shared"

export interface GetLicenseRequest {
  // All fields should be optional to cater for
  // historical versions of budibase
  quotaUsage?: QuotaUsage
  tenantId?: string
  install: {
    id: string
    tenantId: string
    version: string
  }
}

export interface GetLicenseByKeyResponse extends License {
  hosting?: Hosting
}

export interface QuotaTriggeredRequest {
  percentage: number
  name: string
  resetDate?: string
}

export interface LicenseActivateRequest {
  installVersion: string
  installId: string
}

export interface UpdateLicenseRequest {
  planType?: PlanType
  overrides?: LicenseOverrides
}

export interface CreateOfflineLicenseRequest {
  installationIdentifierBase64: string
  expireAt: ISO8601
}

export interface GetOfflineLicenseResponse {
  offlineLicenseToken: string
  license: OfflineLicense
}
