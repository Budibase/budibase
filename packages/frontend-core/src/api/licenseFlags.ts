import { BaseAPIClient } from "./types"

export interface LicenseFlagEndpoints {
  overrideLicenseFlags: (features: Record<string, boolean>) => Promise<void>
}

export const buildLicenseFlagEndpoints = (
  API: BaseAPIClient
): LicenseFlagEndpoints => ({
  overrideLicenseFlags: async features => {
    return await API.patch({
      url: "/api/license-flags",
      body: { features },
      parseResponse: () => {},
    })
  },
})
