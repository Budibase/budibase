import {
  FetchOAuth2ConfigsResponse,
  OAuth2ConfigResponse,
  UpsertOAuth2ConfigRequest,
  UpsertOAuth2ConfigResponse,
  ValidateConfigRequest,
  ValidateConfigResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface OAuth2Endpoints {
  fetch: () => Promise<OAuth2ConfigResponse[]>
  create: (
    config: UpsertOAuth2ConfigRequest
  ) => Promise<UpsertOAuth2ConfigResponse>
  update: (
    id: string,
    config: UpsertOAuth2ConfigRequest
  ) => Promise<UpsertOAuth2ConfigResponse>
  delete: (id: string) => Promise<void>
  validate: (config: ValidateConfigRequest) => Promise<ValidateConfigResponse>
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
   * Updates an existing OAuth2 configuration.
   */
  update: async (id, config) => {
    return await API.put<UpsertOAuth2ConfigRequest, UpsertOAuth2ConfigResponse>(
      {
        url: `/api/oauth2/${id}`,
        body: {
          ...config,
        },
      }
    )
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
  validate: async function (
    config: ValidateConfigRequest
  ): Promise<ValidateConfigResponse> {
    return await API.post<ValidateConfigRequest, ValidateConfigResponse>({
      url: `/api/oauth2/validate`,
      body: {
        ...config,
      },
    })
  },
})
