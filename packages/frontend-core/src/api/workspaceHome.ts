import {
  GetWorkspaceHomeChatsResponse,
  GetGitHubStarsResponse,
  GetWorkspaceHomeMetricsResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface WorkspaceHomeEndpoints {
  getMetrics: () => Promise<GetWorkspaceHomeMetricsResponse>
  getChats: () => Promise<GetWorkspaceHomeChatsResponse>
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
  getChats: async () => {
    return await API.get({
      url: "/api/workspace/home/chats",
    })
  },
  getGitHubStars: async () => {
    return await API.get({
      url: "/api/global/github/stars",
    })
  },
})
