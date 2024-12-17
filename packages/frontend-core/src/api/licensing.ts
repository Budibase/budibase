import {
  ActivateLicenseKeyRequest,
  ActivateLicenseKeyResponse,
  ActivateOfflineLicenseTokenRequest,
  ActivateOfflineLicenseTokenResponse,
  GetLicenseKeyResponse,
  GetOfflineIdentifierResponse,
  GetOfflineLicenseTokenResponse,
  QuotaUsage,
  RefreshOfflineLicenseResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface LicensingEndpoints {
  activateLicenseKey: (
    licenseKey: string
  ) => Promise<ActivateLicenseKeyResponse>
  deleteLicenseKey: () => Promise<void>
  getLicenseKey: () => Promise<GetLicenseKeyResponse | void>
  activateOfflineLicense: (
    offlineLicenseToken: string
  ) => Promise<ActivateOfflineLicenseTokenResponse>
  deleteOfflineLicense: () => Promise<void>
  getOfflineLicense: () => Promise<GetOfflineLicenseTokenResponse | void>
  getOfflineLicenseIdentifier: () => Promise<GetOfflineIdentifierResponse>
  refreshLicense: () => Promise<RefreshOfflineLicenseResponse>
  getQuotaUsage: () => Promise<QuotaUsage>
}

export const buildLicensingEndpoints = (
  API: BaseAPIClient
): LicensingEndpoints => ({
  // LICENSE KEY
  activateLicenseKey: async licenseKey => {
    return API.post<ActivateLicenseKeyRequest, ActivateLicenseKeyResponse>({
      url: `/api/global/license/key`,
      body: { licenseKey },
    })
  },
  deleteLicenseKey: async () => {
    return API.delete({
      url: `/api/global/license/key`,
    })
  },
  getLicenseKey: async () => {
    try {
      return await API.get({
        url: "/api/global/license/key",
      })
    } catch (e: any) {
      if (e.status !== 404) {
        throw e
      }
    }
  },

  // OFFLINE LICENSE
  activateOfflineLicense: async offlineLicenseToken => {
    return API.post<
      ActivateOfflineLicenseTokenRequest,
      ActivateOfflineLicenseTokenResponse
    >({
      url: "/api/global/license/offline",
      body: {
        offlineLicenseToken,
      },
    })
  },
  deleteOfflineLicense: async () => {
    return API.delete({
      url: "/api/global/license/offline",
    })
  },
  getOfflineLicense: async () => {
    try {
      return await API.get({
        url: "/api/global/license/offline",
      })
    } catch (e: any) {
      if (e.status !== 404) {
        throw e
      }
    }
  },
  getOfflineLicenseIdentifier: async () => {
    return await API.get({
      url: "/api/global/license/offline/identifier",
    })
  },

  /**
   * Refreshes the license cache
   */
  refreshLicense: async () => {
    return API.post({
      url: "/api/global/license/refresh",
    })
  },
  /**
   * Retrieve the usage information for the tenant
   */
  getQuotaUsage: async () => {
    return API.get({
      url: "/api/global/license/usage",
    })
  },
})
