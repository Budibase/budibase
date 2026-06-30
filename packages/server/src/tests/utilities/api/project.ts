import {
  CreateProjectRequest,
  CreateProjectResponse,
  FetchProjectsResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class ProjectAPI extends TestAPI {
  fetch = async (expectations?: Expectations) => {
    return await this._get<FetchProjectsResponse>("/api/projects", {
      expectations,
    })
  }

  create = async (
    project: CreateProjectRequest,
    expectations?: Expectations
  ) => {
    return await this._post<CreateProjectResponse>("/api/projects", {
      body: project,
      expectations: {
        status: 201,
        ...expectations,
      },
    })
  }

  update = async (
    project: UpdateProjectRequest,
    expectations?: Expectations
  ) => {
    return await this._put<UpdateProjectResponse>(
      `/api/projects/${project._id}`,
      {
        body: project,
        expectations,
      }
    )
  }

  delete = async (id: string, rev: string, expectations?: Expectations) => {
    return await this._delete<void>(`/api/projects/${id}/${rev}`, {
      expectations: {
        status: 204,
        ...expectations,
      },
    })
  }
}
