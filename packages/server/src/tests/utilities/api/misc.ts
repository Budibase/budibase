import { AnalyticsEnabledResponse } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class MiscAPI extends TestAPI {
  health = async (expectations?: Expectations) => {
    return await this._get<void>("/health", { expectations })
  }

  version = async (expectations?: Expectations) => {
    return (await this._requestRaw("get", "/version", { expectations })).text
  }

  bbtel = async (expectations?: Expectations) => {
    return await this._get<AnalyticsEnabledResponse>("/api/bbtel", {
      expectations,
    })
  }
}
