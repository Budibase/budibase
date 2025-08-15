import {
  FetchWorkspaceAppResponse,
  FindWorkspaceAppResponse,
  InsertWorkspaceAppRequest,
  InsertWorkspaceAppResponse,
  UpdateWorkspaceAppRequest,
  UpdateWorkspaceAppResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class WorkspaceAppAPI extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchWorkspaceAppResponse>("/api/workspaceApp", {
      expectations: {
        status: 200,
        ...expectations,
      },
    })
  }

  create = async (
    app: InsertWorkspaceAppRequest,
    expectations?: Expectations
  ) => {
    return await this._post<InsertWorkspaceAppResponse>("/api/workspaceApp", {
      body: app,
      expectations: {
        status: 201,
        ...expectations,
      },
    })
  }

  update = async (
    app: UpdateWorkspaceAppRequest,
    expectations?: Expectations
  ) => {
    return await this._put<UpdateWorkspaceAppResponse>(
      `/api/workspaceApp/${app._id}`,
      {
        body: app,
        expectations,
      }
    )
  }

  find = async (id: string, expectations?: Expectations) => {
    return await this._get<FindWorkspaceAppResponse>(
      `/api/workspaceApp/${id}`,
      {
        expectations: {
          status: 200,
          ...expectations,
        },
      }
    )
  }
}
