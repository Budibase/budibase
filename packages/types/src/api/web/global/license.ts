// LICENSE KEY

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
