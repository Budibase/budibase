import {
  FetchWorkspaceAppResponse,
  FindWorkspaceAppResponse,
  InsertWorkspaceAppRequest,
  InsertWorkspaceAppResponse,
  UpdateWorkspaceAppRequest,
  UpdateWorkspaceAppResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface WorkspaceAppEndpoints {
  find: (id: string) => Promise<FindWorkspaceAppResponse>
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
  find: async id => {
    return await API.get({
      url: `/api/workspaceApp/${id}`,
    })
  },
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
