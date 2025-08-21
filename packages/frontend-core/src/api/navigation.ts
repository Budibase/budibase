import { BaseAPIClient } from "./types"
import { UpdateNavigationRequest } from "@budibase/types"

export interface NavigationEndpoints {
  updateNavigation: (
    appId: string,
    navigation: UpdateNavigationRequest
  ) => Promise<void>
}

export const buildNavigationEndpoints = (
  API: BaseAPIClient
): NavigationEndpoints => ({
  updateNavigation: async (
    appId: string,
    navigation: UpdateNavigationRequest
  ) => {
    return await API.put<UpdateNavigationRequest>({
      url: `/api/navigation/${appId}`,
      body: navigation,
    })
  },
})
