import { Expectations, TestAPI } from "./base"
import { CreatePluginRequest, CreatePluginResponse } from "@budibase/types"

export class PluginAPI extends TestAPI {
  create = async (body: CreatePluginRequest, expectations?: Expectations) => {
    return await this._post<CreatePluginResponse>(`/api/plugin`, {
      body,
      expectations,
    })
  }
}
