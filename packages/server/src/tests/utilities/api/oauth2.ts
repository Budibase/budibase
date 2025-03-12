import {
  CreateOAuth2ConfigRequest,
  FetchOAuth2ConfigsResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class OAuth2API extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchOAuth2ConfigsResponse>("/api/oauth2", {
      expectations,
    })
  }

  create = async (
    body: CreateOAuth2ConfigRequest,
    expectations?: Expectations
  ) => {
    return await this._post<CreateOAuth2ConfigRequest>("/api/oauth2", {
      body,
      expectations: {
        status: expectations?.status ?? 201,
        ...expectations,
      },
    })
  }
}
