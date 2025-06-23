import { PublishStatusResponse } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface DeploymentEndpoints {
  getPublishStatus: () => Promise<PublishStatusResponse>
}

export const buildDeploymentEndpoints = (
  API: BaseAPIClient
): DeploymentEndpoints => ({
  getPublishStatus: async () => {
    return await API.get({
      url: "/api/deploy/status",
    })
  },
})
