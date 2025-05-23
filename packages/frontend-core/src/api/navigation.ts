import { BaseAPIClient } from "./types"
import { AppNavigation, UpdateNavigationRequest } from "@budibase/types"

export interface NavigationEndpoints {
  updateNavigation: (appId: string, navigation: AppNavigation) => Promise<void>
}

export const buildNavigationEndpoints = (
  API: BaseAPIClient
): NavigationEndpoints => ({
  updateNavigation: async (appId: string, navigation: AppNavigation) => {
    return await API.put<UpdateNavigationRequest>({
      url: `/api/navigation/${appId}`,
      body: { navigation },
    })
  },
})
