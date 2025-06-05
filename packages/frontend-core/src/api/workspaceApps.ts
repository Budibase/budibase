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
    return await API.get({
      url: "/api/workspaceApp",
    })
  },
  create: async workspaceApp => {
    return await API.post({
      url: "/api/workspaceApp",
      body: workspaceApp,
    })
  },
  update: async workspaceApp => {
    return await API.put({
      url: `/api/workspaceApp/${workspaceApp._id}`,
      body: workspaceApp,
    })
  },

  delete: async (id, rev) => {
    return await API.delete({
      url: `/api/workspaceApp/${id}/${rev}`,
    })
  },
})
