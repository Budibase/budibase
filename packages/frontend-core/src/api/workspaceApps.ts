import {
  FetchWorkspaceAppResponse,
  InsertWorkspaceAppRequest,
  InsertWorkspaceAppResponse,
  UpdateWorkspaceAppRequest,
  UpdateWorkspaceAppResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface WorkspaceAppEndpoints {
  fetch: () => Promise<FetchWorkspaceAppResponse>
  create: (
    workspaceApp: InsertWorkspaceAppRequest
  ) => Promise<InsertWorkspaceAppResponse>
  update: (
    workspaceApp: UpdateWorkspaceAppRequest
  ) => Promise<UpdateWorkspaceAppResponse>
  delete: (id: string, rev: string) => Promise<void>
}

export const buildWorkspaceAppEndpoints = (
  API: BaseAPIClient
): WorkspaceAppEndpoints => ({
  fetch: async () => {
    const result = await API.get<FetchWorkspaceAppResponse>({
      url: "/api/workspaceApp",
    })
    return result
  },
  create: async workspaceApp => {
    const result = await API.post<
      InsertWorkspaceAppRequest,
      InsertWorkspaceAppResponse
    >({
      url: "/api/workspaceApp",
      body: workspaceApp,
    })
    return result
  },
  update: async workspaceApp => {
    const result = await API.put<
      UpdateWorkspaceAppRequest,
      UpdateWorkspaceAppResponse
    >({
      url: `/api/workspaceApp/${workspaceApp._id}`,
      body: workspaceApp,
    })
    return result
  },

  delete: async (id, rev) => {
    return await API.delete({
      url: `/api/screens/${id}/${rev}`,
    })
  },
})
