// LICENSE KEY

export interface ActivateLicenseKeyRequest {
  licenseKey: string
}

export interface GetLicenseKeyResponse {
  licenseKey: string,
}

// OFFLINE LICENSE

export interface ActivateOfflineLicenseRequest {
  offlineLicense: string
}

export interface GetOfflineLicenseResponse {
  offlineLicense: string
}
