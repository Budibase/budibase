import {
  WorkspaceFavouriteResponse,
  AddWorkspaceFavouriteResponse,
  AddWorkspaceFavouriteRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface WorkspaceFavouriteEndpoints {
  fetch: () => Promise<WorkspaceFavouriteResponse>
  create: (
    favourite: AddWorkspaceFavouriteRequest
  ) => Promise<AddWorkspaceFavouriteResponse>
  delete: (id: string, rev: string) => Promise<void>
}

// Add a workspace.favourite qualifier?
export const buildWorkspaceFavouriteEndpoints = (
  API: BaseAPIClient
): WorkspaceFavouriteEndpoints => ({
  fetch: async () => {
    return await API.get({
      url: "/api/workspace/favourites",
    })
  },
  create: async favourite => {
    return await API.post({
      url: "/api/workspace/favourites",
      body: favourite,
    })
  },
  delete: async (id, rev) => {
    return await API.delete({
      url: `/api/workspace/favourites/${id}/${rev}`,
    })
  },
})
