import {
  CreateWorkspaceConnectionRequest,
  CreateWorkspaceConnectionResponse,
  FetchWorkspaceConnectionsResponse,
  UpdateWorkspaceConnectionRequest,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class WorkspaceConnectionAPI extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchWorkspaceConnectionsResponse>(
      "/api/workspace/connections",
      { expectations }
    )
  }

  create = async (
    body: CreateWorkspaceConnectionRequest,
    expectations?: Expectations
  ) => {
    return await this._post<CreateWorkspaceConnectionResponse>(
      "/api/workspace/connections",
      {
        body,
        expectations: {
          status: expectations?.status ?? 201,
          ...expectations,
        },
      }
    )
  }

  update = async (
    body: UpdateWorkspaceConnectionRequest,
    expectations?: Expectations
  ) => {
    return await this._put<CreateWorkspaceConnectionResponse>(
      `/api/workspace/connections/${body._id}`,
      {
        body,
        expectations,
      }
    )
  }

  remove = async (id: string, rev: string, expectations?: Expectations) => {
    return await this._delete<void>(`/api/workspace/connections/${id}/${rev}`, {
      expectations: {
        status: expectations?.status ?? 204,
        ...expectations,
      },
    })
  }
}
