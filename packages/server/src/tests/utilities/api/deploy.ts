import { PublishStatusResponse } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class DeployAPI extends TestAPI {
  publishStatus = async (expectations?: Expectations) => {
    return await this._get<PublishStatusResponse>("/api/deploy/status", {
      expectations,
    })
  }
}
