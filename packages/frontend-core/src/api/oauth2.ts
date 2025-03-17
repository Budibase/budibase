import {
  FetchOAuth2ConfigsResponse,
  OAuth2ConfigResponse,
  UpsertOAuth2ConfigRequest,
  UpsertOAuth2ConfigResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface OAuth2Endpoints {
  fetch: () => Promise<OAuth2ConfigResponse[]>
  create: (
    config: UpsertOAuth2ConfigRequest
  ) => Promise<UpsertOAuth2ConfigResponse>
  delete: (id: string) => Promise<void>
}

export const buildOAuth2Endpoints = (API: BaseAPIClient): OAuth2Endpoints => ({
  /**
   * Gets all OAuth2 configurations for the app.
   */
  fetch: async () => {
    return (
      await API.get<FetchOAuth2ConfigsResponse>({
        url: `/api/oauth2`,
      })
    ).configs
  },

  /**
   * Creates a OAuth2 configuration.
   * @param name the name of the row action
   * @param tableId the ID of the table
   */
  create: async config => {
    return await API.post<
      UpsertOAuth2ConfigRequest,
      UpsertOAuth2ConfigResponse
    >({
      url: `/api/oauth2`,
      body: {
        ...config,
      },
    })
  },

  /**
   * Deletes an OAuth2 configuration by its id.
   * @param id the ID of the OAuth2 config
   */
  delete: async id => {
    return await API.delete<void, void>({
      url: `/api/oauth2/${id}`,
    })
  },
})
