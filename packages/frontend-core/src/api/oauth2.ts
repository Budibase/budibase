import {
  FetchOAuth2ConfigsResponse,
  InsertOAuth2ConfigRequest,
  InsertOAuth2ConfigResponse,
  UpdateOAuth2ConfigRequest,
  UpdateOAuth2ConfigResponse,
  ValidateConfigRequest,
  ValidateConfigResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface OAuth2Endpoints {
  fetch: () => Promise<FetchOAuth2ConfigsResponse["configs"]>
  create: (
    config: InsertOAuth2ConfigRequest
  ) => Promise<InsertOAuth2ConfigResponse>
  update: (
    config: UpdateOAuth2ConfigRequest
  ) => Promise<UpdateOAuth2ConfigResponse>
  delete: (id: string, rev: string) => Promise<void>
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
      InsertOAuth2ConfigRequest,
      InsertOAuth2ConfigResponse
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
  update: async config => {
    return await API.put<UpdateOAuth2ConfigRequest, UpdateOAuth2ConfigResponse>(
      {
        url: `/api/oauth2/${config._id}`,
        body: {
          ...config,
        },
      }
    )
  },

  /**
   * Deletes an OAuth2 configuration by its id.
   * @param id the ID of the OAuth2 config
   * @param rev the rev of the OAuth2 config
   */
  delete: async (id, rev) => {
    return await API.delete<void, void>({
      url: `/api/oauth2/${id}/${rev}`,
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
