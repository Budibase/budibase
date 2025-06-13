import {
  InsertOAuth2ConfigRequest,
  InsertOAuth2ConfigResponse,
  FetchOAuth2ConfigsResponse,
  UpdateOAuth2ConfigRequest,
  UpdateOAuth2ConfigResponse,
  ValidateConfigRequest,
  ValidateConfigResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class OAuth2API extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchOAuth2ConfigsResponse>("/api/oauth2", {
      expectations,
    })
  }

  create = async (
    body: InsertOAuth2ConfigRequest,
    expectations?: Expectations
  ) => {
    return await this._post<InsertOAuth2ConfigResponse>("/api/oauth2", {
      body,
      expectations: {
        status: expectations?.status ?? 201,
        ...expectations,
      },
    })
  }

  update = async (
    body: UpdateOAuth2ConfigRequest,
    expectations?: Expectations
  ) => {
    return await this._put<UpdateOAuth2ConfigResponse>(
      `/api/oauth2/${body._id}`,
      {
        body,
        expectations,
      }
    )
  }

  delete = async (id: string, rev: string, expectations?: Expectations) => {
    return await this._delete<void>(`/api/oauth2/${id}/${rev}`, {
      expectations,
    })
  }

  validate = async (
    body: ValidateConfigRequest,
    expectations?: Expectations
  ) => {
    return await this._post<ValidateConfigResponse>("/api/oauth2/validate", {
      body,
      expectations,
    })
  }
}
