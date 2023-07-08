// LICENSE KEY

export interface ActivateLicenseKeyRequest {
  licenseKey: string
}

export interface GetLicenseKeyResponse {
  licenseKey: string,
}

// OFFLINE LICENSE

export interface ActivateOfflineLicenseRequest {
  offlineLicenseToken: string
}

export interface GetOfflineLicenseResponse {
  offlineLicenseToken: string
}

// IDENTIFIER

export interface GetOfflineIdentifierResponse {
  identifierBase64: string
}
