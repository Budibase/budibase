import {
  ContextUser,
  UpdateSelfRequest,
  UpdateSelfResponse,
  User,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface SelfEndpoints {
  updateSelf: (user: UpdateSelfRequest) => Promise<UpdateSelfResponse>

  // Missing request or response types
  generateAPIKey: () => Promise<any>
  fetchDeveloperInfo: () => Promise<any>

  // There are flags and session attributes mixed in to the user
  fetchBuilderSelf: () => Promise<User & { [key: string]: any }>
  fetchSelf: () => Promise<(ContextUser | {}) & { [key: string]: any }>
}

export const buildSelfEndpoints = (API: BaseAPIClient): SelfEndpoints => ({
  /**
   * Using the logged in user, this will generate a new API key,
   * assuming the user is a builder.
   */
  generateAPIKey: async () => {
    const response = await API.post<null, any>({
      url: "/api/global/self/api_key",
    })
    return response?.apiKey
  },

  /**
   * retrieves the API key for the logged in user.
   */
  fetchDeveloperInfo: async () => {
    return API.get({
      url: "/api/global/self/api_key",
    })
  },

  /**
   * Fetches the currently logged-in user object.
   * Used in client apps.
   */
  fetchSelf: async () => {
    return await API.get({
      url: "/api/self",
    })
  },

  /**
   * Fetches the currently logged-in user object.
   * Used in the builder.
   */
  fetchBuilderSelf: async () => {
    return await API.get({
      url: "/api/global/self",
    })
  },

  /**
   * Updates the current logged-in user.
   * @param user the new user object to save
   */
  updateSelf: async user => {
    return await API.post({
      url: "/api/global/self",
      body: user,
    })
  },
})
