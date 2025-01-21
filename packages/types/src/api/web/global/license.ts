// LICENSE KEY

import { QuotaUsage } from "../../../documents"

export interface ActivateLicenseKeyRequest {
  licenseKey: string
}
export interface ActivateLicenseKeyResponse {
  message: string
}

export interface GetLicenseKeyResponse {
  licenseKey: string
}

// OFFLINE LICENSE

export interface ActivateOfflineLicenseTokenRequest {
  offlineLicenseToken: string
}
export interface ActivateOfflineLicenseTokenResponse {
  message: string
}

export interface GetOfflineLicenseTokenResponse {
  offlineLicenseToken: string
}

// REFRESH

export interface RefreshOfflineLicenseResponse {
  message: string
}

// IDENTIFIER

export interface GetOfflineIdentifierResponse {
  identifierBase64: string
}

export interface GetQuotaUsageResponse extends QuotaUsage {}
