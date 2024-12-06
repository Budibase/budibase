// LICENSE KEY

import { QuotaUsage } from "../../../documents"

export interface ActivateLicenseKeyRequest {
  licenseKey: string
}

export interface GetLicenseKeyResponse {
  licenseKey: string
}

// OFFLINE LICENSE

export interface ActivateOfflineLicenseTokenRequest {
  offlineLicenseToken: string
}

export interface GetOfflineLicenseTokenResponse {
  offlineLicenseToken: string
}

// IDENTIFIER

export interface GetOfflineIdentifierResponse {
  identifierBase64: string
}

export interface GetQuotaUsageResponse extends QuotaUsage {}
