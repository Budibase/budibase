import {
  GetGitHubStarsResponse,
  GetWorkspaceHomeMetricsResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface WorkspaceHomeEndpoints {
  getMetrics: () => Promise<GetWorkspaceHomeMetricsResponse>
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
