import { OverrideFeatureFlagRequest } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface FeatureFlagEndpoints {
  overrideFeatureFlags: (flags: Record<string, boolean>) => Promise<void>
}

export const buildFeatureFlagEndpoints = (
  API: BaseAPIClient
): FeatureFlagEndpoints => ({
  overrideFeatureFlags: async flags => {
    const body: OverrideFeatureFlagRequest = { flags }
    return await API.patch({
      url: "/api/features",
      body,
      parseResponse: () => {},
    })
  },
})
