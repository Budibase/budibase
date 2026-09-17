import { FetchDeploymentResponse, PublishStatusResponse } from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class DeployAPI extends TestAPI {
  publishStatus = async (expectations?: Expectations) => {
    return await this._get<PublishStatusResponse>("/api/deploy/status", {
      expectations,
    })
  }

  fetchDeployments = async (
    opts?: { page?: number; limit?: number },
    expectations?: Expectations
  ) => {
    return await this._get<FetchDeploymentResponse>("/api/deployments", {
      query: {
        page: opts?.page !== undefined ? String(opts.page) : undefined,
        limit: opts?.limit !== undefined ? String(opts.limit) : undefined,
      },
      expectations,
    })
  }
}
