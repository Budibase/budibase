import {
  GetGitHubStarsResponse,
  GetTenantMetricsResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface WorkspaceHomeEndpoints {
  getMetrics: () => Promise<GetTenantMetricsResponse>
  getGitHubStars: () => Promise<GetGitHubStarsResponse>
}

export const buildWorkspaceHomeEndpoints = (
  API: BaseAPIClient
): WorkspaceHomeEndpoints => ({
  getMetrics: async () => {
    return await API.get({
      url: "/api/workspace/home/metrics",
    })
  },
  getGitHubStars: async () => {
    return await API.get({
      url: "/api/global/github/stars",
    })
  },
})
