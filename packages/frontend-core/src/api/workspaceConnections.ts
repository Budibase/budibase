import {
  FetchWorkspaceConnectionsResponse,
  CreateWorkspaceConnectionRequest,
  CreateWorkspaceConnectionResponse,
  WorkspaceConnectionResponse,
  UpdateWorkspaceConnectionRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface WorkspaceConnectionEndpoints {
  fetch: () => Promise<FetchWorkspaceConnectionsResponse["connections"]>
  create: (
    connection: CreateWorkspaceConnectionRequest
  ) => Promise<WorkspaceConnectionResponse>
  update: (
    connection: UpdateWorkspaceConnectionRequest
  ) => Promise<WorkspaceConnectionResponse>
  delete: (id: string, rev: string) => Promise<void>
}

export const buildWorkspaceConnectionEndpoints = (
  API: BaseAPIClient
): WorkspaceConnectionEndpoints => ({
  fetch: async () => {
    return (
      await API.get<FetchWorkspaceConnectionsResponse>({
        url: `/api/workspace/connections`,
      })
    ).connections
  },

  create: async connection => {
    return (
      await API.post<
        CreateWorkspaceConnectionRequest,
        CreateWorkspaceConnectionResponse
      >({
        url: `/api/workspace/connections`,
        body: connection,
      })
    ).connection
  },

  update: async connection => {
    return (
      await API.put<
        UpdateWorkspaceConnectionRequest,
        CreateWorkspaceConnectionResponse
      >({
        url: `/api/workspace/connections/${connection._id}`,
        body: connection,
      })
    ).connection
  },

  delete: async (id, rev) => {
    return await API.delete<void, void>({
      url: `/api/workspace/connections/${id}/${rev}`,
    })
  },
})
