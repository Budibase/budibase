import { Expectations, TestAPI } from "./base"

export class OAuth2API extends TestAPI {
  fetch = async (expectations?: Expectations): Promise<void> => {
    return await this._get<void>("/api/oauth2", {
      expectations,
    })
  }
}
