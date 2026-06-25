import {
  CreateProjectRequest,
  CreateProjectResponse,
  ExportProjectRequest,
  FetchProjectsResponse,
  ImportProjectRequest,
  ImportProjectResponse,
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

  export = async (
    id: string,
    body?: ExportProjectRequest,
    expectations?: Expectations
  ) => {
    const expectsError = (expectations?.status || 200) >= 400
    const exp = {
      ...expectations,
      headers: {
        ...expectations?.headers,
        ...(expectsError ? {} : { "Content-Type": "application/gzip" }),
      },
    }

    return await this._post<Buffer>(`/api/projects/${id}/export`, {
      body,
      expectations: exp,
    })
  }

  import = async (
    file: Buffer | string,
    body?: ImportProjectRequest,
    expectations?: Expectations
  ) => {
    return await this._post<ImportProjectResponse>(`/api/projects/import`, {
      fields: body,
      files: {
        file: {
          file,
          name: "project-export.tar.gz",
        },
      },
      expectations,
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
